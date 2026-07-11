# Future Improvements

## Overview

The goal of this assignment was to build an AI-powered CSV importer.

The current implementation completes that goal and includes a few additional features such as hybrid confidence, explainable AI and retry handling.

However, while building the project, I noted several ideas that could make this a much stronger product if it were developed further.

This document describes those ideas.

Some of them improve the user experience, while others improve reliability, scalability or AI accuracy.

---

# 1. Learn From User Corrections

One feature I would love to build is allowing the importer to learn from user feedback.

Imagine this situation.

The AI maps:

```text
Customer

↓

company
```

The user changes it to:

```text
Customer

↓

name
```

Instead of forgetting this correction, the application could store it.

The next time a similar CSV is uploaded, the importer can use that previous correction to improve future mappings.

Over time, the importer becomes smarter for that organization.

---

# 2. Saved Mapping Templates

Many companies import CSV files from the same platform every day.

For example,

Facebook Leads

Google Ads

HubSpot

Zoho CRM

Real Estate Portals

Instead of asking the AI to map everything every time, users could save a mapping template.

Next time the same format is uploaded, the template can be applied automatically.

This would make imports almost instant.

---

# 3. Duplicate Lead Detection

Currently, every valid record is processed independently.

A future version could detect duplicate leads before import.

Possible checks include:

* Same email
* Same mobile number
* Same email and company
* Similar name with identical phone number

Instead of importing duplicates, the user could choose whether to merge, skip or update the existing lead.

---

# 4. Support Excel Files

Right now the importer accepts only CSV files because that is what the assignment requires.

A production version should also support:

* .xlsx
* .xls

Many business users work directly with Excel rather than exporting CSV files first.

---

# 5. Background Processing

Very large imports should not keep the user waiting on a single request.

Instead, the backend could process files in the background.

The workflow would become:

```text
Upload File

↓

Create Job

↓

Background Worker

↓

AI Processing

↓

User Gets Notification
```

This would allow the application to process very large datasets more efficiently.

---

# 6. Real-Time Progress

Currently, the frontend waits for the backend response.

A future version could use WebSockets or Server-Sent Events to provide live updates.

Example:

```text
Uploading...

Reading CSV...

Processing Batch 2 of 10...

Retrying Batch 5...

Import Complete.
```

This gives users much better feedback during long-running imports.

---

# 7. Import History

Every completed import could be saved.

Users could later view:

* Import date
* File name
* Number of records
* Imported records
* Skipped records
* Failed records

This makes troubleshooting much easier.

---

# 8. Download Processed CSV

After AI processing is complete, users may want to download the cleaned dataset.

Possible formats:

* CSV
* Excel
* JSON

This allows the processed data to be reused in other systems.

---

# 9. AI Model Selection

Different AI models have different strengths.

Instead of using only one provider, users could choose between:

* Gemini
* OpenAI
* Claude

This also provides a fallback if one service becomes temporarily unavailable.

---

# 10. Automatic Model Fallback

If the primary AI provider fails,

the backend could automatically switch to another provider.

Example:

```text
Gemini

↓

Unavailable

↓

Claude

↓

Continue Processing
```

This increases system reliability without requiring user intervention.

---

# 11. Better Confidence Calculation

The current confidence system combines:

* AI semantic confidence
* Backend validation

In the future, additional signals could be included.

Examples:

* Historical user corrections
* Duplicate detection
* Previous successful imports
* Confidence calibration using evaluation datasets

This would make confidence estimation even more reliable.

---

# 12. Import Analytics Dashboard

Organizations often want to understand the quality of their imported data.

A dashboard could display:

* Total imports
* Average confidence
* Most common skipped reason
* Duplicate rate
* Mapping accuracy
* AI processing time

This information can help teams improve the quality of their data over time.

---

# 13. Team Workspaces

If multiple people use the importer, the application could support workspaces.

Each team would have:

* Shared import history
* Saved templates
* Team members
* Activity logs

This would make the application more suitable for larger organizations.

---

# 14. Better Security

For a production system, I would also strengthen security.

Examples include:

* User authentication
* Role-based permissions
* API rate limiting
* Secure file storage
* Virus scanning for uploaded files
* Request logging
* Audit history

These features are not necessary for the assignment but would be important in a real SaaS application.

---

# 15. Performance Improvements

As usage grows, performance becomes increasingly important.

Possible optimizations include:

* Worker queues
* Parallel batch processing
* Response caching
* Streaming CSV parsing
* Database indexing
* Horizontal backend scaling

These improvements would allow the importer to handle much larger workloads.

---

# 16. AI Evaluation Dashboard

One idea I found particularly interesting is tracking AI performance over time.

For example,

after every import the application could measure:

* Correct mappings
* Incorrect mappings
* User edits
* Confidence distribution

This information would help improve prompt engineering and identify where the AI struggles.

---

# 17. Prompt Versioning

Prompt engineering is an important part of this project.

Instead of keeping only one prompt, future versions could support:

Version 1

↓

Version 2

↓

Version 3

Each import could record which prompt version was used.

This would make it easier to compare improvements over time.

---

# 18. OCR Support

Some organizations receive scanned documents instead of spreadsheets.

A future version could extract tabular data from:

* PDFs
* Images
* Scanned documents

The extracted data could then be passed through the same AI pipeline.

---

# What I Would Build First

If I had more time, these would be my highest priorities.

1. Saved mapping templates
2. Learning from user corrections
3. Duplicate detection
4. Real-time progress updates
5. Background processing

I believe these features would provide the biggest improvement to the overall user experience.

---

# Final Thoughts

Building this project made me realize that the AI model is only one part of the overall solution.

The surrounding engineering—validation, retries, user review, performance and usability—is equally important.

Although the current implementation is designed specifically for the assignment, I believe it also provides a strong foundation for a real-world product.

With additional features such as learning from user corrections, saved templates and background processing, this importer could grow into a practical tool that organizations use every day.
