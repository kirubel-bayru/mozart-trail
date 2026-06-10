import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mozart";

export const pool = new Pool({
  connectionString: databaseUrl,
});
