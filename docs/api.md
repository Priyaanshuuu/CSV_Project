# API Documentation

## Overview

The backend exposes a small set of APIs that are responsible for handling the complete CSV import workflow.

Instead of creating many endpoints, I wanted to keep the API simple and focused.

The complete flow looks like this:

```text
Upload CSV
      │
      ▼
Parse CSV
      │
      ▼
Preview Records
      │
      ▼
User Confirms Import
      │
      ▼
AI Processing
      │
      ▼
Validation
      │
      ▼
Return CRM Records
```

Every endpoint has a single responsibility.

---

# Base URL

During development

```text
http://localhost:5000/api
```

In production, this URL depends on where the backend is deployed.

---

# API List

| Method | Endpoint | Purpose                  |
| ------ | -------- | ------------------------ |
| POST   | /upload  | Upload and parse CSV     |
| POST   | /process | Process records using AI |
| GET    | /health  | Health check             |

---

# 1. Upload CSV

## Endpoint

```http
POST /upload
```

## Purpose

Uploads the CSV file and parses it.

No AI processing happens here.

The goal of this endpoint is simply to:

* validate the uploaded file
* read the CSV
* convert rows into JSON
* return a preview

This allows the user to verify the uploaded data before sending it to the AI.

---

## Request

Content-Type

```text
multipart/form-data
```

Body

```text
file: customers.csv
```

---

## Success Response

```json
{
  "success": true,
  "totalRows": 245,
  "columns": [
    "Customer Name",
    "Email",
    "Phone"
  ],
  "preview": [
    {
      "Customer Name": "John Doe",
      "Email": "john@example.com",
      "Phone": "+91 9876543210"
    }
  ]
}
```

---

## Possible Errors

### No File Uploaded

```json
{
  "success": false,
  "message": "CSV file is required."
}
```

---

### Invalid File Type

```json
{
  "success": false,
  "message": "Only CSV files are supported."
}
```

---

### Empty CSV

```json
{
  "success": false,
  "message": "The uploaded CSV contains no records."
}
```

---

# 2. Process CSV

## Endpoint

```http
POST /process
```

## Purpose

This endpoint starts the AI processing.

It receives the parsed records from the frontend.

The backend then:

* creates batches
* builds the AI prompt
* calls Gemini
* validates the response
* calculates confidence
* returns CRM records

---

## Request

```json
{
  "records": [
    {
      "Customer Name": "John Doe",
      "Email": "john@example.com"
    }
  ]
}
```

---

## Success Response

```json
{
  "success": true,
  "totalImported": 230,
  "totalSkipped": 15,
  "records": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "company": "GrowEasy",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "confidence": "HIGH",
      "reason": "Customer Name contains personal names."
    }
  ]
}
```

---

# Processing Steps

When this endpoint is called, the backend performs the following steps.

```text
Receive Records

↓

Split into Batches

↓

Generate Prompt

↓

Call Gemini

↓

Validate Response

↓

Calculate Confidence

↓

Merge Results

↓

Return Final JSON
```

---

# Possible Errors

## AI Timeout

```json
{
  "success": false,
  "message": "AI request timed out."
}
```

---

## Invalid AI Response

```json
{
  "success": false,
  "message": "Received invalid response from AI."
}
```

---

## Validation Failed

```json
{
  "success": false,
  "message": "Some records could not be validated."
}
```

---

# 3. Health Check

## Endpoint

```http
GET /health
```

## Purpose

This endpoint is mainly used for deployment.

It quickly confirms that the backend server is running.

---

## Response

```json
{
  "status": "OK"
}
```

---

# Status Codes

| Code | Meaning                |
| ---- | ---------------------- |
| 200  | Success                |
| 201  | Resource Created       |
| 400  | Invalid Request        |
| 401  | Unauthorized           |
| 404  | Route Not Found        |
| 413  | File Too Large         |
| 429  | Too Many Requests      |
| 500  | Internal Server Error  |
| 503  | AI Service Unavailable |

---

# Validation

Every request is validated before any business logic runs.

Examples include:

* CSV file exists
* File extension is valid
* Records array is not empty
* AI response matches the expected schema

Rejecting invalid requests early keeps the backend simpler and avoids unnecessary AI calls.

---

# Response Format

Every endpoint follows the same response structure.

Success

```json
{
  "success": true,
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

Using a consistent response format makes frontend development easier because every request is handled in the same way.

---

# Security Considerations

Although this is an assignment, I still wanted to follow some production practices.

Examples include:

* Validate uploaded file type.
* Limit maximum file size.
* Never trust client input.
* Validate AI responses before returning them.
* Keep API keys on the backend only.
* Return meaningful error messages without exposing internal implementation details.

---

# Future APIs

If this project grows further, I would consider adding a few more endpoints.

Examples:

* Import history
* Download processed CSV
* Retry failed batches
* Save mapping templates
* User authentication
* WebSocket endpoint for live processing progress

These are not required for the assignment but would be useful in a larger production system.

---

# Final Thoughts

The backend API is intentionally small.

Instead of exposing many endpoints, each API has one clear responsibility.

This keeps the workflow simple, makes the frontend easier to build, and allows the backend to remain focused on parsing, AI processing and validation.
