export interface ParsedCSVRecord {
  [key: string]: string;
}

export interface ParsedCSVResult {
  headers: string[];
  records: ParsedCSVRecord[];
  totalRows: number;
}