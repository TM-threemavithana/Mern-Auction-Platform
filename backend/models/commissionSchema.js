import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentProof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentProof",
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Commission = mongoose.model("Commission", commissionSchema);
