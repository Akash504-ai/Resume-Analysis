"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-pink-500/30 overflow-hidden flex items-center justify-center p-6">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
      </div>

      <motion.main 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        
        {/* LEFT SIDE: BRANDING */}
        <div className="flex flex-col items-start space-y-6">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-[0_0_40px_rgba(219,39,119,0.4)]"
          >
            <Zap size={40} className="text-white fill-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter text-white leading-none">
              Join <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-400">
                Nexus
              </span>
            </h1>
            <p className="text-gray-400 text-lg font-light max-w-[280px] leading-relaxed">
              Initialize your <span className="text-gray-200">neural credentials</span> and enter the protocol.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH CARD */}
        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          className="relative bg-[#0a0a0c]/60 border border-white/5 rounded-[3.5rem] p-10 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-md mx-auto"
        >
          {/* Internal Glow */}
          <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            {/* INPUT GROUPS */}
            {[
              { label: "Identity", icon: User, type: "text", placeholder: "Enter username", val: username, set: setUsername },
              { label: "Neural Address", icon: Mail, type: "email", placeholder: "Enter email", val: email, set: setEmail },
              { label: "Access Key", icon: Lock, type: "password", placeholder: "••••••••", val: password, set: setPassword }
            ].map((field, idx) => (
              <div key={idx} className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  {field.label}
                </label>
                <div className="relative group">
                  <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <input
                    required
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.val}
                    onChange={(e) => field.set(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none text-white focus:border-pink-500/50 focus:bg-black/80 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>
            ))}

            {/* ACTION BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-extrabold flex items-center justify-center gap-3 overflow-hidden shadow-xl"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest">REGISTER</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* LOGIN FOOTER */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already authenticated?{" "}
              <Link to="/login" className="text-pink-500 hover:text-pink-400 transition ml-1 underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* SYSTEM VERSION STAMP */}
          <div className="absolute -bottom-12 left-0 right-0 text-center opacity-20 pointer-events-none">
            <p className="text-[9px] font-black tracking-[0.8em] uppercase text-white">
              System Protocol v3.0 // Ready
            </p>
          </div>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Register;