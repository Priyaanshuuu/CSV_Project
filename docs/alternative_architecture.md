# Alternative Architecture

## Overview

The implementation of this project uses **Next.js**, **Express**, **TypeScript** and **Gemini**, which closely follows the technology stack suggested in the assignment.

While planning the project, I also spent some time thinking about alternative architectures.

One architecture that stood out was:

```text
Next.js

↓

FastAPI

↓

Pydantic

↓

Gemini Structured Output
```

I did not choose this architecture because the assignment specifically asked for a Node.js and Express backend.

However, I think it is worth discussing because it highlights another way to solve the same problem.

This document is not meant to say that one stack is better than another.

It simply explains the trade-offs.

---

# The Problem We Are Solving

The biggest challenge in this project is not reading CSV files.

Libraries can already do that very well.

The difficult part is converting unstructured CSV data into a fixed CRM schema.

For example,

```csv
Customer Name,Mail ID,Primary Contact,Comments
```

needs to become

```text
name

email

mobile_without_country_code

crm_note
```

Regardless of the programming language, this problem has three steps.

1. Read the CSV.
2. Ask the AI to understand the data.
3. Validate the AI response.

Both architectures solve these three steps.

The difference is how validation is handled.

---

# Current Architecture

The current implementation uses:

```text
Next.js

↓

Express

↓

Gemini

↓

Zod Validation

↓

Frontend
```

The backend receives the AI response and validates it using Zod before sending it back to the frontend.

This approach works well and matches the assignment requirements.

---

# Alternative Architecture

If I were starting this project without any technology restrictions, I would seriously consider using FastAPI.

The architecture would look like this.

```text
Next.js

↓

FastAPI

↓

Gemini

↓

Pydantic Models

↓

Frontend
```

The biggest reason is Pydantic.

---

# Why Pydantic?

Pydantic allows developers to describe the expected data structure using Python classes.

Example:

```python
class CRMLead(BaseModel):
    name: str | None
    email: str | None
    company: str | None
    city: str | None
    crm_status: str | None
```

Once the model is defined,

every AI response can be validated against it automatically.

This removes a lot of manual validation code.

---

# Why I Like This Approach

One thing I appreciate about Pydantic is that the schema becomes the single source of truth.

Instead of writing validation rules in multiple places,

the model itself defines what is valid.

That makes the code easier to read and easier to maintain.

---

# Structured Outputs

Modern LLM APIs are moving towards structured outputs.

Instead of asking the model to return JSON and then validating it later,

the model can be guided to generate data that already matches a predefined schema.

This reduces parsing errors and makes the integration more reliable.

Although my implementation still validates everything on the backend, I think structured outputs are an exciting direction for future AI applications.

---

# Why I Still Chose Express

Even though I liked the FastAPI approach,

I intentionally decided not to use it.

There were two reasons.

### 1. Assignment Requirements

The assignment clearly mentions:

* Node.js
* Express

Following the given requirements felt more important than using my preferred stack.

A good engineer should be able to work within project constraints.

---

### 2. I Already Use TypeScript

Most of my recent projects are built with TypeScript.

Using Express allowed me to stay within an ecosystem I am comfortable with while keeping the frontend and backend language consistent.

Sharing types between projects also becomes easier.

---

# Zod vs Pydantic

Both libraries solve a similar problem.

Their syntax is different, but their purpose is the same.

## Zod

Advantages:

* Excellent TypeScript integration
* Great developer experience
* Works naturally in Node.js projects
* Strong runtime validation

Limitations:

* Validation logic stays in the TypeScript ecosystem.

---

## Pydantic

Advantages:

* Very clean schema definition
* Automatic validation
* Excellent with FastAPI
* Works extremely well with structured AI outputs

Limitations:

* Requires switching to Python.
* Introduces another language into the project.

---

# Why I Didn't Mix Both

I could have written the frontend in Next.js and the backend in FastAPI.

Technically, that would work.

However, for this assignment, I preferred keeping the project simple.

Introducing another programming language would increase the learning curve for anyone reviewing the project.

Keeping everything in TypeScript also makes the repository easier to understand.

---

# What I Learned

While researching different approaches, one thing became clear.

The programming language is not the most important part of the solution.

The overall workflow remains almost identical.

```text
CSV

↓

Parse

↓

AI

↓

Validate

↓

Review

↓

Import
```

The real challenge is designing a reliable pipeline around the AI.

Whether the validation is done using Zod or Pydantic is a secondary implementation detail.

---

# Future Direction

If this project evolved into a larger production system,

I would probably experiment with both implementations.

I would compare them based on:

* developer experience
* validation quality
* AI integration
* maintainability
* response time
* ease of testing

Only after measuring these factors would I decide which architecture fits the product better.

---

# Final Thoughts

One of the things I enjoyed while building this project was exploring different ways to solve the same problem.

Although I ultimately implemented the solution using Express and TypeScript, thinking about alternatives helped me understand the strengths and limitations of different ecosystems.

For this assignment, I believe Express was the right choice because it aligns with the requested stack and keeps the project consistent.

At the same time, learning about FastAPI and Pydantic gave me a better understanding of how structured AI applications can be built in Python.

Knowing multiple approaches does not mean switching technologies for every project.

It simply means making informed decisions based on the problem, the requirements and the trade-offs.
