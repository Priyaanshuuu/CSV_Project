"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const gemini_1 = require("../config/gemini");
class GeminiProvider {
    async generate(prompt) {
        const response = await gemini_1.gemini.models.generateContent({
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
exports.GeminiProvider = GeminiProvider;
