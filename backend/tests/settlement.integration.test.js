import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import path from "node:path";
import { Auction } from "../models/auctionSchema.js";
import { Payment } from "../models/paymentSchema.js";
import { User } from "../models/userSchema.js";
import { WorkerLock } from "../models/workerLockSchema.js";
import { runSettlementCycle, settleAuction } from "../automation/settlementWorker.js";

let replSet;
const profileImage = { public_id: "integration-test", url: "https://example.test/profile.webp" };
const user = (role, suffix) => User.create({ userName: `${role}-${suffix}`, email: `${role}-${suffix}@example.test`, password: "password123", address: "Colombo", phone: "0771234567", profileImage, role });

test.before(async () => {
  replSet = await MongoMemoryReplSet.create({ binary: { downloadDir: path.join(process.cwd(), ".mongodb-binaries") }, replSet: { count: 1, storageEngine: "wiredTiger" } });
  await mongoose.connect(replSet.getUri(), { dbName: "bidspirit-integration" });
});
beforeEach(async () => { await mongoose.connection.db.dropDatabase(); });
after(async () => { await mongoose.disconnect(); if (replSet) await replSet.stop(); });

test("settlement commits payment, winner totals, and auction state exactly once", async () => {
  const [seller, buyer] = await Promise.all([user("Auctioneer", "seller"), user("Bidder", "buyer")]);
  const auction = await Auction.create({ title: "Settlement test", description: "A completed test auction", category: "Art & Antiques", condition: "Used", startingBid: 1000, currentBid: 2500, startTime: new Date(Date.now() - 7200000), endTime: new Date(Date.now() - 3600000), image: profileImage, createdBy: seller._id, highestBidder: buyer._id });
  const first = await settleAuction(auction._id);
  const second = await settleAuction(auction._id);
  const [savedAuction, payment, savedBuyer] = await Promise.all([Auction.findById(auction._id), Payment.findOne({ auction: auction._id }), User.findById(buyer._id)]);
  assert.equal(first.noSale, false); assert.equal(second, null); assert.equal(savedAuction.settlementStatus, "settled"); assert.equal(savedAuction.commissionCalculated, true);
  assert.equal(await Payment.countDocuments({ auction: auction._id }), 1); assert.equal(payment.amount, 2500); assert.equal(payment.platformFee, 125);
  assert.equal(savedBuyer.moneySpent, 2500); assert.equal(savedBuyer.auctionsWon, 1);
});

test("no-sale auction settles without creating a payment or buyer totals", async () => {
  const seller = await user("Auctioneer", "nosale");
  const auction = await Auction.create({ title: "No sale", description: "No bids received", category: "Furniture", condition: "Used", startingBid: 1000, startTime: new Date(Date.now() - 7200000), endTime: new Date(Date.now() - 3600000), image: profileImage, createdBy: seller._id });
  const result = await settleAuction(auction._id);
  const saved = await Auction.findById(auction._id);
  assert.equal(result.noSale, true); assert.equal(saved.settlementStatus, "no_sale"); assert.equal(await Payment.countDocuments(), 0);
});

test("worker cycle uses a durable lease and clears it after processing", async () => {
  const seller = await user("Auctioneer", "worker");
  await Auction.create({ title: "Worker no sale", description: "Cycle test", category: "Furniture", condition: "Used", startingBid: 1000, startTime: new Date(Date.now() - 7200000), endTime: new Date(Date.now() - 3600000), image: profileImage, createdBy: seller._id });
  const cycle = await runSettlementCycle();
  assert.equal(cycle.skipped, false); assert.equal(cycle.processed, 1); assert.equal(await WorkerLock.countDocuments(), 0);
});
