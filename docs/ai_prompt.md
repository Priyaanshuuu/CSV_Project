# AI Prompt Design

## Overview

The AI model is the heart of this project.

Its job is not to answer questions like a chatbot.

Its only responsibility is to understand different CSV formats and convert them into GrowEasy's CRM format.

This means the quality of the final output depends heavily on the quality of the prompt.

A vague prompt produces inconsistent results.

A detailed prompt produces predictable and structured output.

For this reason, I spent time designing the prompt before writing the application logic.

---

# What Problem Is the Prompt Solving?

Imagine these four CSV files.

CSV 1

```csv id="j4p8d1"
Name
Email
Phone
```

CSV 2

```csv id="bn2e6h"
Customer Name
Mail ID
Mobile Number
```

CSV 3

```csv id="5v7c0x"
Client
Primary Contact
Remarks
```

CSV 4

```csv id="8s1mzk"
Prospect
Whatsapp
Comments
```

Although the column names are different, they all contain almost the same information.

Instead of writing hundreds of conditions in code, I wanted the AI to understand the meaning behind each column.

That is the primary purpose of the prompt.

---

# Role of the AI

The prompt clearly tells Gemini what its job is.

It is not a chatbot.

It is not a data analyst.

It is not supposed to generate creative responses.

Instead, it behaves like a data extraction engine.

Its only goal is to convert unknown CSV formats into the predefined CRM schema.

Giving the model a clear role reduces unnecessary responses and improves consistency.

---

# Defining the Target Schema

One important part of the prompt is defining the expected output.

Instead of asking the AI to "extract useful fields", the prompt explicitly lists every CRM field.

Example:

```id="n8g2yq"
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
```

This removes ambiguity.

The model always knows the exact structure it must return.

---

# Semantic Mapping Instead of Exact Matching

The prompt never tells the AI to compare column names literally.

Instead, it tells the model to understand what each column represents.

For example,

```id="q1m4rz"
Customer Name

↓

name
```

```id="h5d9sw"
Mail ID

↓

email
```

```id="u3b6xp"
Remarks

↓

crm_note
```

This allows the importer to support many different CSV formats without changing application code.

---

# Restricting Allowed Values

Some CRM fields only allow specific values.

For example,

CRM Status can only be one of:

```id="k6r2fd"
GOOD_LEAD_FOLLOW_UP

DID_NOT_CONNECT

BAD_LEAD

SALE_DONE
```

Similarly,

Data Source is restricted to a fixed list.

By explicitly defining allowed values inside the prompt, the model is much less likely to invent new categories.

---

# Handling Missing Information

Real-world CSV files are often incomplete.

Some records may not contain every field.

Instead of asking the AI to guess missing values, the prompt instructs it to leave unknown fields empty.

This prevents incorrect information from being generated.

---

# Skipping Invalid Records

The assignment clearly states that a record should be skipped if it contains neither:

* email
* nor mobile number

This rule is included directly in the prompt.

That way, the model filters invalid records before returning the final response.

---

# Handling Multiple Emails and Phone Numbers

Some CSV files contain multiple contact details in a single field.

Instead of losing information, the prompt follows a simple rule.

For emails:

* Use the first email as the primary email.
* Store remaining emails inside crm_note.

For mobile numbers:

* Use the first mobile number.
* Store remaining numbers inside crm_note.

This keeps the output compatible with the CRM while preserving useful information.

---

# Returning Structured JSON

One important instruction is that the AI must always return JSON.

Natural language explanations are not useful for an API.

The backend expects structured data that can be processed automatically.

A predictable JSON response also makes validation much easier.

---

# Asking the AI to Explain Its Decisions

One addition I made beyond the assignment is asking the AI to explain why each field was mapped.

Example:

```json id="v0p9ek"
{
  "field": "name",
  "reason": "The values appear to contain personal names."
}
```

This explanation is shown to the user during the review step.

It makes the system more transparent and easier to trust.

---

# Asking for Confidence

Instead of requesting a numeric confidence score, the prompt asks the model to classify its confidence as:

* HIGH
* MEDIUM
* LOW

I chose this approach because large language models are generally better at qualitative confidence than arbitrary percentages.

The backend later combines this with its own validation checks to produce the final confidence level shown to the user.

---

# Preventing Hallucinations

One risk when working with LLMs is hallucination.

To reduce this risk, the prompt includes several clear instructions.

Examples:

* Do not invent values.
* Do not guess missing information.
* Leave unknown fields empty.
* Only use allowed CRM status values.
* Only use allowed data source values.
* Return JSON only.

These rules encourage the model to stay close to the actual data.

---

# Keeping the Prompt Separate

The prompt is stored in its own file instead of being written directly inside the AI service.

This has several advantages.

* Easier to maintain.
* Easier to improve over time.
* Cleaner service layer.
* Better version control.
* Simpler experimentation.

Prompt engineering becomes an independent part of the project instead of being mixed with application logic.

---

# Example Workflow

The overall AI workflow is simple.

```id="l7q2mx"
CSV Records

↓

Prompt Builder

↓

Gemini

↓

Structured JSON

↓

Backend Validation

↓

Final Response
```

The AI focuses on understanding the data.

The backend focuses on validating the data.

Each layer has a clear responsibility.

---

# Design Philosophy

While designing the prompt, I followed a few simple principles.

* Give the AI a very specific role.
* Clearly define the expected output.
* Avoid asking open-ended questions.
* Reduce opportunities for hallucination.
* Keep responses structured.
* Prefer deterministic rules whenever possible.
* Let the backend handle validation instead of expecting the AI to be perfect.

---

# Final Thoughts

The prompt is one of the most important parts of this project.

Instead of relying on the model's default behavior, I tried to guide it with clear instructions, a fixed output schema and well-defined rules.

The goal was not just to get correct results once, but to make the output as consistent and predictable as possible across different CSV formats.

Even with a well-designed prompt, I do not assume the AI is always correct.

That is why the project combines prompt engineering with backend validation and a human review step before the final import.

Together, these layers make the system much more reliable than relying on the LLM alone.
