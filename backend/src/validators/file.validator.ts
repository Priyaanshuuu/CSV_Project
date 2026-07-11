import { Request } from "express";

export const validateUploadedFile = (req: Request): void => {
  if (!req.file) {
    throw new Error("Please upload a CSV file.");
  }

  if (!req.file.buffer.length) {
    throw new Error("Uploaded file is empty.");
  }
};