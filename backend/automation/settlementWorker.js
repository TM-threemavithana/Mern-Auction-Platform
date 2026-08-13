import crypto from "crypto";
import mongoose from "mongoose";
import { Auction } from "../models/auctionSchema.js";
import { Payment } from "../models/paymentSchema.js";
import { User } from "../models/userSchema.js";
import { WorkerLock } from "../models/workerLockSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

const WORKER_ID = process.env.WORKER_ID || `${process.pid}-${crypto.randomUUID()}`;
const LOCK_NAME = "auction-settlement";
const LOCK_MS = 90_000;
const money = (value) => Math.round(Number(value) * 100) / 100;

const acquireWorkerLock = async () => {
  const now = new Date(); const expiresAt = new Date(now.getTime() + LOCK_MS);
  try {
    const lock = await WorkerLock.findOneAndUpdate({ name: LOCK_NAME, $or: [{ expiresAt: { $lte: now } }, { owner: WORKER_ID }] }, { $set: { owner: WORKER_ID, expiresAt } }, { new: true, upsert: true });
    return lock.owner === WORKER_ID;
  } catch (error) {
    if (error?.code === 11000) return false;
    throw error;
  }
};
const releaseWorkerLock = () => WorkerLock.deleteOne({ name: LOCK_NAME, owner: WORKER_ID });

const claimAuction = (auctionId, lockId, now) => Auction.findOneAndUpdate({ _id: auctionId, endTime: { $lte: now }, commissionCalculated: { $ne: true }, $or: [{ settlementStatus: { $exists: false } }, { settlementStatus: "pending" }, { settlementStatus: "processing", settlementLockExpiresAt: { $lte: now } }] }, { $set: { settlementStatus: "processing", settlementLockId: lockId, settlementLockExpiresAt: new Date(now.getTime() + LOCK_MS) } }, { new: true });

export const settleAuction = async (auctionId) => {
  const now = new Date(); const lockId = crypto.randomUUID(); const claimed = await claimAuction(auctionId, lockId, now);
  if (!claimed) return null;
  const session = await mongoose.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      const auction = await Auction.findOne({ _id: auctionId, settlementStatus: "processing", settlementLockId: lockId }).session(session).select("+settlementLockId");
      if (!auction) throw new Error("Settlement claim was lost.");
      if (!auction.highestBidder || auction.currentBid <= 0) {
        auction.set({ settlementStatus: "no_sale", commissionCalculated: true, settledAt: now, settlementLockId: undefined, settlementLockExpiresAt: undefined });
        await auction.save({ session }); result = { auction, noSale: true }; return;
      }
      const [buyer, seller] = await Promise.all([User.findById(auction.highestBidder).session(session), User.findById(auction.createdBy).session(session)]);
      if (!buyer || !seller) throw new Error("Auction participants could not be found.");
      const fee = money(auction.currentBid * 0.05);
      const existingPayment = await Payment.findOne({ auction: auction._id }).session(session);
      if (!existingPayment) {
        await Payment.create([{ auction: auction._id, buyer: buyer._id, seller: seller._id, amount: auction.currentBid, platformFee: fee, sellerAmount: money(auction.currentBid - fee), provider: process.env.PAYMENT_PROVIDER || "mock" }], { session });
      }
      await User.updateOne({ _id: buyer._id }, { $inc: { moneySpent: auction.currentBid, auctionsWon: 1 } }, { session });
      auction.set({ settlementStatus: "settled", commissionCalculated: true, settledAt: now, settlementLockId: undefined, settlementLockExpiresAt: undefined });
      await auction.save({ session }); result = { auction, buyer, noSale: false };
    });
  } finally { await session.endSession(); }
  return result;
};

const notifyWinner = async ({ auction, buyer, noSale }) => {
  if (noSale || !buyer) return;
  try { await sendEmail({ email: buyer.email, subject: `You won ${auction.title}`, message: `Congratulations ${buyer.userName}. Sign in to BidSpirit and open My Payments to complete checkout.` }); }
  catch (error) { console.error("Settlement completed but winner notification failed", auction._id, error); }
};

export const runSettlementCycle = async () => {
  if (!(await acquireWorkerLock())) return { skipped: true, reason: "another worker holds the lock" };
  try {
    const now = new Date();
    const candidates = await Auction.find({ endTime: { $lte: now }, commissionCalculated: { $ne: true }, $or: [{ settlementStatus: { $exists: false } }, { settlementStatus: "pending" }, { settlementStatus: "processing", settlementLockExpiresAt: { $lte: now } }] }).select("_id").limit(100);
    const settled = [];
    for (const candidate of candidates) { const result = await settleAuction(candidate._id); if (result) { settled.push(result); await notifyWinner(result); } }
    return { skipped: false, processed: settled.length };
  } finally { await releaseWorkerLock(); }
};
