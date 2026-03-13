"use client";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/forgot-password", { email });

      alert("OTP sent to your email");
      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSendOtp} className="space-y-4">

        <h2 className="text-2xl font-bold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          Send OTP
        </button>

      </form>
    </div>
  );
};

export default ForgotPassword;