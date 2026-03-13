import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // if user refreshes page and email is lost
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp,
      });

      navigate("/reset-password", { state: { email, otp } });

    } catch (err) {
      alert(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleVerify}
        className="space-y-6 bg-white p-8 rounded-xl w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-3 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-4 py-3 rounded w-full"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;