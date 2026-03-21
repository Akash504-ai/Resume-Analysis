"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-32 relative overflow-hidden">
      {/* Background Ambient Glow - Very subtle depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="relative p-12 md:p-24 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 backdrop-blur-sm overflow-hidden text-center">
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 animate-fade-in">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Elevate Your Career</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
            Ready to Master Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500">
              Next Interview?
            </span>
          </h2>

          {/* Descriptive Text */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Join a community of high-performing developers using Nexus AI 
            to turn applications into offers with data-driven interview prep.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate("/register")}
              className="group relative flex items-center gap-3 px-12 py-5 rounded-2xl bg-white text-black font-bold text-xl transition-all duration-300 hover:bg-gray-200 hover:-translate-y-1 active:scale-95 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.15)]"
            >
              Start Analysis
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => navigate("/features")}
              className="group flex items-center gap-2 px-10 py-5 rounded-2xl bg-transparent text-white font-bold text-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              Explore Features
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-gray-500">
              <ShieldCheck size={18} className="text-emerald-500/50" />
              <span className="text-sm font-medium">Privacy Focused</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Zap size={18} className="text-yellow-500/50" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-gray-800" />
                ))}
              </div>
              <span className="text-sm font-medium">1,200+ Members</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}