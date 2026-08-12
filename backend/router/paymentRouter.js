import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { completeMockPayment, getAdminPayments, getMyPayments, getPayment, openDispute, requestRefund, resolveAdminPayment, startCheckout } from "../controllers/paymentController.js";

const router = express.Router();
router.get("/mine", isAuthenticated, getMyPayments);
router.get("/admin/all", isAuthenticated, isAuthorized("Super Admin"), getAdminPayments);
router.post("/admin/:id/resolve", isAuthenticated, isAuthorized("Super Admin"), resolveAdminPayment);
router.post("/auction/:auctionId/checkout", isAuthenticated, isAuthorized("Bidder"), startCheckout);
router.post("/:id/mock-complete", isAuthenticated, isAuthorized("Bidder"), completeMockPayment);
router.post("/:id/refund-request", isAuthenticated, isAuthorized("Bidder"), requestRefund);
router.post("/:id/dispute", isAuthenticated, openDispute);
router.get("/:id", isAuthenticated, getPayment);
export default router;
