"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";
import {
  Code2, MessageSquare, Map, Download, ChevronDown,
  ArrowLeft, BarChart3, Target, CheckCircle2, 
  AlertCircle, Lock, TrendingUp, ExternalLink, 
  Briefcase, Activity, ShieldCheck, Menu, X
} from "lucide-react";

const NAV_ITEMS = [
  { id: "analysis", label: "Neural", icon: <BarChart3 size={18} /> },
  { id: "technical", label: "Technical", icon: <Code2 size={18} /> },
  { id: "behavioral", label: "Behavioral", icon: <MessageSquare size={18} /> },
  { id: "roadmap", label: "Roadmap", icon: <Map size={18} /> },
];

// --- High-Fidelity Sub-Components ---

const ScoreRing = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ec4899";

  return (
    <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
      <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-2xl" />
      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
        <motion.circle
          cx="80" cy="80" r={radius} stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "circOut" }}
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">{score}%</span>
        <span className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest text-center">Match</span>
      </div>
    </div>
  );
};

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`mb-4 md:mb-6 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 ${
        open ? "bg-white/[0.06] border-pink-500/40 shadow-2xl" : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 md:gap-6 p-4 md:p-6 text-left group">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-[10px] font-black border transition-all duration-500 shrink-0 ${
          open ? "bg-pink-500 border-pink-500 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]" : "bg-white/5 border-white/10 text-gray-500 group-hover:text-white"
        }`}>
          {index + 1}
        </div>
        <span className="flex-1 text-xs md:text-sm font-bold text-gray-300 group-hover:text-white leading-relaxed">{item.question}</span>
        <div className={`p-1.5 md:p-2 rounded-full transition-all ${open ? "rotate-180 bg-pink-500/20 text-pink-500" : "bg-white/5 text-gray-600"}`}>
            <ChevronDown size={16} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="p-4 md:p-8 pt-0 space-y-4 md:space-y-6">
              <div className="h-[1px] bg-gradient-to-r from-pink-500/50 to-transparent w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-black/20 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-pink-500 mb-2 flex items-center gap-2">
                    <Target size={12} /> Strategic Intent
                    </p>
                    <p className="text-[11px] md:text-xs text-gray-400 italic leading-relaxed">"{item.intention}"</p>
                </div>
                <div className="bg-emerald-500/[0.03] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-500/10">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={12} /> Predicted Response
                    </p>
                    <p className="text-[11px] md:text-xs text-gray-200 leading-relaxed">{item.answer}</p>
                </div>
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-12 md:pl-20 pb-10 md:pb-16 group last:pb-0"
  >
    <div className="absolute left-[19px] md:left-[31px] top-4 bottom-0 w-[1px] bg-gradient-to-b from-pink-500/50 via-indigo-500/20 to-transparent group-last:hidden" />
    <div className="absolute left-0 top-0 w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#02000d] border border-white/10 flex items-center justify-center z-10 shadow-xl group-hover:border-pink-500/50 transition-all duration-500">
      <div className="text-center">
        <span className="block text-[6px] md:text-[8px] font-black text-pink-500 uppercase tracking-tighter">Phase</span>
        <span className="text-sm md:text-xl font-black text-white">{day.day}</span>
      </div>
    </div>

    <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 backdrop-blur-3xl hover:bg-white/[0.05] transition-all group-hover:translate-x-1">
      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
        <h3 className="text-sm md:text-xl font-black text-white tracking-tight uppercase italic">{day.focus}</h3>
        <div className="h-[1px] flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {day.tasks.map((task, i) => (
          <div key={i} className="flex items-start gap-3 p-3 md:p-4 bg-black/20 rounded-xl md:rounded-2xl border border-white/5 group/task">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)] shrink-0" />
            <span className="text-[10px] md:text-xs text-gray-400 group-hover/task:text-gray-200 transition-colors leading-relaxed">{task}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Interview = () => {
  const [activeNav, setActiveNav] = useState("analysis");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  const handleNavClick = (id) => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  if (loading || !report) {
    return (
      <main className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08),transparent)] animate-pulse" />
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 border border-pink-500/20 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-pink-500 border-transparent rounded-full animate-spin" />
          </div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500" size={20} />
        </div>
        <p className="text-white font-black text-[8px] md:text-[10px] mt-8 uppercase tracking-[0.5em] animate-pulse text-center">Decrypting Matrix...</p>
      </main>
    );
  }

  const score = report.matchScore ?? 0;
  const isFullReport = report.technicalQuestions && report.technicalQuestions.length > 0;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#02000d] text-slate-200 overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl z-50">
        <button onClick={() => navigate("/dashboard")} className="p-2 text-gray-400">
          <ArrowLeft size={20} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">Nexus Analysis</span>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-white bg-white/5 rounded-lg">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed inset-0 lg:relative lg:inset-auto z-40
        w-full lg:w-80 border-r border-white/5 bg-[#030014] lg:bg-[#030014]/60 backdrop-blur-3xl 
        flex flex-col p-6 lg:p-10
        transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <button
          onClick={() => navigate("/dashboard")}
          className="hidden lg:flex items-center gap-3 text-gray-500 hover:text-white transition-all group mb-16 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Terminal
        </button>

        <div className="space-y-2 lg:space-y-3 flex-1 mt-16 lg:mt-0">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full group relative flex items-center gap-4 px-6 py-4 lg:py-5 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                activeNav === item.id
                  ? "bg-white/[0.05] text-white shadow-2xl border border-white/10"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
            >
              {activeNav === item.id && (
                  <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-6 bg-pink-500 rounded-r-full shadow-[0_0_15px_rgba(219,39,119,1)]" />
              )}
              <span className={activeNav === item.id ? "text-pink-500" : "group-hover:text-pink-400 transition-colors"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (interviewId) getResumePdf(interviewId);
            setSidebarOpen(false);
          }}
          className="mt-8 lg:mt-auto flex items-center justify-center gap-3 w-full py-4 lg:py-5 bg-white text-black rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-2xl"
        >
          <Download size={18} /> Export Intel
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeNav === "analysis" && (
            <motion.section 
                key="analysis"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto"
            >
              <header className="mb-10 lg:mb-16">
                <div className="flex items-center gap-3 mb-4 text-pink-500">
                  <Activity size={16} />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">System Diagnostic</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight lg:leading-[0.85] uppercase">
                    NEURAL <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500 italic font-light">ALIGNMENT.</span>
                </h1>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 mb-8 md:mb-12">
                <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-8 opacity-40">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Integrity Check</p>
                  </div>
                  <ScoreRing score={score} />
                </div>

                <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-500">
                        <AlertCircle size={16} />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Skill Deficiencies</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {(report.skillGaps?.length > 0 ? report.skillGaps : 
                      report.resumeAnalysis?.recommended_jobs?.[0]?.missing_skills?.map(s => ({ skill: s }))
                    )?.map((gap, i) => (
                      <span key={i} className="px-4 py-2 md:px-6 md:py-3 text-[8px] md:text-[10px] font-black bg-pink-500/5 border border-pink-500/10 text-pink-500/80 rounded-xl md:rounded-2xl uppercase tracking-widest">
                        {gap.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-8 md:mb-12">
                <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10">
                  <h3 className="text-[9px] font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Neural Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis?.resume_skills?.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 text-[8px] md:text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10">
                  <h3 className="text-[9px] font-black uppercase mb-6 text-gray-500 tracking-[0.2em]">Career Vectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis?.career_paths?.slice(0, 10).map((c, i) => (
                      <span key={i} className="px-2.5 py-1 text-[8px] font-black bg-white/5 border border-white/10 text-gray-400 rounded-full uppercase">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 md:col-span-2 lg:col-span-1">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">High-Fit Nodes</h3>
                      <TrendingUp size={14} className="text-emerald-500" />
                   </div>
                  <div className="space-y-3">
                    {report.resumeAnalysis?.recommended_jobs?.slice(0, 3).map((job, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/20">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] font-bold text-white uppercase">{job.role}</p>
                          <span className="text-[10px] font-black text-emerald-500">{job.match_score}%</span>
                        </div>
                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest line-clamp-1">Gap: {job.missing_skills?.slice(0, 1).join(", ")}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Market Section */}
              {report?.live_jobs?.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 mt-8 md:mt-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h3 className="text-[10px] md:text-[11px] font-black uppercase text-white tracking-[0.3em] md:tracking-[0.4em]">Live Opportunities</h3>
                        <p className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">Real-time market injection</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {report.live_jobs.map((job, i) => (
                      <a key={i} href={job.apply_link} target="_blank" rel="noopener noreferrer" className="group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 bg-[#02000d] hover:border-pink-500/30 hover:bg-white/[0.03] transition-all duration-500">
                        <div className="absolute top-6 right-6 md:top-8 md:right-8 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                          <ExternalLink size={14} className="text-pink-500" />
                        </div>
                        <p className="text-xs md:text-sm font-black text-white group-hover:text-pink-400 transition-colors mb-4 pr-8 leading-tight uppercase tracking-tight">{job.title}</p>
                        <div className="space-y-2 pt-4 border-t border-white/5">
                          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">{job.company}</p>
                          <p className="text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-widest">{job.location}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {activeNav === "technical" && (
            <motion.section key="technical" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
              {!isFullReport ? (
                <div className="py-20 md:py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3.5rem] px-6">
                   <Lock className="mx-auto mb-6 text-gray-800" size={32} />
                   <h2 className="text-sm md:text-xl font-black text-white uppercase tracking-[0.3em] mb-2">Encryption Active</h2>
                   <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">Generate report to unlock tactical intel.</p>
                </div>
              ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-8 md:mb-12">
                        <span className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.4em]">Technical Protocol</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>
                    {report.technicalQuestions?.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                </div>
              )}
            </motion.section>
          )}

          {activeNav === "behavioral" && (
            <motion.section key="behavioral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
                {!isFullReport ? (
                    <div className="py-20 md:py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[2rem] md:rounded-[3.5rem] px-6">
                        <Lock className="mx-auto mb-6 text-gray-800" size={32} />
                        <p className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center">Behavioral Matrix Locked</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-8 md:mb-12">
                            <span className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-[0.4em]">Psychological Vectors</span>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        {report.behavioralQuestions?.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                    </div>
                )}
            </motion.section>
          )}

          {activeNav === "roadmap" && (
            <motion.section key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-4 md:py-10">
              <header className="mb-12 md:mb-20 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Timeline</h2>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-8 md:w-12 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(219,39,119,1)]" />
                    <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">Execution Path</p>
                    <div className="h-1 w-8 md:w-12 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]" />
                </div>
              </header>
              <div className="relative">
                {report.preparationPlan?.map((day, i) => <RoadMapDay key={day.day} day={day} index={i} />)}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] lg:w-[50%] h-[50%] bg-pink-500/5 blur-[80px] lg:blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[70%] lg:w-[50%] h-[50%] bg-indigo-500/5 blur-[80px] lg:blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

export default Interview;