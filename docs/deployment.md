# Deployment Guide

## Overview

This project is split into two independent applications.

* **Frontend** – Next.js
* **Backend** – Express.js

Keeping them separate makes deployment easier and allows each service to scale independently.

For this project, the frontend can be deployed on **Vercel**, while the backend can be deployed on **Render** or **Railway**.

The same setup also works locally during development.

---

# Project Structure

```text
project-root/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── .env
│
└── docs/
```

---

# Local Development

## Step 1

Clone the repository.

```bash
git clone <repository-url>
```

---

## Step 2

Install frontend dependencies.

```bash
cd frontend
npm install
```

---

## Step 3

Install backend dependencies.

```bash
cd backend
npm install
```

---

## Step 4

Create environment files.

Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend

```env
PORT=5000

GEMINI_API_KEY=your_api_key

MAX_BATCH_SIZE=50

MAX_FILE_SIZE=10485760
```

---

# Running the Project

Start the backend.

```bash
cd backend
npm run dev
```

Start the frontend.

```bash
cd frontend
npm run dev
```

The application should now be available locally.

Frontend

```text
http://localhost:3000
```

Backend

```text
http://localhost:5000
```

---

# Production Deployment

## Frontend

Recommended platform:

* Vercel

Deployment steps:

1. Connect the GitHub repository.
2. Select the frontend folder.
3. Add the required environment variables.
4. Deploy.

Frontend environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url/api
```

---

# Backend

Recommended platforms:

* Render
* Railway

Deployment steps:

1. Connect the repository.
2. Select the backend folder.
3. Configure environment variables.
4. Deploy.

Backend environment variables:

```env
PORT=5000

GEMINI_API_KEY=your_api_key

MAX_BATCH_SIZE=50

MAX_FILE_SIZE=10485760
```

The backend should never expose API keys to the frontend.

---

# Environment Variables

## Frontend

| Variable            | Purpose         |
| ------------------- | --------------- |
| NEXT_PUBLIC_API_URL | Backend API URL |

---

## Backend

| Variable       | Purpose                                    |
| -------------- | ------------------------------------------ |
| PORT           | Server port                                |
| GEMINI_API_KEY | Gemini API key                             |
| MAX_BATCH_SIZE | Number of records processed per AI request |
| MAX_FILE_SIZE  | Maximum upload size                        |

---

# File Upload Limits

The backend validates uploaded files before processing.

Current limits:

* Only CSV files
* Maximum file size defined by `MAX_FILE_SIZE`
* Empty files are rejected

These checks prevent unnecessary processing and reduce invalid requests.

---

# Health Check

After deployment, verify that the backend is running.

```
GET /api/health
```

Expected response:

```json
{
  "status": "OK"
}
```

This endpoint is useful for both manual testing and platform health checks.

---

# Common Deployment Issues

## API URL Mismatch

If the frontend cannot communicate with the backend, verify that:

* `NEXT_PUBLIC_API_URL` points to the deployed backend.
* The backend URL includes the correct `/api` prefix if required.

---

## CORS Errors

If requests are blocked by the browser:

* Allow the frontend origin in the backend CORS configuration.
* Avoid using a wildcard origin in production.

---

## Missing Environment Variables

If the backend starts but AI requests fail, check that:

* `GEMINI_API_KEY` is configured correctly.
* The deployment platform has the latest environment variables.

---

## Large Uploads

If large CSV files fail to upload:

* Increase the upload size limit.
* Process records in smaller batches.
* Stream the CSV instead of loading the entire file into memory.

---

# Deployment Checklist

Before deploying, verify the following:

* Frontend builds successfully.
* Backend builds successfully.
* Environment variables are configured.
* API keys are not committed to Git.
* `.env` files are included in `.gitignore`.
* Health endpoint responds correctly.
* CSV upload works.
* AI processing works.
* Preview screen loads correctly.
* Processed CRM records are displayed correctly.

---

# Production Considerations

Although this project is an assignment, I still followed a few practices that are useful in production.

* Keep secrets in environment variables.
* Validate every uploaded file.
* Never trust client input.
* Validate AI responses before returning them.
* Return consistent API responses.
* Process records in batches instead of a single large request.

These decisions make the application easier to maintain and scale in the future.

---

# Future Improvements

If this project were deployed as a production SaaS application, I would also consider:

* Docker containers
* CI/CD using GitHub Actions
* Automatic deployments
* Worker queues for background processing
* Monitoring and logging
* Error tracking
* Database-backed import history
* Multi-region deployment

These additions are beyond the scope of the assignment but would improve reliability and scalability.

---

# Final Thoughts

The deployment process is intentionally simple.

The frontend and backend can be developed independently, deployed independently, and updated independently.

This separation keeps the architecture clean while making the application easier to maintain as it grows.
