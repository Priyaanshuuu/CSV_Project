# Confidence System

## Overview

One of the features I wanted to add beyond the assignment was a confidence system.

When the AI maps a column to a CRM field, it is useful to know **how confident** it is about that decision.

At first, I thought about simply asking the AI to return a confidence score.

However, after thinking about it more, I realized that trusting the AI alone is not enough.

Instead, I designed a hybrid confidence system.

The final confidence shown to the user is calculated using both:

* AI semantic confidence
* Backend validation

This makes the result much more reliable than depending only on the LLM.

---

# Why Not Trust the AI Completely?

Suppose we ask the AI to return:

```json
{
  "field": "email",
  "confidence": 0.98
}
```

The number looks precise.

But in reality, it is still the model's own estimate.

If we ask the same question multiple times, the score may change slightly.

That makes it difficult to treat it as a reliable measurement.

Instead of pretending the number is mathematically accurate, I decided to use a simpler approach.

The AI only tells us whether its confidence is:

* HIGH
* MEDIUM
* LOW

This is much easier to understand and easier to justify.

---

# Two Layers of Confidence

The confidence system works in two independent stages.

## Stage 1 – AI Semantic Confidence

The AI looks at the meaning of the column.

Example:

CSV Column

```text
Customer Name
```

The AI understands that this column contains personal names.

It returns:

```json
{
  "field": "name",
  "ai_confidence": "HIGH",
  "reason": "The values appear to contain personal names."
}
```

At this stage, the AI has only understood the meaning.

It has not checked whether the extracted value is actually valid.

---

## Stage 2 – Backend Validation

Once the backend receives the AI response, it performs deterministic validation.

Unlike the AI, these checks are based on fixed rules.

Examples include:

### Email Validation

* Is the email present?
* Does it match a valid email format?

Example:

```text
john@example.com
```

Result:

✅ Valid

---

### Phone Validation

* Can a country code be extracted?
* Does the remaining number contain the expected number of digits?

Example:

```text
+91 9876543210
```

Result:

✅ Valid

---

### Date Validation

The assignment requires that `created_at` should work with:

```javascript
new Date(created_at)
```

The backend verifies that the extracted date can actually be parsed.

---

### CRM Status Validation

Only these values are allowed:

* GOOD_LEAD_FOLLOW_UP
* DID_NOT_CONNECT
* BAD_LEAD
* SALE_DONE

If the AI returns something outside this list, the backend marks the value as invalid.

---

### Data Source Validation

The same approach is used for the `data_source` field.

Only predefined values are accepted.

---

# Combining Both Results

Once both stages are complete, the backend combines them into the final confidence level.

Example:

| AI Confidence | Backend Validation | Final Confidence |
| ------------- | ------------------ | ---------------- |
| HIGH          | Passed             | HIGH             |
| HIGH          | Failed             | MEDIUM           |
| MEDIUM        | Passed             | MEDIUM           |
| MEDIUM        | Failed             | LOW              |
| LOW           | Passed             | LOW              |
| LOW           | Failed             | LOW              |

The goal is not to calculate an exact probability.

The goal is to communicate how trustworthy the mapping appears after considering both semantic understanding and technical validation.

---

# Example 1

CSV

```text
Customer Name
```

Value

```text
John Doe
```

AI says:

* Field → name
* Confidence → HIGH

Backend checks:

* Looks like a valid personal name
* No formatting issues

Final Result

```text
HIGH
```

---

# Example 2

CSV

```text
Primary Contact
```

Value

```text
+91 9876543210
```

AI says:

* Field → mobile_without_country_code
* Confidence → HIGH

Backend checks:

* Country code extracted
* Mobile number is valid

Final Result

```text
HIGH
```

---

# Example 3

CSV

```text
Customer
```

Value

```text
ABC Pvt Ltd
```

AI says:

* Field → name
* Confidence → MEDIUM

Backend notices:

* Value contains "Pvt Ltd"
* Looks more like a company than a person's name

Final Result

```text
LOW
```

The backend reduces the confidence because the extracted value does not match the expected pattern.

---

# Why Show Confidence to the User?

AI is powerful, but it is not perfect.

Showing confidence helps users decide where they should pay more attention.

Example:

```text
🟢 Name
HIGH

🟢 Email
HIGH

🟡 Company
MEDIUM

🔴 Lead Owner
LOW
```

This allows users to review uncertain fields before importing them into the CRM.

---

# Why Show the Reason?

Confidence alone is not enough.

The user should also understand why the AI made a particular decision.

Example:

```text
Field

name

Reason

The column contains values that resemble personal names.
```

Or:

```text
Field

crm_note

Reason

The column contains comments and follow-up information.
```

This makes the system easier to trust.

---

# Human Review

Fields with lower confidence are highlighted during the review step.

Users can:

* accept the AI suggestion
* edit the mapped field
* continue with the import

This combines the speed of AI with human verification.

Instead of replacing the user, the AI acts as an intelligent assistant.

---

# Future Improvements

The current confidence system is intentionally simple.

In the future, it could be extended by including:

* duplicate detection
* column-level confidence
* historical correction patterns
* confidence based on previous user edits
* confidence calibration using evaluation datasets

These additions could make the confidence estimation even more accurate over time.

---

# Final Thoughts

One of my goals while building this project was to avoid treating the AI as an unquestionable source of truth.

Instead, I wanted the AI to provide intelligent suggestions while allowing the backend to verify what can be verified.

The final confidence level is therefore not just the model's opinion.

It is the result of combining semantic understanding with deterministic validation.

This approach makes the system more transparent, easier to explain and more trustworthy for users who rely on the imported CRM data.
