# Test Data

Sample CSV files to test the CRM import pipeline. Each file simulates a different real-world source format.

| File | Rows | What it tests |
|---|---|---|
| `leads_test.csv` | 10 | Standard mixed format — names, emails, phones, all 5 data sources, all 4 CRM statuses |
| `facebook_leads.csv` | 8 | Facebook Lead Ads export format — `full_name`, `campaign_name` columns, one missing phone |
| `google_ads_leads.csv` | 7 | Google Ads lead form export — split first/last name, `Ad Group` as source hint, one missing email |
| `realestate_crm_export.csv` | 7 | Another CRM's export — secondary email/phone columns, verbose status labels, follow-up dates |
| `edge_cases.csv` | 7 | Tricky inputs — quoted commas in names, dual emails, international dialing codes, no-contact record (should be skipped), duplicate entry |

## How to use

1. Start the backend: `npm run dev` (inside `backend/`)
2. Start the frontend: `npm run dev` (inside `frontend/`)
3. Upload any of the files above via the UI
4. The AI will map each row to the GrowEasy CRM schema

## What to verify

- **`leads_test.csv`** — All 10 records should import. CRM status and data source should map exactly as in the file.
- **`facebook_leads.csv`** — `campaign_name` should map to `data_source`. Record 6 (missing phone) should still import via email.
- **`google_ads_leads.csv`** — First + Last name should be combined into `name`. Record 7 (missing email) should still import via phone.
- **`realestate_crm_export.csv`** — `Closed Won` → `SALE_DONE`, `Not Interested` → `BAD_LEAD`, `Hot Lead`/`Warm Lead` → `GOOD_LEAD_FOLLOW_UP`, `Cold Lead` → `DID_NOT_CONNECT`. Secondary email should go into `crm_note`.
- **`edge_cases.csv`** — Record with no email AND no phone (`No Contact At All`) should be skipped. Dual emails: second email goes into `crm_note`. International phone codes should be split into `country_code` + `mobile_without_country_code`.
