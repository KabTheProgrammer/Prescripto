import axios from 'axios';
import dotenv from 'dotenv';
import appointmentModel from '../models/AppointmentModel.js';

dotenv.config();

export const initiatePayment = async (req, res) => {
    try {
      const { email, userId, appointmentId, amount } = req.body;
  
      if (!email || !userId || !appointmentId || !amount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      console.log("🔹 Initializing payment for:", email);
  
      const paystackResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100, // Convert to kobo (Paystack requires this)
          currency: "GHS",
          callback_url: `${process.env.FRONTEND_URL}/verify-payment`,
          metadata: {
            appointmentId, // ✅ Pass appointmentId in metadata
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("✅ Paystack Response:", paystackResponse.data);
  
      res.status(200).json({
        success: true,
        authorizationUrl: paystackResponse.data.data.authorization_url,
        reference: paystackResponse.data.data.reference, // ✅ Include reference
      });
    } catch (error) {
      console.error("❌ Payment Initialization Error:", error.response?.data || error.message);
  
      res.status(500).json({
        success: false,
        message: "Payment initialization failed",
        error: error.response?.data || error.message,
      });
    }
  };
  
  // ✅ VERIFY PAYMENT
  export const verifyPayment = async (req, res) => {
    const { reference } = req.params;

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        console.log("🔹 Paystack Response:", response.data);

        if (response.data.data.status === "success") {
            const appointmentId = response.data.data.metadata.appointmentId;

            if (!appointmentId) {
                console.error("❌ appointmentId is missing in metadata");
                return res.status(400).json({ success: false, message: "Appointment ID missing in metadata" });
            }

            console.log("🔹 Looking for appointment:", appointmentId);

            // Ensure ObjectId format
            const mongoose = (await import('mongoose')).default;
            const objectId = new mongoose.Types.ObjectId(appointmentId);

            const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                objectId, // 🔹 Use ObjectId
                { payment: true },
                { new: true }
            );

            if (!updatedAppointment) {
                console.error("❌ Appointment not found for ID:", appointmentId);
                return res.status(404).json({ success: false, message: "Appointment not found" });
            }

            console.log("✅ Payment Updated:", updatedAppointment);

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                appointment: updatedAppointment,
            });
        } else {
            console.error("❌ Payment verification failed:", response.data.data.gateway_response);
            return res.status(400).json({ 
                success: false, 
                message: "Payment verification failed", 
                reason: response.data.data.gateway_response 
            });
        }
    } catch (error) {
        console.error("❌ Error in verifyPayment:", error.message);
        return res.status(500).json({ success: false, message: "Verification error" });
    }
};


  
 