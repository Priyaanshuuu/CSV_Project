"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = require("../errors/AppError");
const MULTER_ERROR_MESSAGES = {
    LIMIT_FILE_SIZE: "File too large. Maximum allowed size is 10MB.",
    LIMIT_FILE_COUNT: "Only one file may be uploaded at a time.",
    LIMIT_UNEXPECTED_FILE: "Unexpected file field in the request.",
};
function errorMiddleware(err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    // Multer-specific errors (file size, field names, etc.)
    if (err instanceof multer_1.default.MulterError) {
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
    if (err instanceof AppError_1.AppError) {
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
            message: err instanceof Error
                ? err.message
                : "An unexpected error occurred.",
        },
    });
}
