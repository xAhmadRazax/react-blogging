import { refreshTokenService } from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { clearAuthCookies, setAuthCookies } from "@/lib/utils/cookies.util";
import { ms } from "@/lib/utils/util";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse, NextRequest, userAgent } from "next/server";
import { cookies } from "next/headers";

export const POST = catchAsync(async (req: NextRequest, context) => {
  console.log("refreshing token.....");
  try {
    const cookieStore = await cookies();
    const body = await req.json();

    const refreshTokenOb = cookieStore.get("refreshToken");

    const token = refreshTokenOb?.value || body.refreshToken;
    console.log(token, "token objecT?");

    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Session expire please login again.",
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");

    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1"; // Fallback for local dev

    // 2. Get high-level Device info using Next.js built-in helper
    const { device, browser, os } = userAgent(req);

    console.log("refreshing token 1.....");
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    if (!refreshTokenExpiry || !accessTokenExpiry) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "refresh Expiry is not define",
      );
    }
    console.log("refreshing token 2.....");

    //   console.log(device, os, browser);
    const { refreshToken, accessToken } = await refreshTokenService({
      refreshToken: token,

      ip,
      device: device.type || "desktop",
      browser: browser.name || "",
      os: os.name || "",
      osVersion: os.version || "",
    });

    const res = ApiResponse.sendJSON(
      StatusCodes.OK,
      "refresh token rotate successfully",
      {
        accessToken,
        refreshToken,
      },
    );

    return setAuthCookies(res, {
      accessToken: {
        value: accessToken,
        maxAge: ms(accessTokenExpiry),
      },
      refreshToken: {
        value: refreshToken,
        maxAge: ms(refreshTokenExpiry),
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const response = ApiResponse.sendJSON(error.statusCode, error.message);
      return clearAuthCookies(response);
    }

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
});
