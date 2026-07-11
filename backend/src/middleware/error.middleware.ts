import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../errors/AppError";

const MULTER_ERROR_MESSAGES: Partial<Record<string, string>> = {
  LIMIT_FILE_SIZE: "File too large. Maximum allowed size is 10MB.",
  LIMIT_FILE_COUNT: "Only one file may be uploaded at a time.",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field in the request.",
};

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Multer-specific errors (file size, field names, etc.)
  if (err instanceof multer.MulterError) {
    res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      success: false,
      error: {
        code: err.code,
        message: MULTER_ERROR_MESSAGES[err.code] ?? err.message,
      },
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Unexpected errors — log and return a generic response
  console.error("[ErrorMiddleware] Unhandled error:", err);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.",
    },
  });
}
