import app from "./app.js";
import cloudinary from "cloudinary";
import { connection } from "./database/connection.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCorn.js";
import { validateEnvironment } from "./utils/environment.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const start = async () => {
  validateEnvironment();
  await connection();
  endedAuctionCron();
  verifyCommissionCron();
  const server = app.listen(process.env.PORT || 5000, () => console.log(`Server listening on port ${process.env.PORT || 5000}`));
  const shutdown = (signal) => {
    console.log(`${signal} received. Closing server.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => { console.error("Startup failed:", error.message); process.exit(1); });
