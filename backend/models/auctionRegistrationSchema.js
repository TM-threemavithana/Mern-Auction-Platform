import mongoose from "mongoose";

const auctionRegistrationSchema = new mongoose.Schema({
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });
auctionRegistrationSchema.index({ auction: 1, bidder: 1 }, { unique: true });
export const AuctionRegistration = mongoose.model("AuctionRegistration", auctionRegistrationSchema);
