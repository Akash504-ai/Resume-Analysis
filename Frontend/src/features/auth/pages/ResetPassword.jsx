import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  // redirect if email/otp missing
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      alert("Password updated successfully");
      navigate("/login");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleReset}
        className="space-y-6 bg-white p-8 rounded-xl w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-4 py-3 rounded w-full"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;