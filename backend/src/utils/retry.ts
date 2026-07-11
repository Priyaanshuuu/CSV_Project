export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  onRetry?: (attempt: number, error: Error) => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exponential backoff with full jitter.
 * Jitter prevents thundering-herd when multiple batches fail simultaneously.
 */
function computeDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponential = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
  return Math.floor(Math.random() * exponential);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, onRetry } = options;

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === maxAttempts) break;

      onRetry?.(attempt, lastError);
      await sleep(computeDelay(attempt, baseDelayMs, maxDelayMs));
    }
  }

  throw lastError;
}
