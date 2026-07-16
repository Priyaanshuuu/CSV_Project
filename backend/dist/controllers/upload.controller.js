"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSVController = void 0;
const file_validator_1 = require("../validators/file.validator");
const csv_service_1 = require("../services/csv.service");
const AppError_1 = require("../errors/AppError");
/**
 * POST /api/upload
 * Parses an uploaded CSV and returns headers + a 10-row preview.
 * No AI is involved at this stage — fast feedback loop for the user.
 */
const uploadCSVController = (req, res) => {
    try {
        (0, file_validator_1.validateUploadedFile)(req);
    }
    catch (err) {
        throw AppError_1.AppError.badRequest(err instanceof Error ? err.message : "Invalid file.", "INVALID_FILE");
    }
    let parsed;
    try {
        parsed = csv_service_1.CSVService.parse(req.file.buffer);
    }
    catch (err) {
        throw AppError_1.AppError.badRequest(err instanceof Error ? err.message : "Failed to parse CSV file.", "CSV_PARSE_ERROR");
    }
    if (parsed.totalRows === 0) {
        throw AppError_1.AppError.badRequest("The uploaded CSV file contains no data rows.", "EMPTY_CSV");
    }
    res.status(200).json({
        success: true,
        headers: parsed.headers,
        preview: parsed.records.slice(0, 10),
        records: parsed.records,
        totalRows: parsed.totalRows,
    });
};
exports.uploadCSVController = uploadCSVController;
