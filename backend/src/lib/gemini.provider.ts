import { gemini } from "../config/gemini";
import { LLMProvider } from "../interfaces/llm.interface";

export class GeminiProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  }
}