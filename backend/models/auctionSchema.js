import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  startingBid: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  condition: {
    type: String,
    enum: ["New", "Used"],
  },
  currentBid: { type: Number, default: 0, min: 0 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userName: String,
      profileImage: String,
      amount: Number,
    },
  ],
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commissionCalculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Auction = mongoose.model("Auction", auctionSchema);
