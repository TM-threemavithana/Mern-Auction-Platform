import { User } from "../models/userSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { Commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Verify Commission Cron...");
    let proof;
    // Claim one proof at a time. Only the worker that changes Approved to
    // Processing may settle it, so concurrent cron processes cannot double-pay.
    while ((proof = await PaymentProof.findOneAndUpdate(
      { status: "Approved" },
      { $set: { status: "Processing" } },
      { new: true, sort: { uploadedAt: 1 } }
    ))) {
      try {
        const user = await User.findById(proof.userId);
        if (!user) throw new Error("Auctioneer no longer exists.");

        const amount = Number(proof.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error("Payment proof has an invalid amount.");
        }

        const settledAmount = Math.min(amount, user.unpaidCommission);
        const updatedUserData = await User.findByIdAndUpdate(
          user._id,
          { $inc: { unpaidCommission: -settledAmount } },
          { new: true }
        );
        await Commission.create({
          amount: settledAmount,
          user: user._id,
          paymentProof: proof._id,
        });
        await PaymentProof.findByIdAndUpdate(proof._id, {
          status: "Settled",
          amount: settledAmount,
        });
        const settlementDate = new Date(Date.now())
          .toString()
          .substring(0, 15);

          const subject = `Your Payment Has Been Successfully Verified And Settled`;
          const message = `Dear ${user.userName},\n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\nAmount Settled: ${proof.amount}\nUnpaid Amount: ${updatedUserData.unpaidCommission}\nDate of Settlement: ${settlementDate}\n\nBest regards,\nZeeshu Auction Team`;
        sendEmail({ email: user.email, subject, message });
        console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
      } catch (error) {
        await PaymentProof.findByIdAndUpdate(proof._id, { status: "Approved" });
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`
        );
      }
    }
  });
};
