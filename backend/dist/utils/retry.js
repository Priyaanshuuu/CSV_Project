"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Exponential backoff with full jitter.
 * Jitter prevents thundering-herd when multiple batches fail simultaneously.
 */
function computeDelay(attempt, baseDelayMs, maxDelayMs) {
    const exponential = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
    return Math.floor(Math.random() * exponential);
}
async function withRetry(fn, options) {
    const { maxAttempts, baseDelayMs, maxDelayMs, onRetry } = options;
    let lastError = new Error("Unknown error");
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            if (attempt === maxAttempts)
                break;
            onRetry?.(attempt, lastError);
            await sleep(computeDelay(attempt, baseDelayMs, maxDelayMs));
        }
    }
    throw lastError;
}
