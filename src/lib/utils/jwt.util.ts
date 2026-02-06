import { StatusCodes } from "http-status-codes";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { User } from "../types/user.type";
import { ApiError } from "@/lib/utils/apiError.utils";

export const generateAccessAndRefreshToken = (
  user: User,
):
  | {
      accessToken: string;
      refreshToken: string;
    }
  | never => {
  if (!user) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Refresh token Expiry or access token Expiry not defined in .env",
    );
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Refresh token or access token not defined in .env",
    );
  }

  if (!accessTokenExpiry || !refreshTokenExpiry) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Refresh token Expiry or access token Expiry not defined in .env",
    );
  }

  const refreshToken = generateJwtToken(
    { id: user.id },
    refreshTokenSecret,
    refreshTokenExpiry,
  );
  const accessToken = generateJwtToken(
    { id: user.id, isVerified: user.isVerified },
    accessTokenSecret,
    accessTokenExpiry,
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const generateAccessToken = (user: User): string | never => {
  if (!user) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Refresh token Expiry or access token Expiry not defined in .env",
    );
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

  if (!accessTokenSecret) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Access token not defined in .env",
    );
  }

  if (!accessTokenExpiry) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Access token Expiry not defined in .env",
    );
  }

  const accessToken = generateJwtToken(
    {
      id: user.id,
      isVerified: user.isVerified,
      email: user.email,
      roles: ["user", "admin"],
      permissions: ["read:posts", "write:posts"],
    },
    accessTokenSecret,
    accessTokenExpiry,
  );

  return accessToken;
};

export const verifyJwtToken = (
  token: string,
  isRefreshToken: boolean = false,
): JwtPayload => {
  const jwtSecret = isRefreshToken
    ? process?.env?.REFRESH_TOKEN_SECRET
    : process?.env?.ACCESS_TOKEN_SECRET;

  if (!jwtSecret) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${isRefreshToken ? "Refresh" : "Access"}_TOKEN_SECRET variable is missing in environment.`,
    );
  }

  const decodedJWT = jwt.verify(token, jwtSecret) as JwtPayload;

  return decodedJWT;
};

function generateJwtToken(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  jwtSecret: string,
  jwtExpiry: string,
): string {
  const token = jwt.sign({ ...data }, jwtSecret as string, {
    expiresIn: jwtExpiry as jwt.SignOptions["expiresIn"],
  });
  return token;
}
