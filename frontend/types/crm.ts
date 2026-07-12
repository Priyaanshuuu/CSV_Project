export interface CRMRecord {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  source?: string;
  notes?: string;
  confidence?: number;
  [key: string]: string | number | undefined;
}

export interface SkippedRecord {
  row: number;
  reason: string;
  data: Record<string, string>;
}
