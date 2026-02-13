import { protect } from "@/lib/services/backend/auth.service";
import { createOrganizationServer } from "@/lib/services/backend/org.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";

export const POST = catchAsync(async (req: NextRequest, context) => {
  console.log("refreshing token.....");
  const user = await protect();
  const { name, avatar } = await req.json();
  const data = await createOrganizationServer({
    user,
    orgName: name,
    orgAvatar: avatar,
  });

  return ApiResponse.sendJSON(
    StatusCodes.CREATED,
    "Organization created Successfully",
    {
      data,
    },
  );
});

export const PATCH = catchAsync(async (req: NextRequest, context) => {});
