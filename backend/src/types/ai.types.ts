import { CRMLead } from "./crm.types";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type FieldConfidence = Partial<
  Record<keyof CRMLead, ConfidenceLevel>
>;

export type FieldReasoning = Partial<
  Record<keyof CRMLead, string>
>;

export interface AIExtractedRecord {
  data: CRMLead;
  confidence: FieldConfidence;
  reasoning: FieldReasoning;
}

export interface AIExtractionResponse {
  records: AIExtractedRecord[];
}