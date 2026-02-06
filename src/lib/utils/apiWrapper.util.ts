// lib/api-wrapper.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./apiError.utils";
import { DrizzleError } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

// Define proper types for Next.js route handler context
type RouteContext = {
  params: Promise<Record<string, string>> | Record<string, string>;
};

// Define the exact shape of a Next.js Route Handler
type RouteHandler = (
  req: NextRequest,
  context: RouteContext,
) => Promise<NextResponse> | NextResponse;

// Database error type
interface DatabaseError extends Error {
  code: string;
  detail?: string;
  constraint?: string;
}

// Type guard for database errors
function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    error !== null &&
    typeof error === "object" &&
    "cause" in error &&
    typeof error["cause"] === "object" &&
    error["cause"] !== null &&
    "code" in error["cause"] &&
    typeof error["cause"].code === "string"
  );
}

// Centralized error handler with proper typing
function handleError(error: unknown): NextResponse {
  // console.log(error["cause"]);
  // console.error("🌐 Server Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    console.log(error);
    console.log("Zod error");
    return NextResponse.json(
      {
        message: "Validation Failed",
        details: error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Custom API errors
  if (error instanceof ApiError) {
    console.log("ApiError error");
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  }

  // Database errors (Postgres/Drizzle)
  if (isDatabaseError(error)) {
    console.log("postgres error", error);
    if (
      typeof error === "object" &&
      "cause" in error &&
      typeof error["cause"] === "object" &&
      error["cause"] !== null &&
      "code" in error["cause"] &&
      error["cause"].code === "23505"
    ) {
      let dbErrorOrigin;
      if (
        "constraint" in error["cause"] &&
        typeof error["cause"].constraint === "string"
      ) {
        const errorsArr = error["cause"].constraint.split("_");

        dbErrorOrigin = errorsArr.slice(1, -1);
        dbErrorOrigin = dbErrorOrigin.join(" ");
      }
      return NextResponse.json(
        {
          message: `${dbErrorOrigin} already exists.`,
          field: dbErrorOrigin,
          statusCode: 409,
        },
        { status: StatusCodes.CONFLICT },
      );
    }

    if (
      typeof error === "object" &&
      "cause" in error &&
      typeof error["cause"] === "object" &&
      error["cause"] !== null &&
      "code" in error["cause"] &&
      error["cause"].code === "23503"
    ) {
      return NextResponse.json(
        { message: "Related record not found.", statusCode: 404 },
        { status: 404 },
      );
    }

    // Add more database error codes as needed
  }

  // Standard Error instances
  if (error instanceof Error && !isDatabaseError(error)) {
    console.log("is in Error hehe");
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  // Fallback for unknown errors
  return NextResponse.json(
    { message: "An unexpected error occurred" },
    { status: 500 },
  );
}

export function catchAsync(handler: RouteHandler): RouteHandler {
  return async (
    req: NextRequest,
    context: RouteContext,
  ): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.log("hello im here");
      return handleError(error);
    }
  };
}
