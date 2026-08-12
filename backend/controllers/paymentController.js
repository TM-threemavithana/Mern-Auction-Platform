import crypto from "crypto";
import mongoose from "mongoose";
import { Auction } from "../models/auctionSchema.js";
import { Payment } from "../models/paymentSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const toMoney = (amount) => Math.round(Number(amount) * 100) / 100;
const paymentView = (payment) => payment.populate([
  { path: "auction", select: "title image endTime" },
  { path: "buyer", select: "userName email" },
  { path: "seller", select: "userName email" },
]);

export const createAuctionPayment = async (auction) => {
  if (!auction.highestBidder || auction.currentBid <= 0) return null;
  const fee = toMoney(auction.currentBid * 0.05);
  return Payment.findOneAndUpdate(
    { auction: auction._id },
    { $setOnInsert: { auction: auction._id, buyer: auction.highestBidder, seller: auction.createdBy, amount: auction.currentBid, platformFee: fee, sellerAmount: toMoney(auction.currentBid - fee), provider: process.env.PAYMENT_PROVIDER || "mock" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const getMyPayments = catchAsyncErrors(async (req, res) => {
  const query = req.user.role === "Bidder" ? { buyer: req.user._id } : { seller: req.user._id };
  const payments = await Payment.find(query).sort({ createdAt: -1 });
  await Promise.all(payments.map(paymentView));
  res.json({ success: true, payments, demoMode: true });
});

export const getPayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return next(new ErrorHandler("Payment not found.", 404));
  const isParty = [payment.buyer.toString(), payment.seller.toString()].includes(req.user._id.toString());
  if (!isParty && req.user.role !== "Super Admin") return next(new ErrorHandler("You cannot access this payment.", 403));
  await paymentView(payment);
  res.json({ success: true, payment, demoMode: true });
});

export const startCheckout = catchAsyncErrors(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.auctionId)) return next(new ErrorHandler("Invalid auction ID.", 400));
  const auction = await Auction.findById(req.params.auctionId);
  if (!auction) return next(new ErrorHandler("Auction not found.", 404));
  if (!auction.highestBidder || auction.highestBidder.toString() !== req.user._id.toString()) return next(new ErrorHandler("Only the winning bidder can pay for this auction.", 403));
  if (auction.endTime > new Date()) return next(new ErrorHandler("Payment is available after the auction ends.", 409));
  const payment = await createAuctionPayment(auction);
  if (payment.status !== "awaiting_payment") return next(new ErrorHandler("This payment is already being processed.", 409));
  res.status(201).json({ success: true, payment, checkout: { mode: "mock", message: "Demo checkout only. No money or card data is collected." } });
});

export const completeMockPayment = catchAsyncErrors(async (req, res, next) => {
  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, buyer: req.user._id, status: "awaiting_payment" },
    { $set: { status: "payout_pending", paidAt: new Date(), providerReference: `MOCK-${crypto.randomUUID()}` } },
    { new: true }
  );
  if (!payment) return next(new ErrorHandler("This payment cannot be completed.", 409));
  res.json({ success: true, message: "Demo payment completed. Funds are awaiting administrator release.", payment });
});

export const requestRefund = catchAsyncErrors(async (req, res, next) => {
  const reason = String(req.body.reason || "").trim();
  if (reason.length < 10) return next(new ErrorHandler("Provide at least 10 characters explaining the refund request.", 400));
  const payment = await Payment.findOneAndUpdate({ _id: req.params.id, buyer: req.user._id, status: { $in: ["payout_pending", "payout_released"] } }, { $set: { status: "refund_requested", refundReason: reason } }, { new: true });
  if (!payment) return next(new ErrorHandler("A refund cannot be requested for this payment.", 409));
  res.json({ success: true, message: "Refund request submitted for administrator review.", payment });
});

export const openDispute = catchAsyncErrors(async (req, res, next) => {
  const reason = String(req.body.reason || "").trim();
  if (reason.length < 10) return next(new ErrorHandler("Provide at least 10 characters explaining the dispute.", 400));
  const payment = await Payment.findOneAndUpdate({ _id: req.params.id, $or: [{ buyer: req.user._id }, { seller: req.user._id }], status: { $in: ["payout_pending", "payout_released", "refund_requested"] } }, { $set: { status: "disputed", disputeReason: reason } }, { new: true });
  if (!payment) return next(new ErrorHandler("A dispute cannot be opened for this payment.", 409));
  res.json({ success: true, message: "Dispute opened for administrator review.", payment });
});

export const getAdminPayments = catchAsyncErrors(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 }).limit(100);
  await Promise.all(payments.map(paymentView));
  res.json({ success: true, payments, demoMode: true });
});

export const resolveAdminPayment = catchAsyncErrors(async (req, res, next) => {
  const action = req.body.action;
  const transitions = {
    release_payout: { from: ["payout_pending"], to: "payout_released", date: "payoutReleasedAt" },
    approve_refund: { from: ["refund_requested", "disputed"], to: "refunded", date: "refundedAt" },
    reject_refund: { from: ["refund_requested"], to: "payout_pending" },
    resolve_dispute_release: { from: ["disputed"], to: "payout_released", date: "payoutReleasedAt" },
    resolve_dispute_refund: { from: ["disputed"], to: "refunded", date: "refundedAt" },
  };
  const transition = transitions[action];
  if (!transition) return next(new ErrorHandler("Unsupported payment action.", 400));
  const update = { status: transition.to };
  if (transition.date) update[transition.date] = new Date();
  const payment = await Payment.findOneAndUpdate({ _id: req.params.id, status: { $in: transition.from } }, { $set: update }, { new: true });
  if (!payment) return next(new ErrorHandler("Payment is not in a state for that action.", 409));
  res.json({ success: true, message: `Demo payment action '${action}' completed.`, payment });
});
