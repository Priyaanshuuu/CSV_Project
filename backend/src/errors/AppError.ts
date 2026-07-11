export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST"): AppError {
    return new AppError(message, 400, code);
  }

  static unprocessable(message: string, code = "UNPROCESSABLE"): AppError {
    return new AppError(message, 422, code);
  }

  static internal(message: string, code = "INTERNAL_ERROR"): AppError {
    return new AppError(message, 500, code);
  }
}
