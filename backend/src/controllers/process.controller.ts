import { Request, Response } from "express";
import { ProcessService } from "../services/process.service";
import { ParsedCSVRecord } from "../types/upload.types";
import { AppError } from "../errors/AppError";

const processService = new ProcessService();

/**
 * POST /api/process
 * Accepts raw CSV records and runs them through:
 *   AI extraction → deterministic validation → confidence scoring
 *
 * Batches are processed concurrently with error isolation — a failed batch
 * does not abort the entire import. Partial results are always returned.
 */
export const processController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { records } = req.body as { records?: ParsedCSVRecord[] };

  if (!Array.isArray(records) || records.length === 0) {
    throw AppError.badRequest(
      "Request body must contain a non-empty 'records' array.",
      "MISSING_RECORDS"
    );
  }

  const result = await processService.process(records);

  res.status(200).json({
    success: true,
    data: result,
  });
};
