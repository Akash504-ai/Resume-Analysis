import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { AlertTriangle, Home, ChevronLeft, ZapOff } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#02000d] flex items-center justify-center overflow-hidden relative font-sans">
      
      {/* --- BACKGROUND DISTORTION --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/5 blur-[120px] rounded-full animate-pulse" />
        {/* Scanning Line Effect */}
        <motion.div 
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent z-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* --- GLITCHING ICON --- */}
        <motion.div
          animate={{ 
            x: [0, -2, 2, 0],
            opacity: [1, 0.8, 0.9, 1]
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
             <ZapOff size={40} className="text-pink-500 group-hover:scale-110 transition-transform" />
             {/* Animated Glitch Layers */}
             <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay animate-pulse" />
          </div>
          <motion.div 
             className="absolute -top-2 -right-2"
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", delay: 0.5 }}
          >
             <AlertTriangle className="text-amber-500" size={24} />
          </motion.div>
        </motion.div>

        {/* --- TEXT CONTENT --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-[12rem] font-black text-white leading-none tracking-tighter opacity-10 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]">
            404
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Signal <span className="text-pink-500">Lost</span>
          </h2>
          
          <p className="text-gray-500 max-w-sm mx-auto font-medium mb-12 text-sm md:text-base leading-relaxed">
            The neural node you are looking for does not exist or has been de-indexed from the Nexus.
          </p>
        </motion.div>

        {/* --- ACTIONS --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Previous Node
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 px-8 py-4 bg-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-500 transition-all shadow-lg shadow-pink-600/20"
          >
            <Home size={16} />
            Return to Base
          </button>
        </motion.div>

        {/* --- SYSTEM STATS (DECORATIVE) --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex gap-8 text-[10px] font-black text-gray-700 uppercase tracking-widest"
        >
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">Error Code</span>
            <span>0x404_NULL_REF</span>
          </div>
          <div className="h-8 w-[1px] bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="text-gray-500 mb-1">Status</span>
            <span className="text-pink-900">Disconnected</span>
          </div>
        </motion.div>

      </div>

      {/* --- NOISE OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50 contrast-150" />
    </div>
  );
}