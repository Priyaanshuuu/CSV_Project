"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const crm_prompt_1 = require("../prompts/crm.prompt");
const groq_provider_1 = require("../lib/groq.provider");
const ai_response_schema_1 = require("../validators/ai-response.schema");
const retry_1 = require("../utils/retry");
const AppError_1 = require("../errors/AppError");
const RETRY_OPTIONS = {
    maxAttempts: Number(process.env.AI_MAX_RETRIES) || 3,
    baseDelayMs: 1_000,
    maxDelayMs: 10_000,
    onRetry: (attempt, error) => {
        console.warn(`[AIService] Retry ${attempt}: ${error.message}`);
    },
};
// Some models wrap JSON in markdown code fences despite instructions — strip them.
function stripMarkdownCodeBlock(text) {
    return text
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();
}
class AIService {
    provider = new groq_provider_1.GroqProvider();
    async extract(records) {
        const prompt = (0, crm_prompt_1.buildCRMPrompt)(records);
        const rawText = await (0, retry_1.withRetry)(() => this.provider.generate(prompt), RETRY_OPTIONS);
        return this.parseAndValidate(rawText);
    }
    parseAndValidate(rawText) {
        let parsed;
        try {
            parsed = JSON.parse(stripMarkdownCodeBlock(rawText));
        }
        catch {
            throw AppError_1.AppError.unprocessable("AI returned malformed JSON that could not be parsed.", "AI_MALFORMED_JSON");
        }
        const result = ai_response_schema_1.aiResponseSchema.safeParse(parsed);
        if (!result.success) {
            throw AppError_1.AppError.unprocessable(`AI response failed schema validation: ${result.error.message}`, "AI_SCHEMA_MISMATCH");
        }
        // Cast confidence values: Zod validated them as ConfidenceLevel strings
        return {
            records: result.data.records.map((r) => ({
                data: r.data,
                confidence: r.confidence,
                reasoning: r.reasoning,
            })),
        };
    }
}
exports.AIService = AIService;
