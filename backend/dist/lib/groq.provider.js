"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqProvider = void 0;
const groq_1 = require("../config/groq");
class GroqProvider {
    async generate(prompt) {
        const response = await groq_1.groq.chat.completions.create({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            response_format: { type: "json_object" },
        });
        const text = response.choices[0]?.message?.content;
        if (!text) {
            throw new Error("Groq returned an empty response.");
        }
        return text;
    }
}
exports.GroqProvider = GroqProvider;
