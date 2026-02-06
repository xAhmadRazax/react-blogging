import { loginService } from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { setAuthCookie } from "@/lib/utils/cookies.util";
import { ms } from "@/lib/utils/util";
import { loginSchema, registerSchema } from "@/lib/zodSchemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse, NextRequest, userAgent } from "next/server";

export const POST = catchAsync(async (req: NextRequest, context) => {
  const forwarded = req.headers.get("x-forwarded-for");

  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1"; // Fallback for local dev

  // 2. Get high-level Device info using Next.js built-in helper
  const { device, browser, os } = userAgent(req);
  const { email, password } = await req.json();

  loginSchema.parse({
    email,
    password,
  });

  //   console.log(device, os, browser);
  const { user, refreshToken, accessToken } = await loginService({
    email,
    password,
    ip,
    device: device.type || "desktop",
    browser: browser.name || "",
    os: os.name || "",
    osVersion: os.version || "",
  });

  const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  if (!refreshExpiry) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "refresh Expiry is not define",
    );
  }

  const response = setAuthCookie(
    ApiResponse.sendJSON(StatusCodes.OK, "user login successfully", {
      user,
      accessToken,
    }),
    "refreshToken",
    refreshToken,
    ms(process.env.REFRESH_TOKEN_EXPIRY!),
  );
  return response;
});
