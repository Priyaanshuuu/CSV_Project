import Papa from "papaparse";
import { ParsedCSVResult } from "../types/upload.types";

export class CSVService {
  static parse(buffer: Buffer): ParsedCSVResult {
    const csv = buffer.toString("utf-8");

    const result = Papa.parse<Record<string, string>>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    return {
      headers: result.meta.fields ?? [],
      records: result.data,
      totalRows: result.data.length,
    };
  }
}