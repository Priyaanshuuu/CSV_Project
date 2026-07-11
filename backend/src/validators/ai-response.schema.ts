import { z } from "zod";

export const confidenceEnum = z.enum(["HIGH", "MEDIUM", "LOW"]);

const crmStatusEnum = z.enum([
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

const dataSourceEnum = z.enum([
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);

/**
 * Mirrors CRMLead exactly so the Zod schema is the single source of truth
 * for what fields we accept from the AI. Any field the AI hallucinates that
 * isn't listed here will be stripped by .strip() (Zod v4 default).
 */
const crmLeadSchema = z.object({
  created_at: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  country_code: z.string().nullable(),
  mobile_without_country_code: z.string().nullable(),
  company: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  lead_owner: z.string().nullable(),
  crm_status: crmStatusEnum.nullable(),
  crm_note: z.string().nullable(),
  data_source: dataSourceEnum.nullable(),
  possession_time: z.string().nullable(),
  description: z.string().nullable(),
});

export const aiResponseSchema = z.object({
  records: z.array(
    z.object({
      data: crmLeadSchema,
      // z.record in Zod v4 requires explicit key + value types
      confidence: z.record(z.string(), confidenceEnum),
      reasoning: z.record(z.string(), z.string()),
    })
  ),
});

export type AIResponseSchema = z.infer<typeof aiResponseSchema>;