import mongoose from "mongoose";

const bidAuditSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true, index: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0.01 },
  previousBid: { type: Number, required: true, min: 0 },
  acceptedAt: { type: Date, default: Date.now, immutable: true },
  source: { type: String, enum: ["web", "staff"], default: "web", immutable: true },
}, { versionKey: false });
bidAuditSchema.index({ auction: 1, acceptedAt: -1 });
export const BidAudit = mongoose.model("BidAudit", bidAuditSchema);
