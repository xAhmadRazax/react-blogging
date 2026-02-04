import { StatusCodes } from "http-status-codes";

// lib/exceptions.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number | StatusCodes = 500,
    public message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
