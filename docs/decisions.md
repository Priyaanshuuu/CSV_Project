# Engineering Decisions

## Why I Chose This Tech Stack

Every technology in this project was chosen for a reason. I tried to keep the stack simple while making sure it was production-ready and easy to maintain.

The assignment already suggested a preferred stack, so I stayed close to those requirements instead of introducing unnecessary technologies.

---

# Why Next.js?

I chose Next.js because it provides a solid foundation for building modern web applications.

Although this project is mainly a client-side application, Next.js still gives several advantages.

* Simple project structure
* Excellent TypeScript support
* Built-in routing
* Easy deployment on Vercel
* Great developer experience

Another reason is that Next.js is one of the most commonly used frameworks in modern React development. Using it makes the project feel closer to what teams build in production.

---

# Why Express Instead of Next.js API Routes?

One question that naturally comes up is:

> If Next.js can also create APIs, why use Express?

The main reason is that the assignment specifically asked for an Express backend.

Keeping the backend separate also has some practical benefits.

* Frontend and backend can be deployed independently.
* Backend can later be reused by a mobile application.
* API development remains isolated from UI development.
* The architecture becomes easier to scale if more services are added in the future.

For a project of this size, Next.js API routes would also work well, but I decided to follow the assignment requirements and keep a clear separation between frontend and backend.

---

# Why TypeScript?

This project processes a lot of structured data.

Using plain JavaScript would make it easier to accidentally introduce bugs, especially when dealing with AI responses.

TypeScript helps by:

* catching errors during development
* improving autocomplete
* making APIs easier to understand
* documenting data structures through types

As the project grows, strong typing becomes even more valuable.

---

# Why Gemini?

The main challenge in this assignment is semantic understanding.

The AI needs to understand that different column names may represent the same CRM field.

For example:

```id="k3a5rm"
Customer Name
Client
Prospect
Contact Person
```

can all represent

```id="t8h1lz"
name
```

A traditional rule-based system would require hundreds of conditions.

Gemini is capable of understanding the meaning behind the data instead of relying only on exact column names.

That makes it a good fit for this problem.

---

# Why Prompt Engineering Instead of Hardcoded Rules?

One possible solution would be writing many if-else statements.

Example:

```id="pq7tcu"
if column == "Customer"

if column == "Client"

if column == "Lead Name"

if column == "Prospect"
```

This approach quickly becomes difficult to maintain.

Every new CSV format would require additional code.

Instead, the AI receives clear instructions about the CRM schema and decides the best mapping based on the meaning of the data.

This makes the importer flexible enough to support many different CSV formats without changing the code.

---

# Why Batch Processing?

Large CSV files may contain hundreds or even thousands of records.

Sending everything in one AI request has several problems.

* Higher token usage
* Longer response times
* Greater chance of request failure
* Difficult recovery if something goes wrong

Instead, records are divided into smaller batches.

Benefits of batching:

* Lower memory usage
* Faster processing
* Easier retries
* Better reliability
* Lower AI costs

Even if one batch fails, the remaining batches can still continue.

---

# Why a Stateless Backend?

This assignment does not require storing data permanently.

Each request follows a simple flow.

```id="n7g0w2"
Receive CSV

↓

Process CSV

↓

Return CRM Records
```

Since every request is independent, adding a database would only increase complexity without providing much benefit.

Keeping the backend stateless makes deployment easier and keeps the project focused on the assignment.

---

# Why Zod?

Every API should validate incoming data before processing it.

Zod provides a simple way to validate:

* request body
* uploaded data
* AI responses
* configuration values

Validation helps catch problems early instead of allowing invalid data to move deeper into the application.

This makes debugging much easier.

---

# Why Separate Controllers, Services and Utilities?

I wanted every file to have a single responsibility.

Instead of putting everything inside one controller, the application is divided into layers.

Routes

* Receive requests

Controllers

* Coordinate the workflow

Services

* Contain business logic

Utilities

* Reusable helper functions

Validators

* Validate inputs

Prompt Builder

* Generate AI prompts

This keeps the project organized and makes future changes much easier.

---

# Why Build a Prompt Builder?

The AI prompt is one of the most important parts of this project.

Instead of keeping a long prompt inside the AI service, I placed it in a dedicated prompt builder.

This provides a few advantages.

* Easier to update prompts
* Cleaner AI service
* Better version control
* Simpler experimentation with prompt improvements

Prompt engineering becomes a separate part of the project rather than being mixed with application logic.

---

# Why Build a Hybrid Confidence System?

Initially, I considered displaying whatever confidence score the AI returned.

After thinking more about it, I realized that AI confidence alone is not always reliable.

Instead, I designed a hybrid confidence system.

The AI estimates how confident it is about the meaning of a field.

The backend then validates the extracted value using deterministic checks such as:

* email format
* phone number format
* valid dates
* allowed CRM status
* allowed data source

The final confidence shown to the user combines both of these signals.

This makes the confidence level easier to trust and easier to explain.

---

# Why Show AI Reasoning?

One thing I wanted to avoid was making the AI feel like a black box.

Instead of simply saying

```id="d0jq9l"
Customer

↓

Name
```

the application also explains why the mapping was made.

Example:

```id="2e3g5a"
Reason:

The values in this column appear to contain personal names.
```

This helps users understand the AI's decision and makes the system feel more transparent.

---

# Why Add a Human Review Step?

Even the best AI models can make mistakes.

Rather than importing everything automatically, the user gets a chance to review the AI suggestions.

If something looks incorrect, it can be corrected before the final import.

This approach combines the speed of AI with the reliability of human verification.

---

# Why Retry Failed AI Batches?

External APIs can occasionally fail because of:

* network issues
* rate limits
* temporary service interruptions

Instead of stopping the entire import process, only the failed batch is retried.

If retries are exhausted, the remaining batches continue processing.

This makes the application more resilient and provides a better user experience.

---

# Technologies I Considered

While planning the project, I also explored other approaches.

One option was using Python with FastAPI and Pydantic.

Pydantic makes structured validation and AI response parsing very convenient.

However, the assignment specifically requested a Node.js and Express backend.

Since following the assignment requirements was more important than using my preferred stack, I chose Express while documenting the alternative approach separately.

---

# Final Thoughts

While building this project, I tried to keep one idea in mind.

Every technology should solve a real problem.

I avoided adding unnecessary libraries or complicated patterns just because they are popular.

The goal was to build a project that is clean, reliable and easy to understand while demonstrating how AI can be used responsibly in a real-world workflow.
