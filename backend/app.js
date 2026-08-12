import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";

const app = express();
config({
  path: "./config/config.env",
});

app.set("trust proxy", 1);
const allowedOrigins = (process.env.FRONTEND_URL || "").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.TEMP_FILE_DIR || "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many attempts. Please try again later." } });
const bidLimiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, message: "Too many bids. Please try again shortly." } });

app.get("/healthz", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/readyz", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  return res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not ready" });
});

app.use("/api/v1/user/register", authLimiter);
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/bid", bidLimiter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

app.use((req, res, next) => next(new ErrorHandler("Route not found.", 404)));
app.use(errorMiddleware);

export default app;
