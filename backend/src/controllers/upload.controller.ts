import { Request, Response } from "express";

import { validateUploadedFile } from "../validators/file.validator";
import { CSVService } from "../services/csv.service";

export const uploadCSVController = (
  req: Request,
  res: Response
): void => {
  validateUploadedFile(req);

  const parsed = CSVService.parse(req.file!.buffer);

  res.status(200).json({
    success: true,

    headers: parsed.headers,

    preview: parsed.records.slice(0, 10),

    totalRows: parsed.totalRows,
  });
};