import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool } from "./db";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Backend is running",
    docs: ["/api/health", "/api/db"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as server_time");
    res.json({
      status: "ok",
      database: "connected",
      serverTime: result.rows[0].server_time,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message,
    });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
