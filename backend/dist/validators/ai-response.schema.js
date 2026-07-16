"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiResponseSchema = exports.confidenceEnum = void 0;
const zod_1 = require("zod");
exports.confidenceEnum = zod_1.z.enum(["HIGH", "MEDIUM", "LOW"]);
const crmStatusEnum = zod_1.z.enum([
    "GOOD_LEAD_FOLLOW_UP",
    "DID_NOT_CONNECT",
    "BAD_LEAD",
    "SALE_DONE",
]);
const dataSourceEnum = zod_1.z.enum([
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
const crmLeadSchema = zod_1.z.object({
    created_at: zod_1.z.string().nullable(),
    name: zod_1.z.string().nullable(),
    email: zod_1.z.string().nullable(),
    country_code: zod_1.z.string().nullable(),
    mobile_without_country_code: zod_1.z.string().nullable(),
    company: zod_1.z.string().nullable(),
    city: zod_1.z.string().nullable(),
    state: zod_1.z.string().nullable(),
    country: zod_1.z.string().nullable(),
    lead_owner: zod_1.z.string().nullable(),
    crm_status: crmStatusEnum.nullable(),
    crm_note: zod_1.z.string().nullable(),
    data_source: dataSourceEnum.nullable(),
    possession_time: zod_1.z.string().nullable(),
    description: zod_1.z.string().nullable(),
});
exports.aiResponseSchema = zod_1.z.object({
    records: zod_1.z.array(zod_1.z.object({
        data: crmLeadSchema,
        // z.record in Zod v4 requires explicit key + value types
        confidence: zod_1.z.record(zod_1.z.string(), exports.confidenceEnum),
        reasoning: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
    })),
});
