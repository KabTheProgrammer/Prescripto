import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (reference) {
      axios.get(`http://localhost:5000/api/payments/verify/${reference}`)
        .then((res) => {
          if (res.data.success) {
            setStatus("Payment Successful! ✅");
          } else {
            setStatus("Payment Failed ❌. Please try again.");
          }
        })
        .catch(() => setStatus("Error verifying payment."));
    }
  }, [reference]);

  return (
    <div className="verify-container">
      <h2>{status}</h2>
    </div>
  );
};

export default VerifyPayment;
