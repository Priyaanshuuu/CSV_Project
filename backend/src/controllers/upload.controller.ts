import { Request, Response } from "express";
import { validateUploadedFile } from "../validators/file.validator";
import { CSVService } from "../services/csv.service";
import { AppError } from "../errors/AppError";

/**
 * POST /api/upload
 * Parses an uploaded CSV and returns headers + a 10-row preview.
 * No AI is involved at this stage — fast feedback loop for the user.
 */
export const uploadCSVController = (req: Request, res: Response): void => {
  try {
    validateUploadedFile(req);
  } catch (err) {
    throw AppError.badRequest(
      err instanceof Error ? err.message : "Invalid file.",
      "INVALID_FILE"
    );
  }

  let parsed: ReturnType<typeof CSVService.parse>;

  try {
    parsed = CSVService.parse(req.file!.buffer);
  } catch (err) {
    throw AppError.badRequest(
      err instanceof Error ? err.message : "Failed to parse CSV file.",
      "CSV_PARSE_ERROR"
    );
  }

  if (parsed.totalRows === 0) {
    throw AppError.badRequest(
      "The uploaded CSV file contains no data rows.",
      "EMPTY_CSV"
    );
  }

  res.status(200).json({
    success: true,
    headers: parsed.headers,
    preview: parsed.records.slice(0, 10),
    totalRows: parsed.totalRows,
  });
};
