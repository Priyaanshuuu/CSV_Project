"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const CRM_STATUSES = new Set([
    "GOOD_LEAD_FOLLOW_UP",
    "DID_NOT_CONNECT",
    "BAD_LEAD",
    "SALE_DONE",
]);
const DATA_SOURCES = new Set([
    "leads_on_demand",
    "meridian_tower",
    "eden_park",
    "varah_swamy",
    "sarjapur_plots",
]);
// RFC 5322 simplified — good enough for CRM data without false negatives
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Optional leading +, 1–4 digits (e.g. "+91", "1", "44")
const COUNTRY_CODE_REGEX = /^\+?\d{1,4}$/;
class ValidationService {
    static validateEmail(value) {
        if (!value)
            return true; // null/empty = optional, not invalid
        return EMAIL_REGEX.test(value.trim());
    }
    static validatePhone(value) {
        if (!value)
            return true;
        // Strip common separators before checking digit count
        const digits = value.replace(/[\s\-().+]/g, "");
        return /^\d{7,15}$/.test(digits);
    }
    static validateCountryCode(value) {
        if (!value)
            return true;
        return COUNTRY_CODE_REGEX.test(value.trim());
    }
    static validateDate(value) {
        if (!value)
            return true;
        const timestamp = Date.parse(value);
        return !isNaN(timestamp);
    }
    static validateCRMStatus(value) {
        if (!value)
            return true;
        return CRM_STATUSES.has(value);
    }
    static validateDataSource(value) {
        if (!value)
            return true;
        return DATA_SOURCES.has(value);
    }
    /**
     * Runs deterministic validation on every field of a CRM lead.
     * Returns a per-field boolean map — true = valid, false = invalid.
     * Fields with no deterministic rule always return true (they can only
     * be judged semantically, which is the AI's job).
     */
    static validateRecord(record) {
        return {
            created_at: this.validateDate(record.created_at),
            name: record.name !== null ? record.name.trim().length > 0 : true,
            email: this.validateEmail(record.email),
            country_code: this.validateCountryCode(record.country_code),
            mobile_without_country_code: this.validatePhone(record.mobile_without_country_code),
            company: true,
            city: true,
            state: true,
            country: true,
            lead_owner: true,
            crm_status: this.validateCRMStatus(record.crm_status),
            crm_note: true,
            data_source: this.validateDataSource(record.data_source),
            possession_time: true,
            description: true,
        };
    }
}
exports.ValidationService = ValidationService;
