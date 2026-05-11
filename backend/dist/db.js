"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/starter_db";
exports.pool = new pg_1.Pool({
    connectionString: databaseUrl,
});
