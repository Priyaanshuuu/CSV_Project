"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const anthropic_1 = require("../config/anthropic");
class AnthropicProvider {
    async generate(prompt) {
        const response = await anthropic_1.anthropic.messages.create({
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
exports.AnthropicProvider = AnthropicProvider;
