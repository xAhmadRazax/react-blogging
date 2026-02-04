import { registerService } from "@/lib/services/backend/auth.service";
import { ApiResponse } from "@/lib/utils/ApiResponse";
import { catchAsync } from "@/lib/utils/apiWrapper.util";
import { registerSchema } from "@/lib/zodSchemas/auth.schema";
import { StatusCodes } from "http-status-codes";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";

export const POST = catchAsync(async (req: NextRequest, context) => {
  const { email, password, name, gender, confirmPassword, dateOfBirth } =
    await req.json();

  console.log(dateOfBirth);
  registerSchema.parse({
    email,
    password,
    confirmPassword,
    name,
    gender,
    dateOfBirth: new Date(dateOfBirth),
  });
  const baseUrl = req.nextUrl.origin;

  await registerService(baseUrl, {
    email,
    name,
    gender,
    password,
    dateOfBirth,
    avatar: "",
  });

  return ApiResponse.sendJSON(StatusCodes.CREATED, "User Created Successfully");
});
