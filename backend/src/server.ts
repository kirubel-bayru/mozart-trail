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
    docs: ["/api/health", "/api/db", "/api/music/:locationId"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Music endpoint — proxies an external API when MUSIC_API_URL is set.
 * Until then, the frontend uses sample tracks from Internet Archive.
 *
 * Expected upstream shape: { track: MusicTrack, cipher: MusicCipherChallenge }
 */
function isAllowedAudioUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return false;
    return (
      u.hostname === "upload.wikimedia.org" ||
      u.hostname === "archive.org" ||
      u.hostname.endsWith(".archive.org")
    );
  } catch {
    return false;
  }
}

/** Stream sample Mozart audio — avoids browser CORS/redirect issues with archive.org */
app.get("/api/audio/proxy", async (req, res) => {
  const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
  if (!rawUrl || !isAllowedAudioUrl(rawUrl)) {
    return res.status(400).json({ error: "Invalid or disallowed audio URL" });
  }

  try {
    const upstream = await fetch(rawUrl, {
      redirect: "follow",
      headers: { "User-Agent": "MozartsTrailApp/1.0 (educational)" },
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Upstream audio not found" });
    }

    const contentType = upstream.headers.get("content-type") || "audio/mpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");

    const buffer = await upstream.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ error: "Audio proxy failed", message });
  }
});

app.get("/api/music/:locationId", async (req, res) => {
  const base = process.env.MUSIC_API_URL?.replace(/\/$/, "");
  if (!base) {
    return res.status(501).json({
      error: "MUSIC_API_URL not configured",
      message:
        "Set MUSIC_API_URL on the backend to your music provider. Frontend falls back to sample tracks.",
      locationId: req.params.locationId,
    });
  }

  try {
    const upstream = await fetch(
      `${base}/locations/${encodeURIComponent(req.params.locationId)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "Upstream music API error",
        status: upstream.status,
      });
    }
    const data = await upstream.json();
    return res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ error: "Music API unreachable", message });
  }
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
