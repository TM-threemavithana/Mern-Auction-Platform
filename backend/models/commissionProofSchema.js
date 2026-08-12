import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  proof: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Processing", "Rejected", "Settled"],
  },
  amount: { type: Number, required: true, min: 0.01 },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
});

export const PaymentProof = mongoose.model("PaymentProof", paymentProofSchema);
