# Retry Strategy

## Overview

One thing I kept in mind while building this project is that external AI services are not always available.

Even if the application code is correct, an AI request can still fail because of:

* Network issues
* API timeout
* Rate limiting
* Temporary server errors
* Invalid AI response

Instead of treating these failures as application errors, I designed the backend to recover whenever possible.

The goal is simple:

**If one request fails, the entire import should not fail.**

---

# Why Is a Retry Strategy Important?

Imagine a user uploads a CSV containing 1,000 records.

The backend divides the data into batches.

```text
1000 Records
      │
      ▼
10 Batches
(100 Records Each)
```

Now suppose Batch 7 fails because Gemini is temporarily unavailable.

Without a retry mechanism, the whole import would stop even though the other nine batches were processed successfully.

That creates a poor user experience.

Instead, only the failed batch should be retried.

---

# Processing Flow

The retry mechanism follows this workflow.

```text
Receive Records
       │
       ▼
Create Batches
       │
       ▼
Process Batch
       │
       ▼
Success?
   │        │
 Yes       No
   │        │
   ▼        ▼
 Continue   Retry
              │
              ▼
        Retry Limit Reached?
            │          │
           No         Yes
            │          │
            ▼          ▼
        Retry Again   Mark Failed
```

This approach keeps the rest of the import running even if one batch experiences temporary problems.

---

# What Should Trigger a Retry?

Not every error should be retried.

Some errors are temporary, while others require user intervention.

## Retry

These errors are usually temporary:

* Network timeout
* AI service temporarily unavailable
* Rate limit exceeded
* Connection reset
* Temporary internal server error

These requests are good candidates for another attempt.

---

## Do Not Retry

Some errors cannot be fixed by retrying.

Examples include:

* Invalid CSV format
* Missing uploaded file
* Invalid API key
* Invalid request payload
* Unsupported file type

Retrying these requests would only waste time and API calls.

---

# Retry Limit

The backend should never retry forever.

A retry limit prevents infinite loops.

For this project, I chose a maximum of three attempts.

Example:

```text
Attempt 1

↓

Failed

↓

Attempt 2

↓

Failed

↓

Attempt 3

↓

Failed

↓

Mark Batch as Failed
```

After the third failure, the backend stops retrying and reports the failure to the frontend.

---

# Delay Between Retries

Immediately retrying a failed request is not always helpful.

Sometimes the external service simply needs a few seconds to recover.

A short delay between attempts increases the chance of success.

Example:

```text
Attempt 1

↓

Wait 2 Seconds

↓

Attempt 2

↓

Wait 4 Seconds

↓

Attempt 3
```

This technique is commonly known as **exponential backoff**.

Each retry waits slightly longer than the previous one.

This reduces unnecessary pressure on the AI service.

---

# Batch Isolation

One important design decision is that batches are independent.

Suppose we have ten batches.

```text
Batch 1 ✅

Batch 2 ✅

Batch 3 ❌

Batch 4 ✅

Batch 5 ✅

Batch 6 ✅

Batch 7 ✅

Batch 8 ✅

Batch 9 ✅

Batch 10 ✅
```

Only Batch 3 should be retried.

The remaining batches continue processing normally.

This improves both reliability and overall processing speed.

---

# Partial Success

The application should not require every batch to succeed before returning a response.

Instead, the frontend receives a summary.

Example:

```text
Imported Records

920

Skipped Records

50

Failed Records

30
```

This gives the user useful results even if one or two batches fail.

The failed records can be retried later.

---

# Logging

Every retry attempt should be logged.

Useful information includes:

* Batch number
* Retry count
* Error message
* Timestamp
* Processing time

These logs make debugging much easier if something goes wrong in production.

Example:

```text
Batch 4

Attempt 2

Reason

Rate Limit Exceeded

Time

14:32:17
```

---

# User Experience

The frontend should clearly communicate what is happening.

Instead of showing a frozen loading screen, the user should see progress.

Example:

```text
Uploading CSV...

Parsing Records...

Processing Batch 4 of 10...

Retrying Batch 4...

Processing Complete.
```

This makes long-running imports feel much more responsive.

---

# Future Improvements

If this project grows larger, the retry system could become more advanced.

Possible improvements include:

* Queue-based processing using BullMQ
* Background workers
* Automatic resume after server restart
* Dead-letter queue for permanently failed batches
* Retry configuration through environment variables
* WebSocket updates for live progress

These features would make the importer suitable for much larger datasets.

---

# Why I Chose This Approach

I wanted the retry strategy to be simple but practical.

Instead of building a complex job queue for an assignment, I focused on handling the most common failures gracefully.

The system retries only when it makes sense, limits the number of attempts, and isolates failures so they do not affect the rest of the import process.

This keeps the application reliable without adding unnecessary complexity.

---

# Final Thoughts

AI services are powerful, but they are still external systems.

Temporary failures are normal and should be expected.

A good application should recover from these situations whenever possible instead of asking the user to start over.

By processing records in batches, retrying only failed batches and limiting the number of retry attempts, the importer remains responsive, reliable and user-friendly even when external services are temporarily unavailable.
