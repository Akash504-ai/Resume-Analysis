"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import {
  Briefcase, User, Upload, Sparkles, FileText,
  AlertCircle, ArrowRight, Brain, Lock, X, CheckCircle2,
  Terminal, Cpu, ShieldCheck, History, ChevronRight
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent)] animate-pulse" />
        <div className="relative">
          <div className="w-24 h-24 border-2 border-pink-500/20 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-pink-500 border-transparent rounded-full animate-spin" />
          </div>
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500" size={24} />
        </div>
        <h2 className="text-xl font-black text-white mt-8 tracking-[0.3em] uppercase">Neural Analysis</h2>
        <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-widest font-black">Decrypting Professional Vectors...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#02000d] text-slate-200 pb-32">
      {/* Dynamic Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="max-w-7xl mx-auto pt-20 pb-16 px-6 text-center lg:text-left">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center lg:justify-start gap-3 mb-6">
          <Terminal size={16} className="text-pink-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500/80">Strategy Engine v3.0</span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
          RESUME <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            INTELLIGENCE
          </span>
        </motion.h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Job Description Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-500">
                  <Briefcase size={16} />
               </div>
               <h3 className="text-xs font-black uppercase tracking-widest text-white/70">Target Opportunity</h3>
            </div>
            <textarea
              className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:border-pink-500/50 outline-none transition-all resize-none placeholder:text-gray-800 font-mono"
              placeholder="PASTE JOB DESCRIPTION DATA..."
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* 2. Upload & Profile Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              onClick={() => resumeInputRef.current.click()}
              className={`group relative h-full min-h-[220px] bg-white/[0.02] border-2 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                fileName ? "border-emerald-500/40 bg-emerald-500/[0.02]" : "border-white/5 hover:border-pink-500/40 hover:bg-white/[0.04]"
              }`}
            >
              <input type="file" ref={resumeInputRef} className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                fileName ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-500 group-hover:text-pink-500"
              }`}>
                {fileName ? <ShieldCheck size={24} /> : <Upload size={24} />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-center">
                {fileName ? fileName : "Upload Resume (PDF)"}
              </p>
              <p className="text-[8px] text-gray-600 mt-2 font-bold uppercase tracking-widest">Select file to parse</p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                    <User size={16} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/70">Bio-Context</h3>
              </div>
              <textarea
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-gray-400 outline-none focus:border-indigo-500/50 resize-none"
                placeholder="Optional: Summarize your professional essence..."
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] gap-6">
            <div className="flex items-center gap-4">
               {!user?.grokApiKey && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-amber-500">Full Mode Locked</span>
                 </div>
               )}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={handleFreeAnalysis}
                className="flex-1 md:flex-none px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                Base Analysis
              </button>
              <button
                onClick={handleFullStrategy}
                disabled={!user?.grokApiKey}
                className={`flex-1 md:flex-none px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  user?.grokApiKey 
                    ? "bg-white text-black hover:bg-pink-500 hover:text-white shadow-xl shadow-pink-500/20" 
                    : "bg-white/5 text-gray-700 cursor-not-allowed border border-white/5"
                }`}
              >
                <Sparkles size={14} />
                Full Strategy
              </button>
            </div>
          </div>
        </div>

        {/* RECENT LOGS SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <History size={14} className="text-gray-600" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Recent Neural Logs</h2>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 5).map((report, i) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/interview/${report._id}`)}
                className="group p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-pink-500/30 hover:bg-white/[0.04] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors truncate max-w-[150px]">
                    {report.title || "Untitled Strategy"}
                  </p>
                  <span className="text-[10px] font-black text-pink-500">{report.matchScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <ChevronRight size={12} className="text-gray-800 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}

            {reports.length === 0 && (
              <div className="py-12 text-center border border-white/5 rounded-[2rem] border-dashed">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.4em]">Empty Log Space</p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Home;