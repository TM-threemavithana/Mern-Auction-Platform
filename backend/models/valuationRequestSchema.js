import mongoose from "mongoose";

const valuationRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true, maxlength: 140 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  preferredContact: { type: String, enum: ["email", "phone"], default: "email" },
  supportingImages: [{ public_id: String, url: String }],
  status: { type: String, enum: ["submitted", "under_review", "estimated", "declined"], default: "submitted" },
  estimateLow: { type: Number, min: 0 },
  estimateHigh: { type: Number, min: 0 },
  adminNote: { type: String, trim: true, maxlength: 2000 },
}, { timestamps: true });
export const ValuationRequest = mongoose.model("ValuationRequest", valuationRequestSchema);
