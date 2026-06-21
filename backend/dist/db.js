"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mozart";
const useSsl = process.env.DATABASE_SSL === "true" ||
    databaseUrl.includes("neon.tech") ||
    databaseUrl.includes("sslmode=require");
exports.pool = new pg_1.Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});
