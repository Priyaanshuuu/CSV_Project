"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVService = void 0;
const papaparse_1 = __importDefault(require("papaparse"));
class CSVService {
    static parse(buffer) {
        const csv = buffer.toString("utf-8");
        const result = papaparse_1.default.parse(csv, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
        });
        // FieldMismatch (TooFewFields / TooManyFields) are per-row warnings that
        // real-world CSVs produce constantly (trailing commas, blank columns, etc.).
        // Only throw on fatal errors that make the entire file unparseable.
        const fatalErrors = result.errors.filter((e) => e.type !== "FieldMismatch");
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
exports.CSVService = CSVService;
