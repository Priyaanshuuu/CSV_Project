# Prompt History

## Overview

The prompt used in this project was not written perfectly on the first attempt.

Like any other part of software engineering, prompt engineering is an iterative process.

After every version, I looked at the quality of the AI responses and tried to improve the instructions to make the output more accurate and more consistent.

This document explains how the prompt evolved and why each version was better than the previous one.

---

# Version 1 – Basic Mapping

The first version of the prompt was very simple.

It only asked the AI to read the CSV records and map them to the CRM fields.

The instructions looked something like this:

* Read the CSV data.
* Identify the fields.
* Return CRM records.

Although this worked for very simple CSV files, it had several problems.

### Problems

* Different responses for the same input.
* Sometimes returned unnecessary explanations.
* Sometimes guessed missing values.
* Column mapping was inconsistent.

This version was good enough for testing, but not reliable enough for production.

---

# Version 2 – Fixed CRM Schema

The second improvement was to define the expected CRM schema explicitly.

Instead of asking the AI to return "structured data", I listed every field that should exist in the response.

Example:

* created_at
* name
* email
* company
* city
* state
* country
* crm_status
* crm_note

This immediately made the responses much more consistent.

### Improvement

The AI stopped creating random field names because it already knew the expected output structure.

---

# Version 3 – Business Rules

At this point, I realized that the assignment also had several business rules.

For example:

* Only four CRM status values are allowed.
* Data source must belong to a predefined list.
* Skip records without email or mobile.
* Store extra phone numbers inside crm_note.

Instead of implementing these rules only in code, I also included them inside the prompt.

### Improvement

The AI started producing outputs that were much closer to the actual CRM requirements.

This reduced the amount of post-processing required in the backend.

---

# Version 4 – Semantic Understanding

Initially, the prompt focused mostly on matching column names.

Later, I changed the instructions to focus on understanding the meaning of the data instead.

Instead of saying:

> Match similar column names.

The prompt now says:

> Understand what the column represents, even if the name is unfamiliar.

Example:

```text id="r6b7kq"
Customer Name
```

↓

```text id="5m9y2a"
name
```

Example:

```text id="z3h8xf"
Comments
```

↓

```text id="1v2jmd"
crm_note
```

### Improvement

The importer became much more flexible and worked better with CSV files coming from different platforms.

---

# Version 5 – JSON Only

During testing, I noticed that the AI occasionally added explanations before or after the JSON response.

While this is useful in a chat application, it makes backend parsing difficult.

To solve this, I updated the prompt with a strict instruction.

The AI must return only valid JSON.

No introductions.

No explanations.

No markdown.

Only the required JSON structure.

### Improvement

Parsing became much simpler and more reliable.

---

# Version 6 – Explainable AI

One feature I wanted to add beyond the assignment was explainability.

Instead of only returning mapped fields, the AI now also explains why it selected a particular mapping.

Example:

```json id="b7n2zx"
{
  "field": "company",
  "reason": "The values contain organization names."
}
```

### Improvement

Users can understand the AI's decisions instead of treating them as a black box.

---

# Version 7 – Confidence Levels

Originally, I considered asking the AI for a numeric confidence score.

After some research, I realized that numeric confidence values from LLMs are not always meaningful.

Instead, I changed the prompt to classify confidence into three simple levels:

* HIGH
* MEDIUM
* LOW

The backend later combines this with its own validation to produce the final confidence shown in the UI.

### Improvement

The confidence system became easier to explain and more reliable.

---

# Version 8 – Preventing Hallucinations

Another important improvement was reducing unnecessary assumptions.

The prompt now includes instructions such as:

* Do not invent missing values.
* Do not guess information.
* Leave unknown fields empty.
* Use only allowed enum values.
* Skip invalid records.

### Improvement

The AI became much more conservative, which is important when processing business data.

It is generally safer to leave a field empty than to fill it with incorrect information.

---

# Version 9 – Preparing for Human Review

The final version of the prompt was designed with the review screen in mind.

Besides the extracted CRM data, the AI also returns:

* mapped field
* confidence level
* reasoning

This additional information allows the frontend to display a review screen where users can verify the AI suggestions before importing them.

### Improvement

The application became more transparent and user-friendly.

Instead of blindly trusting the AI, users remain in control of the final import.

---

# Lessons Learned

Working on the prompt taught me a few important lessons.

### Be specific.

The clearer the instructions, the more consistent the responses.

---

### Give the model a clear role.

Treating the AI as a data extraction engine produced much better results than treating it like a general chatbot.

---

### Keep the output structured.

Returning strict JSON makes backend integration much easier.

---

### Do not rely only on AI.

Prompt engineering improves the output, but backend validation is still necessary.

Both layers work together.

---

### Small prompt changes matter.

Many of the improvements came from changing only one or two sentences.

Even small adjustments sometimes produced noticeably better results.

---

# Future Improvements

If this project were developed further, I would continue improving the prompt by:

* adding more real-world CSV examples during testing
* measuring mapping accuracy across different datasets
* comparing multiple prompt versions
* experimenting with structured outputs
* introducing automated prompt evaluation

Prompt engineering is an ongoing process.

The prompt should continue evolving as more CSV formats are encountered.

---

# Final Thoughts

Writing a good prompt turned out to be just as important as writing good application code.

Instead of expecting the AI to automatically understand every situation, I found it much more effective to provide clear instructions, define strict rules and keep the expected output predictable.

The final prompt is the result of multiple iterations rather than a single attempt.

Even though the application uses a powerful language model, the overall reliability comes from combining thoughtful prompt design, backend validation and user review.
