"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import {
  Lock,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Neural keys do not match. Please verify.");
      return;
    }

    try {
      setLoading(true);
      console.log("SENDING DATA:", {
        email,
        otp,
        password,
      });
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword: password,
        },
      );

      // Navigate to login after successful reset
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Protocol override failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-indigo-500/30 overflow-hidden flex items-center justify-center p-6 text-slate-200">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ABORT BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Abort Overwrite
        </button>

        {/* RESET CARD */}
        <div className="relative bg-[#0a0a0c]/60 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <header className="mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <ShieldAlert size={30} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">
              Rewrite{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 italic font-light">
                Access
              </span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Define new neural credentials for: <br />
              <span className="text-indigo-400">{email}</span>
            </p>
          </header>

          <form onSubmit={handleReset} className="space-y-6 relative z-10">
            {/* NEW PASSWORD */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                New Access Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors"
                    size={18}
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-14 outline-none text-white focus:border-indigo-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                  />

                  {/* 👁️ */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-400 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Verify Access Key
                </label>
                {password &&
                  confirmPassword &&
                  password === confirmPassword && (
                    <CheckCircle2
                      size={14}
                      className="text-emerald-500 animate-pulse"
                    />
                  )}
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-fuchsia-500 transition-colors"
                  size={18}
                />
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-fuchsia-500 transition-colors"
                    size={18}
                  />

                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-14 outline-none text-white focus:border-fuchsia-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                  />

                  {/* 👁️ */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-fuchsia-400 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !password || password !== confirmPassword}
              className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold flex items-center justify-center gap-3 overflow-hidden shadow-xl disabled:opacity-30 disabled:grayscale transition-all"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />

              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <span className="tracking-[0.2em] uppercase text-xs">
                    Commit Changes
                  </span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* SYSTEM FOOTER */}
        <div className="mt-8 text-center opacity-30 pointer-events-none">
          <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white">
            Security Database // Write Access Granted
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default ResetPassword;
