import { buildCRMPrompt } from "../prompts/crm.prompt";
import { ParsedCSVRecord } from "../types/upload.types";
import { AIExtractionResponse, ConfidenceLevel } from "../types/ai.types";
import { GeminiProvider } from "../lib/gemini.provider";
import { aiResponseSchema } from "../validators/ai-response.schema";
import { withRetry } from "../utils/retry";
import { AppError } from "../errors/AppError";

const RETRY_OPTIONS = {
  maxAttempts: Number(process.env.AI_MAX_RETRIES) || 3,
  baseDelayMs: 1_000,
  maxDelayMs: 10_000,
  onRetry: (attempt: number, error: Error) => {
    console.warn(`[AIService] Retry ${attempt}: ${error.message}`);
  },
};

// Gemini sometimes wraps JSON in markdown code fences despite instructions.
// Strip them before parsing so we never fail on formatting artifacts.
function stripMarkdownCodeBlock(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

export class AIService {
  private readonly provider = new GeminiProvider();

  async extract(records: ParsedCSVRecord[]): Promise<AIExtractionResponse> {
    const prompt = buildCRMPrompt(records);

    const rawText = await withRetry(
      () => this.provider.generate(prompt),
      RETRY_OPTIONS
    );

    return this.parseAndValidate(rawText);
  }

  private parseAndValidate(rawText: string): AIExtractionResponse {
    let parsed: unknown;

    try {
      parsed = JSON.parse(stripMarkdownCodeBlock(rawText));
    } catch {
      throw AppError.unprocessable(
        "AI returned malformed JSON that could not be parsed.",
        "AI_MALFORMED_JSON"
      );
    }

    const result = aiResponseSchema.safeParse(parsed);

    if (!result.success) {
      throw AppError.unprocessable(
        `AI response failed schema validation: ${result.error.message}`,
        "AI_SCHEMA_MISMATCH"
      );
    }

    // Cast confidence values: Zod validated them as ConfidenceLevel strings
    return {
      records: result.data.records.map((r) => ({
        data: r.data,
        confidence: r.confidence as Record<string, ConfidenceLevel>,
        reasoning: r.reasoning,
      })),
    };
  }
}
