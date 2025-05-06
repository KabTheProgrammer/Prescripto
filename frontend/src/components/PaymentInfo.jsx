import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const PaymentInfo = ({ appointment, onPaymentSuccess }) => {
  const { backendUrl, userData, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!userData || !userData.email) {
      setMessage("User information is missing. Please log in.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await axios.post(
        `${backendUrl}/api/payments/initiate`,
        {
          email: userData.email,
          userId: userData._id,
          appointmentId: appointment._id, // Send appointmentId
          amount: appointment.amount,
        },
        {
          headers: { token },
        }
      );
  
      if (response.data && response.data.success) {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.onload = () => {
          const paystack = PaystackPop.setup({
            key: "pk_test_3cfc60101e67948b0d7311feefd6a7be38f5eaf1",
            currency: "GHS",
            email: userData.email,
            amount: appointment.amount * 100,
            reference: response.data.reference, // Use reference from backend
            callback: function (response) {
              console.log("Payment successful:", response);
              onPaymentSuccess(); // Notify parent component
            },
            onClose: function () {
              console.log("Payment popup closed");
            },
          });
  
          paystack.openIframe();
        };
        document.body.appendChild(script);
      } else {
        setMessage(response.data.message || "Payment initialization failed. Try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="payment-container">
      <h2>Make Payment</h2>
      {message && <p className="error-message">{message}</p>}
      <button onClick={handlePayment} disabled={loading} className="pay-button">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};


export default PaymentInfo;
