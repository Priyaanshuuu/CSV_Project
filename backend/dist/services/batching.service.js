"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchingService = void 0;
class BatchingService {
    static split(items, batchSize) {
        if (batchSize <= 0) {
            throw new Error("Batch size must be greater than zero.");
        }
        const batches = [];
        for (let index = 0; index < items.length; index += batchSize) {
            batches.push(items.slice(index, index + batchSize));
        }
        return batches;
    }
}
exports.BatchingService = BatchingService;
