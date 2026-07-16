"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceService = void 0;
const CONFIDENCE_RANK = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
};
const RANK_TO_LEVEL = {
    3: "HIGH",
    2: "MEDIUM",
    1: "LOW",
};
class ConfidenceService {
    /**
     * Merges AI semantic confidence with deterministic backend validation.
     *
     * Rule: validation failure always overrides AI confidence → LOW.
     * This prevents a "HIGH" AI confidence from masking a format error
     * that a human reviewer must catch.
     */
    static compute(aiConfidence, validation) {
        const perField = {};
        for (const rawKey of Object.keys(aiConfidence)) {
            const key = rawKey;
            const aiLevel = aiConfidence[rawKey];
            if (!aiLevel)
                continue;
            const isValid = validation[key];
            // Validation explicitly failed — downgrade to LOW regardless of AI opinion
            perField[key] = isValid === false ? "LOW" : aiLevel;
        }
        return { perField, overall: this.computeOverall(perField) };
    }
    /**
     * Overall confidence = minimum across all mapped fields.
     * One LOW field means the entire record needs human review.
     */
    static computeOverall(perField) {
        const levels = Object.values(perField).filter((v) => v !== undefined);
        if (levels.length === 0)
            return "LOW";
        const minRank = Math.min(...levels.map((l) => CONFIDENCE_RANK[l]));
        return RANK_TO_LEVEL[minRank] ?? "LOW";
    }
}
exports.ConfidenceService = ConfidenceService;
