import { groq } from "../config/groq";
import { LLMProvider } from "../interfaces/llm.interface";

export class GroqProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned an empty response.");
    }

    return text;
  }
}
