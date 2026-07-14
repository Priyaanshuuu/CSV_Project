import { anthropic } from "../config/anthropic";
import { LLMProvider } from "../interfaces/llm.interface";

export class AnthropicProvider implements LLMProvider {
  async generate(prompt: string): Promise<string> {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 16000,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content.find((b) => b.type === "text");

    if (!block || block.type !== "text") {
      throw new Error("Claude returned an empty response.");
    }

    return block.text;
  }
}
