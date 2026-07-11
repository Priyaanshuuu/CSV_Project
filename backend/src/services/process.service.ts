import { ParsedCSVRecord } from "../types/upload.types";
import { ConfidenceLevel, FieldConfidence } from "../types/ai.types";
import { CRMLead } from "../types/crm.types";
import { BatchingService } from "./batching.service";
import { AIService } from "./ai.service";
import { ValidationService, FieldValidation } from "./validation.service";
import { ConfidenceService } from "./confidence.service";

export interface ProcessedRecord {
  data: CRMLead;
  confidence: FieldConfidence;
  overallConfidence: ConfidenceLevel;
  reasoning: Partial<Record<keyof CRMLead, string>>;
  validation: FieldValidation;
}

export interface BatchError {
  batchIndex: number;
  error: string;
}

export interface ProcessResult {
  records: ProcessedRecord[];
  errors: BatchError[];
  totalBatches: number;
  successfulBatches: number;
}

export class ProcessService {
  private readonly aiService = new AIService();
  private readonly batchSize = Number(process.env.MAX_BATCH_SIZE) || 50;
  private readonly concurrency = Number(process.env.BATCH_CONCURRENCY) || 3;

  async process(records: ParsedCSVRecord[]): Promise<ProcessResult> {
    const batches = BatchingService.split(records, this.batchSize);

    // p-limit v7 is ESM-only; dynamic import works correctly in CommonJS
    const { default: pLimit } = await import("p-limit");
    const limit = pLimit(this.concurrency);

    const settled = await Promise.allSettled(
      batches.map((batch, index) =>
        limit(() => this.processBatch(batch, index))
      )
    );

    const processedRecords: ProcessedRecord[] = [];
    const errors: BatchError[] = [];

    for (let i = 0; i < settled.length; i++) {
      const result = settled[i];

      if (result.status === "fulfilled") {
        processedRecords.push(...result.value);
      } else {
        const message =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);

        errors.push({ batchIndex: i, error: message });
        console.error(`[ProcessService] Batch ${i} failed: ${message}`);
      }
    }

    return {
      records: processedRecords,
      errors,
      totalBatches: batches.length,
      successfulBatches: batches.length - errors.length,
    };
  }

  private async processBatch(
    batch: ParsedCSVRecord[],
    batchIndex: number
  ): Promise<ProcessedRecord[]> {
    console.log(
      `[ProcessService] Batch ${batchIndex}: processing ${batch.length} records`
    );

    const aiResponse = await this.aiService.extract(batch);

    return aiResponse.records.map((record) => {
      const validation = ValidationService.validateRecord(record.data);
      const { perField, overall } = ConfidenceService.compute(
        record.confidence,
        validation
      );

      return {
        data: record.data,
        confidence: perField,
        overallConfidence: overall,
        reasoning: record.reasoning as Partial<Record<keyof CRMLead, string>>,
        validation,
      };
    });
  }
}
