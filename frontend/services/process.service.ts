import api from "@/lib/axios";
import { ProcessResponse } from "@/context/uploadContext";
import { CRMRecord, SkippedRecord } from "@/types/crm";

type BackendProcessedRecord = {
  data: {
    name: string | null;
    email: string | null;
    company: string | null;
    city: string | null;
    country_code: string | null;
    mobile_without_country_code: string | null;
    data_source: string | null;
  };
  overallConfidence: "HIGH" | "MEDIUM" | "LOW";
};

type BackendProcessResult = {
  records: BackendProcessedRecord[];
  errors: { batchIndex: number; error: string }[];
  totalBatches: number;
  successfulBatches: number;
};

function confidenceToScore(
  confidence: BackendProcessedRecord["overallConfidence"]
): number {
  switch (confidence) {
    case "HIGH":
      return 0.9;
    case "MEDIUM":
      return 0.65;
    case "LOW":
    default:
      return 0.3;
  }
}

function mapToCRMRecord(record: BackendProcessedRecord): CRMRecord {
  const { data, overallConfidence } = record;

  return {
    name: data.name ?? undefined,
    email: data.email ?? undefined,
    phone: [data.country_code, data.mobile_without_country_code]
      .filter(Boolean)
      .join(" ") || undefined,
    company: data.company ?? undefined,
    city: data.city ?? undefined,
    source: data.data_source ?? undefined,
    confidence: confidenceToScore(overallConfidence),
  };
}

function mapToSkippedRecords(
  errors: BackendProcessResult["errors"]
): SkippedRecord[] {
  return errors.map((error) => ({
    row: error.batchIndex + 1,
    reason: error.error,
    data: {},
  }));
}

export async function processCSV(
  records: Record<string, string>[]
): Promise<ProcessResponse> {
  const startedAt = Date.now();
  const { data } = await api.post("/process", { records });

  const result = data.data as BackendProcessResult;

  const imported = result.records.map(mapToCRMRecord);
  const skipped = mapToSkippedRecords(result.errors);

  return {
    imported,
    skipped,
    summary: {
      totalRows: records.length,
      imported: imported.length,
      skipped: skipped.length,
      processingTime: Date.now() - startedAt,
    },
  };
}
