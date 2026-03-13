"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, ArrowRight, Loader2, RefreshCcw, ArrowLeft, Fingerprint } from "lucide-react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 proper boxes
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return;

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp: finalOtp,
      });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Sequence Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-pink-500/30 overflow-hidden flex items-center justify-center p-6 text-slate-200">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <button 
          onClick={() => navigate("/register")}
          className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Registration
        </button>

        <div className="relative bg-[#0a0a0c]/60 border border-white/5 rounded-[3.5rem] p-10 md:p-14 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          
          <header className="mb-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(219,39,119,0.3)] relative">
              <MailCheck size={36} className="text-white relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-pink-500 rounded-3xl blur-xl" 
              />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-3 uppercase">
              Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400 italic font-light">Identity</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Sequencing token sent to: <br />
              <span className="text-white mt-1 inline-block">{email}</span>
            </p>
          </header>

          <form onSubmit={handleVerify} className="space-y-12">
            {/* --- 6 BOXES GRID --- */}
            <div className="grid grid-cols-6 gap-2 md:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  ref={inputRefs[index]}
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full aspect-[3/4] bg-black/40 border border-white/10 rounded-xl md:rounded-2xl text-center text-2xl md:text-3xl font-black text-pink-500 outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all shadow-inner"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || otp.some(v => v === "")}
              className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-extrabold flex items-center justify-center gap-3 overflow-hidden shadow-xl disabled:opacity-20 disabled:grayscale transition-all"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              {loading ? (
                <Loader2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <span className="tracking-[0.2em] uppercase text-xs">Initialize Session</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-gray-600">
                <Fingerprint size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Link Status: Awaiting Data</span>
             </div>
            <button 
              type="button"
              className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-pink-500 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={10} />
              Re-send Sequence
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default VerifyEmail;