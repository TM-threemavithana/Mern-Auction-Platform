import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, default: "LKR", enum: ["LKR"] },
  platformFee: { type: Number, required: true, min: 0 },
  sellerAmount: { type: Number, required: true, min: 0 },
  provider: { type: String, default: "mock", enum: ["mock", "payhere"] },
  providerReference: { type: String, unique: true, sparse: true },
  status: { type: String, default: "awaiting_payment", enum: ["awaiting_payment", "paid", "payout_pending", "payout_released", "refund_requested", "refunded", "disputed", "cancelled"] },
  refundReason: { type: String, trim: true, maxlength: 1000 },
  disputeReason: { type: String, trim: true, maxlength: 1000 },
  paidAt: Date,
  payoutReleasedAt: Date,
  refundedAt: Date,
  settlementAppliedAt: { type: Date, default: null },
}, { timestamps: true });

paymentSchema.index({ buyer: 1, createdAt: -1 });
paymentSchema.index({ seller: 1, createdAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);
