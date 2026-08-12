import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

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
        const commissionAmount = await calculateCommission(auction._id);
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
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nContact the auctioneer at ${auctioneer.email} to arrange payment.\n\nPayment details:\n\n1. Bank transfer\n- Account name: ${auctioneer.paymentMethods.bankTransfer?.bankAccountName || "Not provided"}\n- Account number: ${auctioneer.paymentMethods.bankTransfer?.bankAccountNumber || "Not provided"}\n- Bank: ${auctioneer.paymentMethods.bankTransfer?.bankName || "Not provided"}\n\n2. Frimi\n- Account number: ${auctioneer.paymentMethods.frimi?.frimiAccountNumber || "Not provided"}\n\n3. PayPal\n- Email: ${auctioneer.paymentMethods.paypal?.paypalEmail || "Not provided"}\n\nThank you for participating in BidSpirit.`;
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
