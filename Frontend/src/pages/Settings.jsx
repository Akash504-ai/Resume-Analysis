"use client";

import React, { useState } from "react";
import { saveGrokApiKey } from "../services/settingsApi";
import Sidebar from "../layouts/sidebar.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { motion } from "framer-motion";
import { 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Zap,
  ArrowRight
} from "lucide-react";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await saveGrokApiKey(apiKey);
      await refreshUser();
      setMessage(res.message || "API key saved successfully.");
      setApiKey("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save API key.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Access Developer Portal",
      desc: "Head over to the Groq Cloud Console.",
      link: "https://console.groq.com/",
      icon: <ExternalLink size={18} />,
    },
    {
      title: "Authentication",
      desc: "Sign in or create your developer account.",
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "API Management",
      desc: "Navigate to the 'API Keys' sidebar menu.",
      icon: <Key size={18} />,
    },
    {
      title: "Generate Signature",
      desc: "Click 'Create API Key' and copy the unique string.",
      icon: <Zap size={18} />,
    },
    {
      title: "Initialize Nexus",
      desc: "Paste the key above to activate neural features.",
      icon: <CheckCircle2 size={18} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#030014] text-slate-200 overflow-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar />

      <main className="flex-1 ml-[80px] md:ml-[260px] p-6 md:p-12 relative z-10 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* HEADER */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
              SYSTEM <span className="text-pink-500">SETTINGS</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">
              Protocol Configuration & API Management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* API KEY CARD (Left side - Span 3) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-500">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Neural Integration</h2>
                    <p className="text-sm text-gray-500">Configure Groq AI core</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Unlock advanced interview analysis and roadmap generation by bridging your Groq API key.
                  </p>

                  <div className="relative group/input">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-pink-500 transition-colors" size={18} />
                    <input
                      type="password"
                      placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-pink-500/50 transition-all placeholder:text-gray-700"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 rounded-xl font-bold text-white shadow-[0_0_30px_rgba(219,39,119,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        SAVE CONFIGURATION
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  {message && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className={`text-center text-xs font-bold uppercase tracking-widest ${message.includes("success") ? "text-emerald-400" : "text-pink-400"}`}
                    >
                      {message}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* ROADMAP SECTION (Right side - Span 2) */}
            <div className="lg:col-span-2">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 h-full">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  Setup Roadmap
                </h3>

                <div className="relative space-y-8">
                  {/* Vertical Line */}
                  <div className="absolute left-[17px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-pink-500/50 via-indigo-500/20 to-transparent" />

                  {steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-6 group">
                      <div className="relative z-10 w-9 h-9 rounded-full bg-[#030014] border border-white/10 flex items-center justify-center text-pink-500 group-hover:border-pink-500/50 group-hover:shadow-[0_0_15px_rgba(219,39,119,0.2)] transition-all">
                        {step.icon}
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                          {step.link ? (
                            <a href={step.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                              {step.title} <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            step.title
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;