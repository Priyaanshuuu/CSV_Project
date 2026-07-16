"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const process_route_1 = __importDefault(require("./routes/process.route"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/health", health_routes_1.default);
app.use("/api/upload", upload_routes_1.default);
app.use("/api/process", process_route_1.default);
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
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
