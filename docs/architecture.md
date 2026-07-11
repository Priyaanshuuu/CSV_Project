# System Architecture

## AI Powered CSV Importer for GrowEasy

## Overview

The main goal of this project is to solve one problem:

**Users should be able to upload any valid CSV file, and the system should automatically convert it into GrowEasy CRM records without asking the user to manually map columns.**

The difficult part is not reading a CSV file. Libraries can already do that.

The real challenge is understanding different column names used in different CSV files.

For example, all of these columns may represent the same thing:

* Name
* Customer Name
* Client
* Prospect
* Full Name
* Contact Person

Instead of writing hundreds of if-else conditions for every possible column name, this project uses an LLM (Gemini) to understand the meaning of each column and map it to the correct CRM field.

---

# High Level Architecture

```
                User
                  │
                  ▼
        Next.js Frontend
                  │
          Upload CSV File
                  │
                  ▼
         Express Backend
                  │
          Parse CSV Records
                  │
                  ▼
          Split into Batches
                  │
                  ▼
              Gemini AI
                  │
      Semantic Field Mapping
                  │
                  ▼
     Backend Validation Layer
                  │
                  ▼
      Confidence Calculation
                  │
                  ▼
       Review Before Import
                  │
                  ▼
        Final CRM Records
```

The frontend is only responsible for user interaction.

The backend is responsible for parsing, AI processing, validation and preparing the final response.

---

# Frontend Architecture

The frontend is built using Next.js.

Its responsibility is to provide a clean and simple user experience.

The frontend does not contain business logic.

Its responsibilities are:

* Upload CSV files
* Show CSV preview
* Call backend APIs
* Display AI processed records
* Show confidence levels
* Allow user to review mappings
* Display import statistics

Keeping the frontend simple makes it easier to maintain and easier to test.

---

# Backend Architecture

The backend is built using Express.

Instead of putting everything inside one file, every responsibility is separated.

```
Routes
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Gemini API
```

Each layer has only one responsibility.

### Routes

Routes receive incoming requests and forward them to the correct controller.

They do not contain business logic.

---

### Controllers

Controllers coordinate the request.

A controller may:

* receive uploaded file
* call CSV parser
* call AI service
* return response

Controllers do not contain parsing logic or AI logic.

---

### Services

Services contain the actual business logic.

Examples include:

* CSV Parsing
* Batch Processing
* AI Communication
* Confidence Calculation
* Record Validation

This keeps controllers small and easy to read.

---

### Prompt Builder

Instead of writing a large AI prompt directly inside the AI service, prompts are stored separately.

```
prompts/
    crmPrompt.ts
```

This makes prompt updates easier without changing application logic.

---

### Validators

Every request is validated before processing.

Examples:

* Is the uploaded file present?
* Is it a CSV?
* Is the batch empty?
* Is the response valid?

Validation prevents unnecessary AI requests and improves reliability.

---

### Utilities

Utility functions contain reusable helper logic.

Examples:

* Phone normalization
* Country code extraction
* Date formatting
* Batch creation

This avoids duplicated code.

---

# Why Batch Processing?

Sending thousands of records to an LLM in one request is not practical.

Large requests:

* increase cost
* increase response time
* may exceed token limits
* are harder to retry if something fails

Instead, records are divided into smaller batches.

Example:

```
1000 Records

↓

100 Records

↓

100 Records

↓

100 Records
```

Each batch is processed independently.

If one batch fails, only that batch needs to be retried.

This makes the system much more reliable.

---

# AI Processing

The AI is responsible for semantic understanding.

It does not simply compare column names.

Instead, it understands what each column represents.

Example:

```
Customer Name

↓

name
```

```
Mail ID

↓

email
```

```
Comments

↓

crm_note
```

This allows the importer to work with CSV files coming from many different platforms without requiring manual mapping.

---

# Hybrid Confidence System

One important design decision in this project is that confidence is not based only on AI.

Instead, confidence comes from two sources.

### Step 1

Gemini decides how confident it is about the semantic meaning of a field.

Example:

```
Customer Name

↓

name

Confidence

HIGH
```

### Step 2

The backend validates the extracted value.

Examples include:

* email format
* phone number format
* valid dates
* allowed CRM status
* allowed data source

Finally, both results are combined into a single confidence level.

This makes confidence much more trustworthy than relying only on the LLM.

---

# Human Review

Even good AI models can make mistakes.

Instead of importing records immediately, users get a chance to review the AI suggestions.

For every mapped field, users can see:

* mapped CRM field
* confidence level
* reason for mapping

If something looks incorrect, users can edit it before importing.

This keeps the user in control.

---

# Retry Strategy

Network failures and AI timeouts are always possible.

Instead of failing the entire import, only the failed batch is retried.

If retries are exhausted, the remaining batches continue processing.

This improves reliability while avoiding unnecessary repeated work.

---

# Why No Database?

The assignment does not require storing data permanently.

Every request is independent.

The backend receives a CSV, processes it and returns structured CRM records.

Keeping the backend stateless makes deployment simpler and reduces unnecessary complexity.

---

# Error Handling

The application handles errors at multiple levels.

Examples include:

* Invalid file type
* Empty CSV
* Invalid AI response
* Failed AI request
* Network timeout
* Parsing errors

Every error returns a clear message so users know what went wrong.

---

# Project Flow

The complete workflow looks like this:

```
User uploads CSV
        │
        ▼
Frontend previews CSV
        │
        ▼
User confirms import
        │
        ▼
Backend parses CSV
        │
        ▼
Records are split into batches
        │
        ▼
Gemini maps CRM fields
        │
        ▼
Backend validates records
        │
        ▼
Confidence is calculated
        │
        ▼
User reviews mappings
        │
        ▼
Final records are displayed
```

---

# Design Goals

While building this project, I focused on a few simple goals:

* Keep the frontend clean and responsive.
* Keep business logic inside the backend.
* Make AI decisions explainable instead of acting like a black box.
* Allow users to review AI suggestions before final import.
* Make the system reliable using validation and retry mechanisms.
* Write code that is easy to understand, test and extend.

The final result is not just a CSV importer.

It is an explainable AI-assisted CRM import pipeline that combines semantic understanding from an LLM with deterministic backend validation to produce reliable CRM records.
