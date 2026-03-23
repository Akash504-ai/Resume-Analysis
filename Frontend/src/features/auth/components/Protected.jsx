import React from "react";
import { Navigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Loader2, ShieldCheck } from "lucide-react";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center font-sans">
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full animate-pulse" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 border-t-2 border-r-2 border-pink-500 rounded-full animate-spin" />
            <div className="flex flex-col items-center text-center">
              <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm mb-2">
                Authenticating
              </h2>
              <p className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">
                Verifying Neural Signature...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default Protected;