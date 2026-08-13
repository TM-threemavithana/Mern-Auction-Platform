import cron from "node-cron";
import { runSettlementCycle } from "./settlementWorker.js";

export const endedAuctionCron = () => {
  const run = async () => { try { await runSettlementCycle(); } catch (error) { console.error("Auction settlement cycle failed", error); } };
  cron.schedule("*/1 * * * *", run);
  run();
};
