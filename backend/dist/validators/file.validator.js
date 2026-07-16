"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFile = void 0;
const validateUploadedFile = (req) => {
    if (!req.file) {
        throw new Error("Please upload a CSV file.");
    }
    if (!req.file.buffer.length) {
        throw new Error("Uploaded file is empty.");
    }
};
exports.validateUploadedFile = validateUploadedFile;
