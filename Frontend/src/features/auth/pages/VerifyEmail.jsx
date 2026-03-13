import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp
      });

      alert("Email verified successfully");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verify Email</h2>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button>Verify</button>
    </form>
  );
};

export default VerifyEmail;