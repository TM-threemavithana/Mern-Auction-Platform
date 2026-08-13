import mongoose from "mongoose";
import { Auction } from "../models/auctionSchema.js";
import { Watchlist } from "../models/watchlistSchema.js";
import { AuctionRegistration } from "../models/auctionRegistrationSchema.js";
import { ValuationRequest } from "../models/valuationRequestSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getWatchlist = catchAsyncErrors(async (req, res) => {
  const entries = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("auction");
  res.json({ success: true, auctions: entries.filter((entry) => entry.auction).map((entry) => entry.auction) });
});
export const addWatchlist = catchAsyncErrors(async (req, res, next) => {
  if (!validId(req.params.auctionId)) return next(new ErrorHandler("Invalid auction ID.", 400));
  const auction = await Auction.exists({ _id: req.params.auctionId });
  if (!auction) return next(new ErrorHandler("Auction not found.", 404));
  await Watchlist.updateOne({ user: req.user._id, auction: req.params.auctionId }, { $setOnInsert: { user: req.user._id, auction: req.params.auctionId } }, { upsert: true });
  res.status(201).json({ success: true, message: "Auction saved to your watchlist." });
});
export const removeWatchlist = catchAsyncErrors(async (req, res) => { await Watchlist.deleteOne({ user: req.user._id, auction: req.params.auctionId }); res.json({ success: true, message: "Auction removed from your watchlist." }); });

export const registerForAuction = catchAsyncErrors(async (req, res, next) => {
  if (!validId(req.params.auctionId)) return next(new ErrorHandler("Invalid auction ID.", 400));
  const auction = await Auction.findById(req.params.auctionId);
  if (!auction) return next(new ErrorHandler("Auction not found.", 404));
  if (auction.endTime <= new Date()) return next(new ErrorHandler("Registration is closed for this auction.", 409));
  const registration = await AuctionRegistration.findOneAndUpdate({ auction: auction._id, bidder: req.user._id }, { $setOnInsert: { auction: auction._id, bidder: req.user._id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.status(201).json({ success: true, registration, message: registration.status === "approved" ? "You are approved to bid." : "Registration submitted for auctioneer review." });
});
export const getAuctionRegistrations = catchAsyncErrors(async (req, res, next) => {
  const auction = await Auction.findById(req.params.auctionId);
  if (!auction || auction.createdBy.toString() !== req.user._id.toString()) return next(new ErrorHandler("Auction not found.", 404));
  const registrations = await AuctionRegistration.find({ auction: auction._id }).populate("bidder", "userName email profileImage");
  res.json({ success: true, registrations });
});
export const reviewRegistration = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return next(new ErrorHandler("Choose approved or rejected.", 400));
  const registration = await AuctionRegistration.findById(req.params.id).populate("auction");
  if (!registration || registration.auction.createdBy.toString() !== req.user._id.toString()) return next(new ErrorHandler("Registration not found.", 404));
  registration.status = status; await registration.save(); res.json({ success: true, registration });
});

export const createValuationRequest = catchAsyncErrors(async (req, res, next) => {
  const { title, category, description, preferredContact } = req.body;
  if (!title || !category || !description) return next(new ErrorHandler("Title, category, and description are required.", 400));
  const incoming = req.files?.images ? (Array.isArray(req.files.images) ? req.files.images : [req.files.images]) : [];
  if (incoming.length > 5) return next(new ErrorHandler("Upload up to five supporting images.", 400));
  const supportingImages = [];
  for (const image of incoming) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(image.mimetype) || image.size > 5 * 1024 * 1024) return next(new ErrorHandler("Supporting images must be PNG, JPEG, or WebP and 5 MB or smaller.", 400));
    const upload = await cloudinary.uploader.upload(image.tempFilePath, { folder: "MERN_AUCTION_PLATFORM_VALUATIONS" });
    supportingImages.push({ public_id: upload.public_id, url: upload.secure_url });
  }
  const request = await ValuationRequest.create({ user: req.user._id, title, category, description, preferredContact, supportingImages });
  res.status(201).json({ success: true, request, message: "Valuation request submitted." });
});
export const getMyValuations = catchAsyncErrors(async (req, res) => { const requests = await ValuationRequest.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, requests }); });
export const getAdminValuations = catchAsyncErrors(async (req, res) => { const requests = await ValuationRequest.find().sort({ createdAt: -1 }).populate("user", "userName email"); res.json({ success: true, requests }); });
export const reviewValuation = catchAsyncErrors(async (req, res, next) => {
  const { status, estimateLow, estimateHigh, adminNote } = req.body;
  if (!["under_review", "estimated", "declined"].includes(status)) return next(new ErrorHandler("Invalid valuation status.", 400));
  const request = await ValuationRequest.findByIdAndUpdate(req.params.id, { status, estimateLow: Number(estimateLow) || undefined, estimateHigh: Number(estimateHigh) || undefined, adminNote }, { new: true, runValidators: true });
  if (!request) return next(new ErrorHandler("Valuation request not found.", 404));
  res.json({ success: true, request });
});
