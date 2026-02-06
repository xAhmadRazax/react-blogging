import type { NextResponse } from "next/server";
import { getExpiryDate } from "./date.util";

export async function setAuthCookie(
  res: NextResponse,
  cookieName: string,
  value: string,
  maxAge: number,
) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // .cookie("accessToken", accessToken, cookieOptions)
  res.cookies.set(cookieName, value, {
    ...cookieOptions,
    maxAge,
  });

  return res;
}
