import { NewsletterSubscriber } from "../models/newsletterSubscriberSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const subscribe = catchAsyncErrors(async (req, res, next) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return next(new ErrorHandler("Enter a valid email address.", 400));
  await NewsletterSubscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  res.status(201).json({ success: true, message: "You are subscribed to auction updates." });
});
