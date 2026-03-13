import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { email, otp } = location.state;

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword: password
      });

      alert("Password updated");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form onSubmit={handleReset} className="space-y-4">

        <h2 className="text-2xl font-bold">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button className="bg-pink-600 text-white px-4 py-2 rounded">
          Reset Password
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;