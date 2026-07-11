# Understanding LLM Limitations

## Overview

This project uses Gemini to understand CSV data and map it into GrowEasy's CRM format.

The AI performs the most important task in the pipeline, but it is not treated as the single source of truth.

While building this project, I tried to keep one principle in mind:

**AI is very good at understanding information, but it is not perfect.**

Instead of expecting the model to always return correct answers, the application combines AI with backend validation and human review.

This document explains why that decision was made.

---

# AI Understands Meaning, Not Facts

Large Language Models are trained to recognize patterns in language.

They are excellent at understanding what a column probably represents.

For example,

```text id="o5sj9w"
Customer Name
```

and

```text id="0hnh0q"
Client Name
```

almost certainly represent the same CRM field.

The AI can recognize that relationship even if it has never seen that exact CSV before.

This is exactly where an LLM performs much better than a traditional rule-based system.

---

# AI Can Still Be Wrong

Although the model is very capable, it sometimes makes incorrect assumptions.

Consider this column.

```text id="7p9zgs"
Customer
```

The values are:

```text id="l7gh2l"
ABC Technologies Pvt Ltd
```

The AI may interpret this as a person's name.

Another model might interpret it as a company.

Both interpretations are reasonable.

This is not a bug.

It is simply an ambiguous piece of data.

Because situations like this exist, the application never assumes that every AI decision is correct.

---

# Confidence Is Not Proof

Many AI models can return confidence values.

For example:

```json id="jzq6o1"
{
  "field": "email",
  "confidence": 0.97
}
```

A number like 0.97 looks scientific.

However, it is still the model's own estimate.

It is not calculated using deterministic validation.

For this reason, I chose not to display raw confidence scores.

Instead, the application combines the AI's semantic confidence with backend validation to produce the final confidence level shown to the user.

---

# AI Should Not Invent Data

Another common limitation of LLMs is that they sometimes fill in missing information.

Imagine this record.

```text id="8j8g5x"
Name

John
```

No email exists.

No phone number exists.

A poorly designed prompt might encourage the AI to invent values.

This project explicitly instructs the model not to guess missing information.

Unknown fields remain empty.

This is much safer than creating incorrect CRM data.

---

# Backend Validation Is Still Necessary

The backend verifies everything that can be verified.

Examples include:

* Email format
* Phone number format
* Date parsing
* Allowed CRM status values
* Allowed data source values

These are objective checks.

Unlike the AI, they always produce the same result for the same input.

Combining deterministic validation with semantic understanding produces a much more reliable system.

---

# Human Review Is the Final Layer

Even after AI processing and backend validation, the user still has the final say.

Before importing records, the application displays:

* mapped fields
* confidence level
* AI reasoning

If something looks incorrect, the user can edit it before continuing.

This keeps the user in control instead of blindly trusting automation.

---

# Why Not Replace AI with Rules?

One possible solution would be writing hundreds of if-else conditions.

For example:

```text id="gls7w0"
If column is "Customer Name"

↓

name
```

```text id="fg4vyy"
If column is "Client"

↓

name
```

```text id="wgncc2"
If column is "Lead"

↓

name
```

This approach works for known formats.

However, it becomes difficult to maintain as new CSV formats appear.

The AI provides flexibility by understanding the meaning of the data instead of relying on exact column names.

---

# Why Not Trust AI Completely?

The opposite approach would be sending the CSV to the AI and importing whatever it returns.

Although this sounds simple, it introduces unnecessary risk.

The application would have no way to detect:

* invalid emails
* malformed phone numbers
* unsupported CRM status values
* unexpected output structure

That is why the backend validates every response before returning it to the frontend.

---

# The Three-Layer Approach

The final system is built around three layers.

```text id="j4g77h"
Layer 1

AI Understanding

↓

Layer 2

Backend Validation

↓

Layer 3

Human Review
```

Each layer solves a different problem.

The AI understands the meaning of the data.

The backend checks whether the data is technically valid.

The user verifies anything that remains uncertain.

Together, these layers create a much more dependable workflow.

---

# What I Learned

Working on this project changed the way I think about AI.

Initially, I viewed the LLM as the central component.

As the project evolved, I realized that the real strength comes from the system built around the model.

Prompt engineering, validation, confidence calculation and user review are just as important as the AI itself.

The language model becomes one part of a larger pipeline rather than the entire solution.

---

# Final Thoughts

Large Language Models are excellent at understanding messy, unstructured data.

That makes them a great fit for problems like CSV field mapping.

At the same time, they should not be treated as infallible.

By combining AI reasoning with deterministic backend validation and a final human review step, the application balances flexibility with reliability.

This approach allows the importer to benefit from the strengths of AI while reducing the impact of its limitations.
