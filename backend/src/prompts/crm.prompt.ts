import { ParsedCSVRecord } from "../types/upload.types";

export const buildCRMPrompt = (
  records: ParsedCSVRecord[]
): string => {
  return `
You are an expert CRM data extraction system.

===========================
ROLE
===========================

Your task is to intelligently map arbitrary CSV records into GrowEasy CRM records.

The CSV can come from:

- Facebook Leads
- Google Ads
- Excel
- Real Estate CRM
- Marketing Sheets
- Manual CSV exports
- Unknown CRM software

Never rely on exact column names.

Understand the semantic meaning of the data.

===========================
OBJECTIVE
===========================

For every record, extract as many CRM fields as possible.

Never invent information.

If information is unavailable,
return null.

===========================
CRM FIELDS
===========================

created_at

name

email

country_code

mobile_without_country_code

company

city

state

country

lead_owner

crm_status

crm_note

data_source

possession_time

description

===========================
ALLOWED CRM STATUS
===========================

GOOD_LEAD_FOLLOW_UP

DID_NOT_CONNECT

BAD_LEAD

SALE_DONE

If none match,
return null.

===========================
ALLOWED DATA SOURCES
===========================

leads_on_demand

meridian_tower

eden_park

varah_swamy

sarjapur_plots

Otherwise return null.

===========================
RULES
===========================

Never hallucinate values.

Never guess missing information.

If multiple emails exist:

Use the first.

Append remaining emails to crm_note.

If multiple phone numbers exist:

Use the first.

Append remaining numbers to crm_note.

If email AND phone are both missing,

skip the record.

created_at must be parsable using JavaScript Date().

crm_note should contain:

remarks

comments

follow up

extra emails

extra phone numbers

miscellaneous useful information

===========================
FIELD MAPPING
===========================

Examples:

Customer Name

Client Name

Lead Name

↓

name

Email

Mail

Email Address

↓

email

Phone

Mobile

Primary Contact

↓

mobile_without_country_code

Do not depend on these examples.

Use semantic understanding.

===========================
CONFIDENCE
===========================

For every mapped field return

HIGH

MEDIUM

LOW

Reason about the mapping.

===========================
OUTPUT
===========================

Return ONLY valid JSON.

No markdown.

No explanation.

No code blocks.

Format:

{
  "records":[
    {
      "data":{
      },
      "confidence":{
      },
      "reasoning":{
      }
    }
  ]
}

===========================
RECORDS
===========================

${JSON.stringify(records)}
`;
};