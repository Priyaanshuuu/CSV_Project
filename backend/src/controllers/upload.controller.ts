import { Request, Response } from "express";
import { validateUploadedFile } from "../validators/file.validator";

export const uploadCSVController = (
  req: Request,
  res: Response
): void => {
  validateUploadedFile(req);

  res.status(200).json({
    success: true,
    filename: req.file?.originalname,
    size: req.file?.size,
  });
};