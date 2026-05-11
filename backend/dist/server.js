"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 4000);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
}));
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "backend",
        timestamp: new Date().toISOString(),
    });
});
app.get("/api/db", async (_req, res) => {
    try {
        const result = await db_1.pool.query("SELECT NOW() as server_time");
        res.json({
            status: "ok",
            database: "connected",
            serverTime: result.rows[0].server_time,
        });
    }
    catch (error) {
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
