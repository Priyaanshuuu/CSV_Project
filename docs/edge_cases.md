# Edge Cases

## Overview

Working with CSV files sounds simple until you start looking at real data.

Every company exports data differently.

Some files have clean column names.

Some files have missing values.

Some files contain duplicate information.

Some are manually edited in Excel.

Instead of assuming every CSV follows the same format, I designed the importer to handle as many real-world situations as possible.

This document lists the important edge cases I considered while building the project.

---

# 1. Different Column Names

This is the main problem the project solves.

Example:

CSV A

```text
Name
```

CSV B

```text
Customer Name
```

CSV C

```text
Lead
```

CSV D

```text
Prospect
```

Although the names are different, they all may represent the same CRM field.

The AI understands the meaning of the column instead of matching exact names.

---

# 2. Different Column Order

Some CSV files start with Email.

Others start with Phone.

Some place Name at the end.

The importer never depends on column position.

It only looks at the column meaning.

---

# 3. Extra Columns

Many CSV files contain columns that are not useful for the CRM.

Example:

```text
Age
Gender
Facebook Campaign
Internal ID
Latitude
Longitude
```

These columns are simply ignored unless they contain information useful for one of the CRM fields.

---

# 4. Missing Optional Fields

Some records only contain:

* Name
* Email

Others may only contain:

* Phone
* City

Missing optional fields are returned as empty values instead of causing an error.

---

# 5. Missing Required Contact Information

The assignment clearly states that records without both:

* email
* mobile

should not be imported.

These records are skipped.

The skipped count is shown in the final summary.

---

# 6. Multiple Email Addresses

Sometimes one field contains:

```text
john@gmail.com, john.work@gmail.com
```

The importer follows a simple rule.

The first email becomes the primary email.

The remaining email addresses are added to crm_note.

This prevents information from being lost.

---

# 7. Multiple Phone Numbers

Example:

```text
+91 9876543210 / +91 9988776655
```

The first number becomes the primary mobile number.

The remaining numbers are stored inside crm_note.

---

# 8. Invalid Email Format

Example:

```text
john@@gmail
```

The backend detects that the value is not a valid email.

The confidence level is reduced.

If no valid email or phone exists, the record is skipped.

---

# 9. Invalid Phone Numbers

Example:

```text
12345
```

The backend validates the number.

If it does not match the expected format, confidence is reduced.

---

# 10. Different Date Formats

Different systems export dates differently.

Examples:

```text
2026-07-12
```

```text
12/07/2026
```

```text
July 12, 2026
```

The backend attempts to convert the value into a format that JavaScript can parse.

If parsing fails, the field is left empty.

---

# 11. Empty Rows

Many CSV files contain blank rows at the end.

These rows are ignored during parsing.

---

# 12. Duplicate Records

Sometimes the same lead appears multiple times.

The current version imports every valid record.

In the future, duplicate detection could be added using email and phone number.

---

# 13. Company Instead of Person Name

Example:

```text
ABC Technologies Pvt Ltd
```

The AI may initially map this as a person.

The backend notices common company keywords like:

* Pvt Ltd
* LLP
* Inc
* Solutions
* Technologies

The confidence is reduced because the value may actually belong to the company field.

---

# 14. Unknown CRM Status

Example:

```text
Interested
```

The assignment only allows four CRM status values.

If the value cannot be mapped confidently, the field is left empty instead of inventing a new status.

---

# 15. Unknown Data Source

If the AI cannot confidently match the source to one of the allowed values, the field remains empty.

This follows the assignment requirements.

---

# 16. Large CSV Files

Large CSV files should not be sent to the AI in one request.

The backend automatically splits records into batches.

This avoids token limit issues and improves reliability.

---

# 17. AI Timeout

Sometimes an AI request may fail because of:

* timeout
* temporary service issue
* network problem

Only the failed batch is retried.

The remaining batches continue processing.

---

# 18. Invalid AI Response

Although uncommon, the AI may occasionally return unexpected output.

The backend validates every response before using it.

Invalid responses are rejected instead of being passed directly to the frontend.

---

# 19. CSV With Only Headers

Example:

```text
Name,Email,Phone
```

No data rows.

The importer returns an appropriate error message instead of processing an empty file.

---

# 20. Wrong File Type

If a user uploads:

* PDF
* Excel Workbook
* Image
* ZIP

the upload is rejected before parsing begins.

Only CSV files are accepted.

---

# 21. Very Long Notes

Some CRM notes may contain large paragraphs.

Instead of removing them, the importer keeps the content while ensuring the JSON remains valid.

---

# 22. Line Breaks Inside Cells

Some CSV files contain comments like:

```text
Customer requested
a callback tomorrow.
```

The parser preserves these values correctly so that records are not broken into multiple rows.

---

# 23. Mixed Languages

Some datasets may contain names or notes written in different languages.

The importer treats these values as normal text and forwards them to the AI without modification.

---

# 24. Inconsistent Formatting

Examples:

```text
John Doe
```

```text
 john doe
```

```text
JOHN DOE
```

The backend trims unnecessary spaces before validation.

Future versions may also normalize capitalization.

---

# 25. Unexpected Columns

Sometimes CSV exports contain dozens of unrelated columns.

Instead of failing, the importer simply ignores fields that cannot be mapped to the CRM schema.

This makes the application more flexible.

---

# Design Philosophy

While working on this project, I tried to avoid making assumptions about the input.

Instead of expecting every CSV file to be clean, I assumed the opposite.

Real-world data is usually messy.

The importer should therefore be flexible enough to handle different formats while remaining strict about the final CRM schema.

---

# Future Improvements

Some edge cases are intentionally left for future versions.

Examples include:

* Automatic duplicate detection.
* User-defined mapping templates.
* Learning from previous user corrections.
* OCR support for scanned tables.
* Excel (.xlsx) support.
* Import history.
* Batch resume after server restart.

These features are outside the scope of the assignment but would make the importer even more useful in production.

---

# Final Thoughts

The success of an importer is not measured by how well it handles perfect CSV files.

It is measured by how gracefully it handles imperfect ones.

While building this project, I focused on making the system reliable even when the input data is inconsistent, incomplete or poorly formatted.

The combination of AI, backend validation and human review helps ensure that users can confidently import data from many different sources without manually cleaning every CSV beforehand.
