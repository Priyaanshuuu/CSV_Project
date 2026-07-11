import { CRMLead } from "../types/crm.types";
import { ConfidenceLevel, FieldConfidence } from "../types/ai.types";
import { FieldValidation } from "./validation.service";

const CONFIDENCE_RANK: Record<ConfidenceLevel, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const RANK_TO_LEVEL: Record<number, ConfidenceLevel> = {
  3: "HIGH",
  2: "MEDIUM",
  1: "LOW",
};

export interface ConfidenceResult {
  perField: FieldConfidence;
  overall: ConfidenceLevel;
}

export class ConfidenceService {
  /**
   * Merges AI semantic confidence with deterministic backend validation.
   *
   * Rule: validation failure always overrides AI confidence → LOW.
   * This prevents a "HIGH" AI confidence from masking a format error
   * that a human reviewer must catch.
   */
  static compute(
    aiConfidence: Record<string, ConfidenceLevel>,
    validation: FieldValidation
  ): ConfidenceResult {
    const perField: FieldConfidence = {};

    for (const rawKey of Object.keys(aiConfidence)) {
      const key = rawKey as keyof CRMLead;
      const aiLevel = aiConfidence[rawKey];

      if (!aiLevel) continue;

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
  private static computeOverall(perField: FieldConfidence): ConfidenceLevel {
    const levels = Object.values(perField).filter(
      (v): v is ConfidenceLevel => v !== undefined
    );

    if (levels.length === 0) return "LOW";

    const minRank = Math.min(...levels.map((l) => CONFIDENCE_RANK[l]));

    return RANK_TO_LEVEL[minRank] ?? "LOW";
  }
}
