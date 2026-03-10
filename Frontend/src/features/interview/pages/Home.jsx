"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import {
  Briefcase, User, Upload, Sparkles, FileText,
  AlertCircle, ArrowRight, Brain, Lock, X, CheckCircle2,
  Terminal, Cpu, ShieldCheck, History, ChevronRight, Activity
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.js";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleFreeAnalysis = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    if (!resumeFile && !selfDescription) {
      alert("Please upload a resume or write your profile.");
      return;
    }
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
      mode: "analysis",
    });
    if (data?._id) navigate(`/interview/${data._id}`);
  };

  const handleFullStrategy = async () => {
    if (!user?.grokApiKey) {
      navigate("/settings");
      return;
    }
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
      mode: "full",
    });
    if (data?._id) navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08),transparent)] animate-pulse" />
        <div className="relative group">
          <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full group-hover:bg-pink-500/40 transition-all duration-700" />
          <div className="relative w-32 h-32 border border-pink-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-24 h-24 border-4 border-t-pink-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
            <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mt-12 tracking-[0.4em] uppercase text-center">
          Neural <span className="text-pink-500">Syncing</span>
        </h2>
        <div className="mt-4 flex gap-1">
            {[...Array(3)].map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-pink-500 rounded-full"
                />
            ))}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <header className="max-w-7xl mx-auto pt-24 pb-20 px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 backdrop-blur-md">
            <Activity size={12} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tactical Interface v3.0</span>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-4">
              COMMAND <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-pink-500 to-indigo-500">
                CENTER.
              </span>
            </h1>
            <p className="text-gray-500 max-w-xl text-sm font-medium tracking-tight">
                Upload your professional matrix and target description. Our neural engine will decrypt the optimal strategy for success.
            </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. Job Description Card */}
          <div className="group bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-1 hover:border-white/10 transition-all duration-500 shadow-2xl">
            <div className="bg-[#030014]/40 rounded-[2.3rem] p-8 backdrop-blur-3xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500">Step 01</h3>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">Target Parameters</p>
                        </div>
                    </div>
                </div>
                <textarea
                    className="w-full h-72 bg-black/40 border border-white/5 rounded-3xl p-8 text-sm text-gray-300 focus:border-pink-500/40 outline-none transition-all resize-none placeholder:text-gray-800 font-mono shadow-inner"
                    placeholder="PASTE JOB DESCRIPTION OR SPECIFICATIONS HERE..."
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>
          </div>

          {/* 2. Upload & Profile Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            <div 
              onClick={() => resumeInputRef.current.click()}
              className={`group relative min-h-[280px] bg-white/[0.03] border-2 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ${
                fileName ? "border-emerald-500/40 bg-emerald-500/[0.05]" : "border-white/5 hover:border-pink-500/40 hover:bg-white/[0.05]"
              }`}
            >
              <input type="file" ref={resumeInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-6 ${
                fileName ? "bg-emerald-500/20 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "bg-white/5 text-gray-500 group-hover:text-pink-500 group-hover:bg-pink-500/10"
              }`}>
                {fileName ? <ShieldCheck size={40} /> : <Upload size={40} />}
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    {fileName ? fileName : "Inject Resume"}
                </p>
                <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">PDF / DOCX Format Supported</p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.05] transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                    <User size={20} />
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Step 02</h3>
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Bio-Context</p>
                </div>
              </div>
              <textarea
                className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 text-xs text-gray-400 outline-none focus:border-indigo-500/40 resize-none transition-all"
                placeholder="Briefly describe your unique professional edge or current career goals..."
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-gradient-to-r from-white/[0.04] to-transparent border border-white/10 rounded-[3rem] gap-8 shadow-2xl">
            <div className="flex flex-col gap-2">
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Execute Protocol</h4>
                {!user?.grokApiKey && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                     <Lock size={10} className="text-amber-500" />
                     <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/80">API Authorization Required for Full Mode</span>
                  </div>
                )}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={handleFreeAnalysis}
                className="flex-1 md:flex-none px-12 py-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 text-gray-300 hover:text-white"
              >
                Scan Matrix
              </button>
              <button
                onClick={handleFullStrategy}
                disabled={!user?.grokApiKey}
                className={`flex-1 md:flex-none px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 active:scale-95 ${
                  user?.grokApiKey 
                    ? "bg-white text-black hover:bg-pink-600 hover:text-white shadow-[0_0_30px_rgba(219,39,119,0.3)]" 
                    : "bg-white/5 text-gray-800 cursor-not-allowed border border-white/5"
                }`}
              >
                <Sparkles size={16} className={user?.grokApiKey ? "animate-pulse" : ""} />
                Initialize Full Strategy
              </button>
            </div>
          </div>
        </div>

        {/* RECENT LOGS SIDEBAR */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <History size={16} className="text-pink-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Archives</h2>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </div>

          <div className="space-y-4">
            <AnimatePresence>
            {reports.slice(0, 6).map((report, i) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/interview/${report._id}`)}
                className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-pink-500/40 hover:bg-white/[0.05] cursor-pointer transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-3xl -z-10 group-hover:bg-pink-500/10 transition-colors" />
                
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-black text-gray-200 group-hover:text-pink-400 transition-colors truncate max-w-[180px] uppercase tracking-tighter">
                    {report.title || "Standard Scan"}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-[11px] font-black text-white">{report.matchScore}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md group-hover:text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-pink-500 transition-all duration-500">
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>

            {reports.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                <FileText size={40} className="mx-auto text-gray-900 mb-4 opacity-20" />
                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">No Data Cached</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            View All Intelligence
          </button>
        </aside>
      </main>
    </div>
  );
};

export default Home;