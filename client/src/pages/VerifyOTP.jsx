import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>Verify Email</h1>
        <p>Enter the OTP sent to your email.</p>
      </div>

      <div className="card">
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
