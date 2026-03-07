import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import {
  Briefcase,
  User,
  Upload,
  Sparkles,
  FileText,
  AlertCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth.js";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleGenerateReport = async () => {
    if (!user?.grokApiKey) return;

    const resumeFile = resumeInputRef.current.files[0];

    if (!resumeFile && !selfDescription) {
      alert("Please upload a resume or provide a self description.");
      return;
    }

    if (!jobDescription) {
      alert("Please paste the job description.");
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin" />
          <Sparkles
            className="absolute inset-0 m-auto text-pink-500 animate-pulse"
            size={32}
          />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
          Architecting Strategy...
        </h1>
        <p className="text-gray-500 font-medium animate-pulse">
          Neural networks are analyzing your profile against job requirements.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#02000d] text-slate-200 font-sans selection:bg-pink-500/30 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto pt-16 pb-12 px-6 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-pink-500 text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <Sparkles size={12} /> Strategy Engine V3.0
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-[0.9]"
        >
          Forge Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Interview Roadmap
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl text-lg font-medium"
        >
          Supply the parameters below. Our AI will dissect the requirements and
          architect a high-performance execution plan.
        </motion.p>
      </header>

      {!user?.grokApiKey && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-pink-500/30 bg-pink-500/10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-pink-500" size={20} />
              <p className="text-sm text-pink-200 font-medium">
                AI features require a Groq API key. Add your key in Settings to
                generate interview strategies.
              </p>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Add API Key
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-8">
        {/* LEFT: Input Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Briefcase size={120} />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Job Description Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Job Intelligence
                    </h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      Target Requirements
                    </p>
                  </div>
                </div>
                <textarea
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-80 bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-gray-300 focus:outline-none focus:border-pink-500/50 transition-all resize-none placeholder:text-gray-700"
                  placeholder="Paste the full job description or requirements here..."
                  maxLength={5000}
                />
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  <span>Status: Awaiting Data</span>
                  <span>{jobDescription.length} / 5000</span>
                </div>
              </div>

              {/* Profile Side */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Your Profile
                    </h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      Candidate Data
                    </p>
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="space-y-4">
                  <label className="block group cursor-pointer">
                    <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all">
                      <input
                        ref={resumeInputRef}
                        hidden
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                      />
                      <Upload
                        className="mx-auto mb-3 text-gray-500 group-hover:text-indigo-400 group-hover:-translate-y-1 transition-all"
                        size={32}
                      />
                      <p className="text-sm font-bold text-white mb-1">
                        {fileName || "Upload Resume"}
                      </p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                        PDF or DOCX (Max 5MB)
                      </p>
                    </div>
                  </label>

                  <div className="relative py-2 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black text-gray-700 uppercase">
                      OR
                    </span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>

                  <textarea
                    onChange={(e) => setSelfDescription(e.target.value)}
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-gray-700"
                    placeholder="Briefly describe your experience..."
                  />
                </div>
              </div>
            </div>

            {/* Button Area */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-3 max-w-sm">
                <AlertCircle className="text-pink-500 shrink-0" size={18} />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Our engine requires either a{" "}
                  <span className="text-white font-bold">Resume</span> or{" "}
                  <span className="text-white font-bold">Self Description</span>{" "}
                  paired with the Job Intel to proceed.
                </p>
              </div>
              <button
                disabled={!user?.grokApiKey}
                onClick={handleGenerateReport}
                className={`w-full md:w-auto px-10 py-4 font-black rounded-2xl flex items-center justify-center gap-3 group transition-all
  ${
    user?.grokApiKey
      ? "bg-white text-black hover:bg-pink-600 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-pink-500/40"
      : "bg-gray-700 text-gray-400 cursor-not-allowed"
  }`}
              >
                GENERATE STRATEGY
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Side Logs / Recent Activity */}
        <aside className="lg:col-span-4 space-y-8">
          {reports.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white px-2 tracking-tight flex items-center gap-2">
                <FileText className="text-pink-500" size={18} />
                Recent Logs
              </h2>
              <div className="space-y-3">
                {reports.slice(0, 4).map((report) => (
                  <div
                    key={report._id}
                    onClick={() => navigate(`/interview/${report._id}`)}
                    className="group bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-pink-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors truncate pr-4">
                        {report.title || "Untitled Position"}
                      </h3>
                      <ChevronRight
                        className="text-gray-700 group-hover:text-white transition-colors"
                        size={16}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[11px] font-black text-pink-500">
                        {report.matchScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 rounded-2xl border border-white/5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                View All Intelligence Logs
              </button>
            </div>
          )}

          {/* Pro Tip Card */}
          <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden">
            <Sparkles
              className="absolute -top-4 -right-4 text-white/5"
              size={120}
            />
            <h4 className="text-white font-bold mb-2 relative z-10">Pro Tip</h4>
            <p className="text-sm text-indigo-200/70 leading-relaxed relative z-10">
              The more specific the Job Intelligence you provide, the more
              surgical our AI can be with your roadmap. Paste the full
              description!
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-8 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Neural Policy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Systems Help
        </a>
      </footer>
    </div>
  );
};

export default Home;
