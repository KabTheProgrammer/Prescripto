import express from "express";
import { initiatePayment, verifyPayment } from "../controllers/paymentController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Initiate payment
router.post("/initiate", authUser, initiatePayment);

// Verify payment
router.get("/verify/:reference", authUser, verifyPayment);
 
export default router;
