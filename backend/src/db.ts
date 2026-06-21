import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mozart";

const useSsl =
  process.env.DATABASE_SSL === "true" ||
  databaseUrl.includes("neon.tech") ||
  databaseUrl.includes("sslmode=require");

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});
