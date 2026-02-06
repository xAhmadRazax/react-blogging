import { protect } from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export const GET = catchAsync(async (req: NextRequest, context) => {
  const user = await protect();

  return ApiResponse.sendJSON(StatusCodes.OK, "user get successfully", {
    user,
  });
});
