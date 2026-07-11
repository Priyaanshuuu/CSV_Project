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

    // FieldMismatch (TooFewFields / TooManyFields) are per-row warnings that
    // real-world CSVs produce constantly (trailing commas, blank columns, etc.).
    // Only throw on fatal errors that make the entire file unparseable.
    const fatalErrors = result.errors.filter(
      (e) => e.type !== "FieldMismatch"
    );

    if (fatalErrors.length > 0) {
      throw new Error(fatalErrors[0].message);
    }

    return {
      headers: result.meta.fields ?? [],
      records: result.data,
      totalRows: result.data.length,
    };
  }
}