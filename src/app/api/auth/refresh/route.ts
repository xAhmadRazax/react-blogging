import {
  loginService,
  refreshTokenService,
} from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { setAuthCookie } from "@/lib/utils/cookies.util";
import { ms } from "@/lib/utils/util";
import { loginSchema, registerSchema } from "@/lib/zodSchemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse, NextRequest, userAgent } from "next/server";
import { cookies } from "next/headers";

export const POST = catchAsync(async (req: NextRequest, context) => {
  try {
    const cookieStore = await cookies();

    const refreshTokenOb = cookieStore.get("refreshToken");

    if (!refreshTokenOb?.value) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Session expire please login again.",
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");

    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1"; // Fallback for local dev

    // 2. Get high-level Device info using Next.js built-in helper
    const { device, browser, os } = userAgent(req);

    const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    if (!refreshExpiry) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "refresh Expiry is not define",
      );
    }

    //   console.log(device, os, browser);
    const { refreshToken, accessToken } = await refreshTokenService({
      refreshToken: refreshTokenOb!.value,

      ip,
      device: device.type || "desktop",
      browser: browser.name || "",
      os: os.name || "",
      osVersion: os.version || "",
    });
    console.log("im here 13");
    const response = setAuthCookie(
      ApiResponse.sendJSON(StatusCodes.OK, "user login successfully", {
        accessToken,
      }),

      "refreshToken",
      refreshToken,
      ms(process.env.REFRESH_TOKEN_EXPIRY!),
    );
    console.log("im here 14");
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      const response = setAuthCookie(
        ApiResponse.sendJSON(error.statusCode, error.message),
        "refreshToken",
        "",
        0,
      );

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
});
