import { gemini } from "../config/gemini";
import { LLMProvider } from "../interfaces/llm.interface";

export class GeminiProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text ?? "";
  }
}