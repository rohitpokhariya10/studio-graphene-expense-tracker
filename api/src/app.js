import express from "express";
import cors from "cors";
import { env } from "./config/env.js";

const app = express();

// Security & Parsing Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
// app.use("/api/v1/expenses", expenseRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error Handler
app.use((error, req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
});

export default app;
