import { protect, logoutService } from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { setAuthCookie } from "@/lib/utils/cookies.util";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = catchAsync(async (req: NextRequest, context) => {
  const cookieList = await cookies();
  const user = await protect();

  const token = cookieList.get("refreshToken");

  if (token) logoutService({ userId: user.id as string, token: token.value });
  const response = setAuthCookie(
    ApiResponse.sendJSON(StatusCodes.OK, "user logout successfully"),
    "refreshToken",
    "",
    0,
  );
  return response;
});
