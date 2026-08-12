import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { createAuctionPayment } from "../controllers/paymentController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");
    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
    });
    for (const auction of endedAuctions) {
      try {
        auction.commissionCalculated = true;
        const auctioneer = await User.findById(auction.createdBy);
        if (auction.highestBidder) {
          await auction.save();
          const bidder = await User.findById(auction.highestBidder);
          if (!bidder || !auctioneer) {
            throw new Error("Auction participants could not be found.");
          }
          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: auction.currentBid,
                auctionsWon: 1,
              },
            },
            { new: true }
          );
          await createAuctionPayment(auction);
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.userName}, \n\nCongratulations! You won the auction for ${auction.title}. Please sign in to BidSpirit and open My Payments to complete checkout.\n\nThank you for participating in BidSpirit.`;
          console.log("SENDING EMAIL TO HIGHEST BIDDER");
          sendEmail({ email: bidder.email, subject, message });
          console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
        } else {
          await auction.save();
        }
      } catch (error) {
        console.error("Unable to settle ended auction", auction._id, error);
      }
    }
  });
};
