"use client";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, KeyRound, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      // Using a custom delay to let the animation breathe
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-pink-500/30 overflow-hidden flex items-center justify-center p-6">
      
      {/* --- ATMOSPHERIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        {/* AUTH CARD */}
        <div className="relative bg-[#0a0a0c]/60 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Internal Glow Decor */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-pink-600/10 blur-[50px] rounded-full" />

          <header className="relative z-10 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(219,39,119,0.3)]">
              <KeyRound size={30} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              Recover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400 italic font-light">Key</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Enter your neural address to receive a one-time <span className="text-pink-500 font-bold">access bypass</span>.
            </p>
          </header>

          <form onSubmit={handleSendOtp} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Neural Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none text-white focus:border-pink-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-extrabold flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <span className="tracking-widest uppercase text-sm">Send Bypass OTP</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* STATUS FOOTER */}
          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Protocol v3.0</span>
            </div>
          </div>
        </div>

        {/* HELPER LINK */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs font-medium">
            Remembered your credentials?{" "}
            <Link to="/login" className="text-pink-500 hover:text-pink-400 transition-colors underline-offset-4 hover:underline">
              Resume Login
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default ForgotPassword;