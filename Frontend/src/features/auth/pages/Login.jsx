"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/dashboard"); // Or wherever your protected route is
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-indigo-500/30 overflow-hidden flex items-center justify-center p-6">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        
        {/* LEFT SIDE: BRANDING */}
        <div className="flex flex-col items-start space-y-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            <Zap size={40} className="text-white fill-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white leading-none">
              Welcome <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
                Back
              </span>
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-[280px] leading-relaxed">
              Verify your <span className="text-gray-200">neural signature</span> to continue.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH CARD */}
        <motion.div
          className="relative bg-[#0a0a0c]/60 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            <div className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  Neural Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none text-white focus:border-indigo-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Access Key
                  </label>
                  <Link to="/forgot" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest transition">
                    Lost Key?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none text-white focus:border-indigo-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest uppercase">Authenticate</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              New to the Nexus?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition ml-1 underline-offset-4 hover:underline">
                Create Identity
              </Link>
            </p>
          </div>

          <div className="absolute -bottom-12 left-0 right-0 text-center opacity-20 pointer-events-none">
            <p className="text-[9px] font-black tracking-[0.8em] uppercase text-white">
              Nexus Auth Core // v3.0
            </p>
          </div>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Login;