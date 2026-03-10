"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate, useParams } from "react-router";
import {
  Code2,
  MessageSquare,
  Map,
  Download,
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  Cpu,
  Layers,
  History,
  Activity,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "analysis", label: "Resume Analysis", icon: <BarChart3 size={18} /> },
  {
    id: "technical",
    label: "Technical Intelligence",
    icon: <Code2 size={18} />,
  },
  {
    id: "behavioral",
    label: "Behavioral Strategy",
    icon: <MessageSquare size={18} />,
  },
  { id: "roadmap", label: "Preparation Roadmap", icon: <Map size={18} /> },
];

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group mb-4 rounded-2xl border transition-all duration-300 ${
        open
          ? "bg-white/[0.04] border-pink-500/30 shadow-lg shadow-pink-500/5"
          : "bg-white/[0.02] border-white/5 hover:border-white/10"
      }`}
    >
      <div
        className="flex items-start gap-4 p-5 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border ${
            open
              ? "bg-pink-500 border-pink-500 text-white"
              : "bg-white/5 border-white/10 text-gray-500 group-hover:text-white"
          }`}
        >
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm font-bold leading-relaxed text-gray-300 group-hover:text-white">
          {item.question}
        </p>

        <ChevronDown
          size={18}
          className={`text-gray-600 transition-transform duration-300 ${
            open ? "rotate-180 text-pink-500" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-6 space-y-6 bg-black/20">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500/80">
                  Evaluator's Intention
                </span>
                <p className="text-sm text-gray-400 italic mt-2">
                  "{item.intention}"
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                  Architected Answer
                </span>

                <p className="text-sm text-gray-200 mt-3">{item.answer}</p>
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
    className="relative pl-10 pb-10 group last:pb-0"
  >
    <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/50 to-indigo-500/50 group-last:bg-none" />

    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#030014] border-2 border-pink-500 flex items-center justify-center z-10">
      <span className="text-[10px] font-black text-white">{day.day}</span>
    </div>

    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
        {day.focus}

        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/5 text-gray-500 uppercase tracking-widest">
          Phase {day.day}
        </span>
      </h3>

      <ul className="space-y-3">
        {day.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {task}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const Interview = () => {
  const [activeNav, setActiveNav] = useState("analysis");

  const { report, getReportById, loading, getResumePdf } = useInterview();
  useEffect(() => {
    console.log("REPORT DATA:", report);
  }, [report]);

  const { interviewId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) getReportById(interviewId);
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main className="min-h-screen bg-[#02000d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-pink-500 border-white/10 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Decrypting Intelligence...
          </p>
        </div>
      </main>
    );
  }

  const score = report.matchScore ?? 0;

  const scoreColor =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-amber-500"
        : "text-pink-500";

  return (
    <div className="flex h-screen bg-[#02000d] text-slate-200 font-sans">
      {/* Sidebar */}
      <nav className="w-72 border-r border-white/5 bg-[#030014]/50 backdrop-blur-3xl flex flex-col p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest mb-10"
        >
          <ArrowLeft size={14} />
          Back to Logs
        </button>

        <div className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                activeNav === item.id
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => interviewId && getResumePdf(interviewId)}
          className="mt-auto flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pink-500 hover:text-white"
        >
          <Download size={16} />
          Download Resume
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {activeNav === "analysis" && (
          <section>
            <h1 className="text-4xl font-black text-white mb-10">
              Resume Compatibility Report
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Score */}
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 text-center">
                <p className="text-xs uppercase text-gray-500 mb-6">
                  System Match Score
                </p>

                <div className={`text-6xl font-black ${scoreColor}`}>
                  {score}%
                </div>
              </div>

              {/* Skill Gaps */}
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
                <p className="text-xs uppercase text-gray-500 mb-4">
                  Skill Gaps
                </p>

                <div className="flex flex-wrap gap-2">
                  {report.skillGaps?.map((gap, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-pink-500/10 border border-pink-500/20 rounded"
                    >
                      {gap.skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ML Results */}
            {report.resumeAnalysis && (
              <div className="grid md:grid-cols-3 gap-8 mt-10">
                {/* Extracted Skills */}
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xs uppercase mb-4 text-gray-500">
                    Extracted Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis.resume_skills?.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs bg-indigo-500/10 border border-indigo-500/20 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Paths */}
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xs uppercase mb-4 text-gray-500">
                    Career Paths
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {report.resumeAnalysis.career_paths?.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs bg-pink-500/10 border border-pink-500/20 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Jobs */}
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-xs uppercase mb-4 text-gray-500">
                    Recommended Jobs
                  </h3>

                  <div className="space-y-3">
                    {report.resumeAnalysis.recommended_jobs
                      ?.slice(0, 10)
                      .map((job, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-white/10 bg-white/[0.02]"
                        >
                          <p className="text-sm font-semibold text-white">
                            {job.role}
                          </p>

                          <p className="text-xs text-gray-400">
                            Match Score: {job.match_score}%
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Missing:{" "}
                            {job.missing_skills?.slice(0, 3).join(", ")}
                          </p>
                        </div>
                      ))}
                  </div>

                  {/* LIVE JOBS */}
                  {report?.live_jobs?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xs uppercase mb-4 text-gray-500">
                        Live Job Openings
                      </h3>

                      <div className="space-y-3">
                        {report.live_jobs.map((job, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg border border-white/10 bg-white/[0.02]"
                          >
                            <a
                              href={job.apply_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-pink-400 hover:underline"
                            >
                              {job.title}
                            </a>

                            <p className="text-xs text-gray-400">
                              {job.company}
                            </p>

                            <p className="text-xs text-gray-500">
                              {job.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Live Job Openings
                {report.live_jobs && report.live_jobs.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 mt-8">
                    <h3 className="text-xs uppercase mb-4 text-gray-500">
                      Live Job Openings
                    </h3>

                    <div className="space-y-3">
                      {report.live_jobs.map((job, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-white/10 bg-white/[0.02]"
                        >
                          <a
                            href={job.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-pink-400 hover:underline"
                          >
                            {job.title}
                          </a>

                          <p className="text-xs text-gray-400">{job.company}</p>

                          <p className="text-xs text-gray-500">
                            {job.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </section>
        )}

        {activeNav === "technical" && (
          <section>
            {report.technicalQuestions?.map((q, i) => (
              <QuestionCard key={i} item={q} index={i} />
            ))}
          </section>
        )}

        {activeNav === "behavioral" && (
          <section>
            {report.behavioralQuestions?.map((q, i) => (
              <QuestionCard key={i} item={q} index={i} />
            ))}
          </section>
        )}

        {activeNav === "roadmap" && (
          <section>
            {report.preparationPlan?.map((day, i) => (
              <RoadMapDay key={day.day} day={day} index={i} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Interview;
