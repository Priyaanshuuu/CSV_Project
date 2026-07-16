"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, code = "BAD_REQUEST") {
        return new AppError(message, 400, code);
    }
    static unprocessable(message, code = "UNPROCESSABLE") {
        return new AppError(message, 422, code);
    }
    static internal(message, code = "INTERNAL_ERROR") {
        return new AppError(message, 500, code);
    }
}
exports.AppError = AppError;
