import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import uploadRoutes from "./routes/upload.routes";
import processRoutes from "./routes/process.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/process", processRoutes);

// 404 — must come after all routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint does not exist.",
    },
  });
});

// Global error handler — must be last and must have 4 parameters
app.use(errorMiddleware);

export default app;
