import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100) {
    return next(new ErrorHandler("Enter a valid bid amount.", 400));
  }

  const bidder = await User.findById(req.user._id).select(
    "userName profileImage"
  );
  if (!bidder) return next(new ErrorHandler("Bidder not found.", 404));

  const bidEntry = {
    userId: bidder._id,
    userName: bidder.userName,
    profileImage: bidder.profileImage?.url,
    amount,
  };
  const now = new Date();

  // The conditional update is the concurrency guard: only one request may
  // advance the price from a given value. It also prevents late/early bids.
  const auctionItem = await Auction.findOneAndUpdate(
    {
      _id: id,
      startTime: { $lte: now },
      endTime: { $gte: now },
      $expr: {
        $and: [
          { $gt: [amount, "$currentBid"] },
          { $gte: [amount, "$startingBid"] },
        ],
      },
    },
    {
      $set: { currentBid: amount, highestBidder: bidder._id },
      $push: { bids: bidEntry },
    },
    { new: true, runValidators: true }
  );

  if (!auctionItem) {
    const existingAuction = await Auction.findById(id).select(
      "startTime endTime currentBid startingBid"
    );
    if (!existingAuction) return next(new ErrorHandler("Auction item not found.", 404));
    if (existingAuction.startTime > now || existingAuction.endTime < now) {
      return next(new ErrorHandler("This auction is not accepting bids.", 400));
    }
    return next(
      new ErrorHandler(
        `Your bid must be higher than the current bid of ${existingAuction.currentBid}.`,
        400
      )
    );
  }

  await Bid.findOneAndUpdate(
    { "bidder.id": bidder._id, auctionItem: auctionItem._id },
    {
      amount,
      bidder: {
        id: bidder._id,
        userName: bidder.userName,
        profileImage: bidder.profileImage?.url,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({
    success: true,
    message: "Bid placed.",
    currentBid: auctionItem.currentBid,
  });
});
