"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";
import {
  Code2, MessageSquare, Map, Download, ChevronDown,
  ArrowLeft, BarChart3, Target, Zap, AlertCircle,
  Lock, CheckCircle2, TrendingUp, ExternalLink, Briefcase
} from "lucide-react";

const NAV_ITEMS = [
  { id: "analysis", label: "Resume Analysis", icon: <BarChart3 size={18} /> },
  { id: "technical", label: "Technical Intelligence", icon: <Code2 size={18} /> },
  { id: "behavioral", label: "Behavioral Strategy", icon: <MessageSquare size={18} /> },
  { id: "roadmap", label: "Preparation Roadmap", icon: <Map size={18} /> },
];

// --- High-Fidelity Sub-Components ---

const ScoreRing = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ec4899";

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
        <motion.circle
          cx="64" cy="64" r={radius} stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-2xl font-black text-white">{score}%</span>
    </div>
  );
};

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${
        open ? "bg-white/[0.05] border-pink-500/40 shadow-2xl" : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-start gap-4 p-5 text-left group">
        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors ${
          open ? "bg-pink-500 border-pink-500 text-white" : "bg-white/5 border-white/10 text-gray-500 group-hover:text-white"
        }`}>
          Q{index + 1}
        </span>
        <span className="flex-1 pt-1 text-sm font-bold text-gray-300 group-hover:text-white leading-relaxed">{item.question}</span>
        <ChevronDown size={18} className={`mt-1 text-gray-600 transition-transform duration-300 ${open ? "rotate-180 text-pink-500" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-black/40">
            <div className="p-6 pt-0 space-y-6">
              <div className="h-[1px] bg-white/5 w-full mb-4" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500/80 mb-2 flex items-center gap-2">
                  <Target size={12} /> Evaluator's Intention
                </p>
                <p className="text-sm text-gray-400 italic leading-relaxed">"{item.intention}"</p>
              </div>
              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={12} /> Architected Answer
                </p>
                <p className="text-sm text-gray-200 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const RoadMapDay = ({ day, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-12 pb-12 group last:pb-0"
  >
    <div className="absolute left-[19px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/50 to-indigo-500/10 group-last:bg-none" />
    <div className="absolute left-0 top-1 w-10 h-10 rounded-xl bg-[#030014] border border-pink-500/50 flex items-center justify-center z-10 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
      <span className="text-xs font-black text-white">{day.day}</span>
    </div>

    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.05] transition-all">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">{day.focus}</h3>
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 uppercase tracking-widest border border-pink-500/20">
          Phase {day.day}
        </span>
      </div>
      <ul className="space-y-4">
        {day.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] shrink-0" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

// --- Main Interview Component ---

const Interview = () => {
  const [activeNav, setActiveNav] = useState("analysis");
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="min-h-screen bg-[#02000d] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent)] animate-pulse" />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-2 border-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-14 h-14 border-4 border-t-pink-500 border-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white font-black text-xs uppercase tracking-[0.4em] opacity-50">Decrypting Neural Assets</p>
        </div>
      </main>
    );
  }

  const score = report.matchScore ?? 0;
  const isFullReport = report.technicalQuestions && report.technicalQuestions.length > 0;

  return (
    <div className="flex h-screen bg-[#02000d] text-slate-200 overflow-hidden selection:bg-pink-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <nav className="w-72 border-r border-white/5 bg-[#030014]/80 backdrop-blur-3xl flex flex-col p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition group mb-12 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeNav === item.id
                  ? "bg-pink-500/10 text-pink-500 border border-pink-500/20 shadow-lg shadow-pink-500/5"
                  : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => interviewId && getResumePdf(interviewId)}
          className="mt-auto flex items-center justify-center gap-2 w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
        >
          <Download size={16} /> Export Intelligence
        </button>
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-12 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeNav === "analysis" && (
            <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-3 text-pink-500">
                  <Zap size={18} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Diagnostic Report</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Compatibility Analysis</h1>
              </header>

              <div className="grid md:grid-cols-12 gap-8 mb-12">
                {/* Score */}
                <div className="md:col-span-4 bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-8">JD Match Integrity</p>
                  <ScoreRing score={score} />
                </div>

                {/* Skill Gaps */}
                <div className="md:col-span-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-8">
                    <AlertCircle size={16} className="text-pink-500" />
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Skill Deficiencies</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {/* Fallback Mapping */}
                    {(report.skillGaps?.length > 0 ? report.skillGaps : 
                      report.resumeAnalysis?.recommended_jobs?.[0]?.missing_skills?.map(s => ({ skill: s }))
                    )?.map((gap, i) => (
                      <span key={i} className="px-5 py-2.5 text-xs font-bold bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl shadow-lg shadow-pink-500/5">
                        {gap.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced ML Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                  <h3 className="text-[10px] font-black uppercase mb-6 text-gray-500 tracking-widest">Identified Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis?.resume_skills?.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                  <h3 className="text-[10px] font-black uppercase mb-6 text-gray-500 tracking-widest">Career Trajectories</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis?.career_paths?.slice(0, 15).map((c, i) => (
                      <span key={i} className="px-3 py-1.5 text-[10px] font-black bg-white/5 border border-white/10 text-gray-400 rounded-full uppercase tracking-tighter">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                   <div className="flex items-center gap-2 mb-6">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">High-Fit Roles</h3>
                   </div>
                  <div className="space-y-4">
                    {report.resumeAnalysis?.recommended_jobs?.slice(0, 3).map((job, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-colors group">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">{job.role}</p>
                          <span className="text-[10px] font-black text-emerald-500">{job.match_score}%</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1">Lacks: {job.missing_skills?.slice(0, 2).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LIVE JOBS RE-ENGINEERED */}
              {report?.live_jobs?.length > 0 && (
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Briefcase size={18} className="text-indigo-500" />
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">Live Market Opportunities</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                      Real-time Feed
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {report.live_jobs.map((job, i) => (
                      <a
                        key={i}
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-6 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:border-pink-500/30 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={14} className="text-pink-500" />
                        </div>
                        <p className="text-sm font-black text-white group-hover:text-pink-400 transition-colors mb-2 pr-4">{job.title}</p>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 flex items-center gap-2 lowercase">
                            <span className="w-1 h-1 bg-indigo-500 rounded-full" /> {job.company}
                          </p>
                          <p className="text-[10px] text-gray-600 flex items-center gap-2 lowercase italic">
                            <span className="w-1 h-1 bg-gray-700 rounded-full" /> {job.location}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {activeNav === "technical" && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              {!isFullReport ? (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <Lock className="mx-auto mb-6 text-gray-700" size={40} />
                   <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Generate Full Report to unlock Intelligence</p>
                </div>
              ) : (
                report.technicalQuestions?.map((q, i) => <QuestionCard key={i} item={q} index={i} />)
              )}
            </motion.section>
          )}

          {activeNav === "behavioral" && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
               {!isFullReport ? (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                   <Lock className="mx-auto mb-6 text-gray-700" size={40} />
                   <p className="text-gray-500 text-xs font-black uppercase tracking-widest text-center">Behavioral Strategy Locked</p>
                </div>
              ) : (
                report.behavioralQuestions?.map((q, i) => <QuestionCard key={i} item={q} index={i} />)
              )}
            </motion.section>
          )}

          {activeNav === "roadmap" && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
              {report.preparationPlan?.map((day, i) => <RoadMapDay key={day.day} day={day} index={i} />)}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Interview;
