import { config } from "dotenv";
import { connection } from "./database/connection.js";
import { validateEnvironment } from "./utils/environment.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";

config({ path: "./config/config.env" });
const start = async () => { validateEnvironment(); await connection(); endedAuctionCron(); console.log("Auction settlement worker started."); };
start().catch((error) => { console.error("Worker startup failed:", error.message); process.exit(1); });
