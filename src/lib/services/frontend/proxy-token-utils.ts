import { generateAccessToken, verifyJwtToken } from "@/lib/utils/jwt.util";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { getUser } from "../backend/user.service";
import { User } from "@/lib/types/user.type";
import {
  encryptCryptoToken,
  generateVerifierAndHashedVerifier,
} from "@/lib/utils/crypto.util";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { getExpiryDate } from "@/lib/utils/date.util";

export const protectProxy = async (): Promise<{
  status: "success" | "error";
  errorCode?:
    | "ERR_TOKEN_NOT_FOUND"
    | "ERR_INVALID_TOKEN"
    | "ERR_TOKEN_SECRET_NOT_FOUND"
    | "ERR_TOKEN_EXPIRE"
    | "ERR_USER_NOT_FOUND"
    | "ERR_TOKEN_ERR"
    | "ERR_UNKNOWN";
  user?: User;
}> => {
  // 01 check if the authorization header exist

  const headersList = await headers();
  const cookieStore = await cookies();

  try {
    const accessToken = headersList.get("authorization")?.startsWith("Bearer")
      ? headersList.get("authorization")?.split(" ")?.[1]
      : cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      // throw new ApiError(
      //   StatusCodes.UNAUTHORIZED,
      //   "Please login to access this resource",
      // );

      return { status: "error", errorCode: "ERR_TOKEN_NOT_FOUND" };
    }

    const jwtSecret = process?.env?.ACCESS_TOKEN_SECRET;

    if (!jwtSecret) {
      return { status: "error", errorCode: "ERR_TOKEN_SECRET_NOT_FOUND" };
    }

    const decodedJWT = jwt.verify(accessToken, jwtSecret) as JwtPayload;

    // 03 check if token exist or user's id exist in token
    if (!decodedJWT || !decodedJWT.id || !decodedJWT.iat) {
      return { status: "error", errorCode: "ERR_INVALID_TOKEN" };
    }

    // 04 from the decoded token check if user exists
    const user = await getUser(decodedJWT.id);
    if (!user) return { status: "error", errorCode: "ERR_USER_NOT_FOUND" };

    // 05 check if the user's password has been change after the token was issued

    if (
      user?.passwordChangedAt &&
      new Date(user.passwordChangedAt).getTime() > decodedJWT.iat * 1000
    ) {
      return { status: "error", errorCode: "ERR_TOKEN_EXPIRE" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...publicUser } = user;
    return { status: "success", user: publicUser };
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      return { status: "error", errorCode: "ERR_TOKEN_EXPIRE" };
    }
    if ((error as Error).name === "JsonWebTokenError") {
      return { status: "error", errorCode: "ERR_TOKEN_ERR" };
    }

    return { status: "error", errorCode: "ERR_UNKNOWN" };
  }
};

export async function refreshTokenProxy({
  refreshToken,
  device,
  ip,
  os,
  osVersion,
  browser,
}: {
  refreshToken: string;
  device: string;
  ip: string;
  os: string;
  osVersion: string;
  browser: string;
}): Promise<{
  status: "success" | "error";
  errorCode?:
    | "ERR_UNAUTHORIZED_ACCESS"
    | "ERR_TOKEN_REUSE_DETECTED"
    | "ERR_INVALID_TOKEN"
    | "ERR_TOKEN_EXPIRE"
    | "ERR_TOKEN_SECRET_NOT_FOUND";
  accessToken?: string;
  refreshToken?: string;
}> {
  console.log("token///////////////////////////", refreshToken);
  const [selector, verifier] = refreshToken.split(".");
  if (!selector || !verifier) {
    return {
      status: "error",
      errorCode: "ERR_UNAUTHORIZED_ACCESS",
    };
  }
  const hashedVerifier = encryptCryptoToken(verifier, "sha256");
  //01 check if session exist in the db that has
  // same selector as the refreshToken
  // same verifierHash  as we have in the refreshToken
  // shouldn't be revoked,
  // shouldn't be used
  // should'nt be expire

  const [token] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.tokenFamily, selector),
        eq(sessions.tokenHash, hashedVerifier),
        eq(sessions.isRevoked, false),
        eq(sessions.isUsed, false),
        gt(sessions.tokenExpiry, new Date()),
      ),
    );

  if (!token) {
    const [tokenFamily] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenFamily, selector),
          eq(sessions.tokenHash, hashedVerifier),
        ),
      );
    // if token family exist revoke all token that belongs to this family
    await db
      .update(sessions)
      .set({ isRevoked: true })
      .where(
        and(
          eq(sessions.tokenFamily, selector),
          eq(sessions.tokenHash, hashedVerifier),
        ),
      );
    if (tokenFamily) {
      return { status: "error", errorCode: "ERR_TOKEN_REUSE_DETECTED" };
    }

    return { status: "error", errorCode: "ERR_INVALID_TOKEN" };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, token.userId));

  // check if user exist in the db if it doesn't exist that mean user
  // has delete its account so we need to again revoke the token
  if (!user) {
    await db
      .update(sessions)
      .set({ isRevoked: true })
      .where(
        and(
          eq(sessions.tokenFamily, selector),
          eq(sessions.tokenHash, hashedVerifier),
        ),
      );

    return { status: "error", errorCode: "ERR_INVALID_TOKEN" };
  }

  // check if user has changed its password after token has been issued
  // if they have we will revoke the token family again
  if (
    user?.passwordChangedAt &&
    new Date(user.passwordChangedAt).getTime() >
      new Date(token.createdAt).getTime()
  ) {
    console.log("refreshing token 13.....");
    await db
      .update(sessions)
      .set({ isRevoked: true })
      .where(
        and(
          eq(sessions.tokenFamily, selector),
          eq(sessions.tokenHash, hashedVerifier),
        ),
      );
    console.log("refreshing token 14.....");
    return { status: "error", errorCode: "ERR_TOKEN_EXPIRE" };
  }
  const verifierPair = generateVerifierAndHashedVerifier();

  if (!process.env.REFRESH_TOKEN_EXPIRY) {
    return { status: "error", errorCode: "ERR_TOKEN_SECRET_NOT_FOUND" };
  }

  const tokenExpiry = getExpiryDate(process.env.REFRESH_TOKEN_EXPIRY);
  // creating new user session and linking the old session with new one
  await db.transaction(async (tx) => {
    // creating new user session
    const [newSessionToken] = await tx
      .insert(sessions)
      .values({
        tokenFamily: token.tokenFamily,
        tokenHash: verifierPair.hashedVerifier,
        tokenExpiry,
        device: device || token.device,
        ipAddress: ip,
        os: os || token.os,
        osVersion: osVersion || token.osVersion,
        browser: browser || token.browser,
        userId: user.id,
      })
      .returning();

    // creating link between old session and new session

    await tx
      .update(sessions)
      .set({
        isUsed: true,
        replacedBy: newSessionToken!.id,
      })
      .where(eq(sessions.id, token.id));

    return {
      newSessionToken,
    };
  });

  // generating new access token

  const accessToken = generateAccessToken(user);
  return {
    status: "success",
    accessToken,
    refreshToken: `${token.tokenFamily}.${verifierPair.verifier}`,
  };
}
