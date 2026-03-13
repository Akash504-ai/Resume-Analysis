import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/verify-otp", { email, otp });

      navigate("/reset-password", { state: { email, otp } });

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form onSubmit={handleVerify} className="space-y-4">

        <h2 className="text-2xl font-bold">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          Verify OTP
        </button>

      </form>

    </div>
  );
};

export default VerifyOtp;