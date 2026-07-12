import { openai } from "../config/openai";
import { LLMProvider } from "../interfaces/llm.interface";

export class OpenAIProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error("OpenAI returned an empty response.");
    }

    return text;
  }
}
