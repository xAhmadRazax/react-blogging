// lib/utils/cookies.util.ts
import type { NextResponse } from "next/server";

interface CookieOptions {
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  secure?: boolean;
  maxAge?: number;
}

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

/**
 * Get cookie options for auth tokens
 * Use this to keep cookie config in one place
 */
export function getAuthCookieOptions(maxAge?: number): CookieOptions {
  return {
    ...DEFAULT_COOKIE_OPTIONS,
    ...(maxAge && { maxAge }),
  };
}

/**
 * Set a single cookie on the response
 */
export function setCookie(
  res: NextResponse,
  name: string,
  value: string,
  options?: Partial<CookieOptions>,
): NextResponse {
  const cookieOptions = { ...getAuthCookieOptions(), ...options };
  res.cookies.set(name, value, cookieOptions);
  return res;
}

/**
 * Set multiple auth cookies at once
 * Cleaner when you need to set both access and refresh tokens
 */
export function setAuthCookies(
  res: NextResponse,
  tokens: Record<string, { value: string; maxAge?: number }>,
): NextResponse {
  Object.entries(tokens).forEach(([name, { value, maxAge }]) => {
    setCookie(res, name, value, { maxAge });
  });
  return res;
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(res: NextResponse): NextResponse {
  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");
  return res;
}
