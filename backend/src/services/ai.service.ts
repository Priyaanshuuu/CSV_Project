import { buildCRMPrompt } from "../prompts/crm.prompt";
import { ParsedCSVRecord } from "../types/upload.types";
import { GeminiProvider } from "../lib/gemini.provider";

export class AIService {
  private provider = new GeminiProvider();

  async extract(records: ParsedCSVRecord[]) {
    const prompt = buildCRMPrompt(records);

    const result = await this.provider.generate(prompt);

    return JSON.parse(result);
  }
}