export interface UploadResponse {
  headers: string[];
  preview: Record<string, string>[];
  records: Record<string, string>[];
  totalRows: number;
}