import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getExpiryDate } from "./date.util";

export async function setAuthCookie(
  cookieName: string,
  value: string,
  maxAge: number,
) {
  const cookieOptions = {
    httpOnly: true,
    // sameSite: ,
    secure: false,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  const cookieStore = await cookies();

  // .cookie("accessToken", accessToken, cookieOptions)
  cookieStore.set(cookieName, value, {
    ...cookieOptions,
    maxAge,
  });
}
