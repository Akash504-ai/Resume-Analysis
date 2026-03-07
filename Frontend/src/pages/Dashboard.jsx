import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LogOut,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Zap,
  ChevronRight,
  Search,
  Code2,
  MessageSquare,
  Map,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  X,
  Download,
  Settings,
} from "lucide-react";
import { useInterview } from "../features/interview/hooks/useInterview";
import { useAuth } from "../features/auth/hooks/useAuth";
// import Settings from "./Settings";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    reports,
    getReportById,
    report: activeReport,
    loading,
  } = useInterview();
  // const { reports } = useInterview();
  const { handleLogout } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  const totalReports = reports.length;
  const avgScore =
    reports.length === 0
      ? 0
      : Math.round(
          reports.reduce((sum, r) => sum + r.matchScore, 0) / reports.length,
        );
  // Handle selecting a log
  const handleSelectReport = (id) => {
    setSelectedId(id);
    getReportById(id);
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl z-50 flex flex-col items-center md:items-stretch py-8 px-4">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-2 mb-12 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.4)]">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="hidden md:block text-xl font-black tracking-tighter text-white uppercase">
            Nexus<span className="text-pink-500">.</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="My Plans"
            onClick={() => navigate("/plans")}
          />
          <SidebarItem
            icon={<Plus size={20} />}
            label="New Strategy"
            onClick={() => navigate("/app")}
            highlight
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            onClick={() => navigate("/settings")}
          />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300 w-full group"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform mb-1"
          />
          <span className="hidden md:block font-bold text-sm">Log out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-[190px] p-4 md:p-12 lg:p-16">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                Systems{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 italic font-light text-5xl">
                  Active
                </span>
              </h1>
              <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Engine: V3-Neural
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-800" />
                <span>Sync: Live</span>
              </div>
            </div>

            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
              <button
                onClick={() => navigate("/app")}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-pink-500 hover:text-white transition-all flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={3} />
                Create Plan
              </button>
            </div>
          </header>

          {/* --- BENTO GRID STATS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <BentoCard
              label="Fleet Strength"
              value={`${avgScore}%`}
              sub="Avg. Compatibility"
              icon={<TrendingUp className="text-pink-500" />}
              color="pink"
            />
            <BentoCard
              label="Data Clusters"
              value={totalReports}
              sub="Analyzed Strategies"
              icon={<FileText className="text-indigo-400" />}
            />
            <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 relative overflow-hidden group shadow-lg shadow-indigo-500/20">
              <div className="relative z-10">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">
                  Pro Feature
                </p>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight tracking-tight">
                  AI Mock Interviews
                </h3>
                <button className="px-4 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-lg text-white text-[10px] font-bold transition-all border border-white/10 uppercase tracking-widest">
                  Coming Soon
                </button>
              </div>
              <Zap
                size={140}
                className="absolute right-[-20px] bottom-[-20px] text-white/10 -rotate-12 group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>

          {/* --- REPORT LIST --- */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Intelligence Logs
              </h2>
              <div className="relative hidden md:block">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={14}
                />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-pink-500/50 w-64 transition-all"
                  placeholder="Search logs..."
                />
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {reports.length > 0 ? (
                  reports.map((report, i) => (
                    <ReportRow
                      key={report._id}
                      report={report}
                      index={i}
                      onClick={() => navigate(`/interview/${report._id}`)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-gray-500"
                  >
                    <FileText size={32} className="mb-4 opacity-20" />
                    <p className="font-bold tracking-tight text-sm uppercase">
                      No intelligence logs found.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// --- SUB COMPONENTS (JavaScript Style) ---

function SidebarItem({
  icon,
  label,
  active = false,
  highlight = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
        active
          ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      } ${highlight ? "text-pink-500" : ""}`}
    >
      <span
        className={`${active ? "text-pink-500" : "group-hover:scale-110 transition-transform"}`}
      >
        {icon}
      </span>
      <span className="hidden md:block text-sm font-bold tracking-tight">
        {label}
      </span>
    </button>
  );
}

function BentoCard({ label, value, sub, icon, color = "indigo" }) {
  return (
    <div className="group bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl bg-white/5 text-${color}-400 group-hover:scale-110 transition-transform duration-500`}
        >
          {icon}
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-500/20">
          Optimal
        </div>
      </div>
      <div>
        <h3 className="text-5xl font-black text-white tracking-tighter mb-1">
          {value}
        </h3>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-gray-600 text-[10px] font-medium">{sub}</p>
      </div>
    </div>
  );
}

function ReportRow({ report, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group flex flex-wrap md:flex-nowrap items-center justify-between p-4 md:p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:bg-white/[0.05] hover:border-pink-500/30 transition-all cursor-pointer shadow-sm"
    >
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors tracking-tight">
            {report.title || "Standard Analysis"}
          </h4>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Log: {report._id.slice(-6)} •{" "}
            {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
        <div className="text-right">
          <div className="flex items-center gap-3">
            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden hidden lg:block border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.matchScore}%` }}
                className="h-full bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.8)]"
              />
            </div>
            <span className="text-2xl font-black text-white">
              {report.matchScore}%
            </span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
            Compatibility
          </p>
        </div>
        <div className="p-2 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
    </motion.div>
  );
}
