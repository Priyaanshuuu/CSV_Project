"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = void 0;
const multer_1 = __importDefault(require("multer"));
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
const storage = multer_1.default.memoryStorage();
const fileFilter = (_, file, cb) => {
    const isCSV = file.mimetype === "text/csv" ||
        file.originalname.toLowerCase().endsWith(".csv");
    if (!isCSV) {
        return cb(new Error("Only CSV files are allowed."));
    }
    cb(null, true);
};
exports.uploadCSV = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
    fileFilter,
});
