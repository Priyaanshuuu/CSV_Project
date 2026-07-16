"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = require("../config/openai");
class OpenAIProvider {
    async generate(prompt) {
        const response = await openai_1.openai.chat.completions.create({
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
exports.OpenAIProvider = OpenAIProvider;
