import mongoose from "mongoose";

const workerLockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true, versionKey: false });

export const WorkerLock = mongoose.model("WorkerLock", workerLockSchema);
