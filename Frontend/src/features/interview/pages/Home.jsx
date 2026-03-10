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
  Brain,
  Lock,
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

  /* ---------------- FREE RESUME ANALYSIS ---------------- */

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

    if (data?._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  /* ---------------- FULL AI STRATEGY ---------------- */

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

    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-4 border-t-pink-500 border-white/10 rounded-full animate-spin mb-6" />

        <h2 className="text-2xl font-bold text-white">
          AI is analyzing your profile...
        </h2>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#02000d] text-slate-200 font-sans pb-20">
      {/* Header */}

      <header className="max-w-6xl mx-auto pt-16 pb-12 px-6">
        <h1 className="text-6xl font-black text-white leading-tight">
          Resume Intelligence <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
            Strategy Engine
          </span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl">
          Upload your resume and job description to generate AI-powered
          interview preparation and skill analysis.
        </p>
      </header>

      {/* API KEY WARNING */}

      {!user?.grokApiKey && (
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-yellow-400" />

              <p className="text-sm text-yellow-200">
                Full interview strategy requires your own Groq API key. Resume
                analysis remains free.
              </p>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="px-4 py-2 bg-yellow-500 text-black text-sm rounded-lg"
            >
              Add API Key
            </button>
          </div>
        </div>
      )}

      {/* MAIN FORM */}

      <main className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
        {/* LEFT PANEL */}

        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-8">
          {/* Job Description */}

          <div>
            <label className="text-sm text-gray-400 font-semibold mb-3 block">
              Job Description
            </label>

            <textarea
              className="w-full h-56 bg-black/40 border border-white/10 rounded-xl p-4"
              placeholder="Paste job description..."
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Resume Upload */}

          <div>
            <label className="text-sm text-gray-400 font-semibold mb-3 block">
              Resume
            </label>

            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />

            {fileName && (
              <p className="text-xs text-gray-500 mt-2">{fileName}</p>
            )}
          </div>

          {/* Self Description */}

          <div>
            <label className="text-sm text-gray-400 font-semibold mb-3 block">
              Self Description (optional)
            </label>

            <textarea
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4"
              placeholder="Briefly describe your experience..."
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 pt-4">
            {/* FREE BUTTON */}

            <button
              onClick={handleFreeAnalysis}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold flex items-center gap-2"
            >
              <Brain size={18} />
              Analyze Resume (Free)
            </button>

            {/* FULL STRATEGY */}

            <button
              onClick={handleFullStrategy}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 ${
                user?.grokApiKey
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              <Sparkles size={18} />
              Generate Interview Strategy
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <aside className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={18} />
            Recent Reports
          </h2>

          {reports.slice(0, 4).map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/interview/${report._id}`)}
              className="p-4 border border-white/5 rounded-xl hover:bg-white/5 cursor-pointer"
            >
              <p className="text-sm font-bold text-white">
                {report.title || "Interview Report"}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>

                <span className="text-pink-400">{report.matchScore}%</span>
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
};

export default Home;
