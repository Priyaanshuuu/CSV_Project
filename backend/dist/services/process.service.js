"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessService = void 0;
const batching_service_1 = require("./batching.service");
const ai_service_1 = require("./ai.service");
const validation_service_1 = require("./validation.service");
const confidence_service_1 = require("./confidence.service");
class ProcessService {
    aiService = new ai_service_1.AIService();
    batchSize = Number(process.env.MAX_BATCH_SIZE) || 50;
    concurrency = Number(process.env.BATCH_CONCURRENCY) || 3;
    async process(records) {
        const batches = batching_service_1.BatchingService.split(records, this.batchSize);
        // p-limit v7 is ESM-only; dynamic import works correctly in CommonJS
        const { default: pLimit } = await import("p-limit");
        const limit = pLimit(this.concurrency);
        const settled = await Promise.allSettled(batches.map((batch, index) => limit(() => this.processBatch(batch, index))));
        const processedRecords = [];
        const errors = [];
        for (let i = 0; i < settled.length; i++) {
            const result = settled[i];
            if (result.status === "fulfilled") {
                processedRecords.push(...result.value);
            }
            else {
                const message = result.reason instanceof Error
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
    async processBatch(batch, batchIndex) {
        console.log(`[ProcessService] Batch ${batchIndex}: processing ${batch.length} records`);
        const aiResponse = await this.aiService.extract(batch);
        return aiResponse.records.map((record) => {
            const validation = validation_service_1.ValidationService.validateRecord(record.data);
            const { perField, overall } = confidence_service_1.ConfidenceService.compute(record.confidence, validation);
            return {
                data: record.data,
                confidence: perField,
                overallConfidence: overall,
                reasoning: record.reasoning,
                validation,
            };
        });
    }
}
exports.ProcessService = ProcessService;
