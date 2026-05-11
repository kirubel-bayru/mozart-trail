import { Pool } from "pg";

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/starter_db";

export const pool = new Pool({
  connectionString: databaseUrl,
});
