"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processController = void 0;
const process_service_1 = require("../services/process.service");
const AppError_1 = require("../errors/AppError");
const processService = new process_service_1.ProcessService();
/**
 * POST /api/process
 * Accepts raw CSV records and runs them through:
 *   AI extraction → deterministic validation → confidence scoring
 *
 * Batches are processed concurrently with error isolation — a failed batch
 * does not abort the entire import. Partial results are always returned.
 */
const processController = async (req, res) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
        throw AppError_1.AppError.badRequest("Request body must contain a non-empty 'records' array.", "MISSING_RECORDS");
    }
    const result = await processService.process(records);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.processController = processController;
