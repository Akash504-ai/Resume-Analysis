import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  MessageSquare,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Database,
  Search,
  LogOut,
} from "lucide-react";
import UsersTable from "../components/UsersTable";
import { useAuth } from "../../auth/hooks/useAuth";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalMessages: 0,
  });

  const { handleLogout } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.log("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02000d] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mb-4" />
        <h2 className="text-pink-500 font-bold tracking-[0.2em] uppercase text-[10px]">
          Initializing Command...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans p-6 md:p-12 lg:p-16">
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-pink-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/80">
                Admin Protocol Active
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              Admin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 italic font-light">
                Dashboard
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Node: Central-01
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-all text-xs font-bold uppercase tracking-widest"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={20} />}
            color="pink"
          />
          <StatCard
            title="Community Messages"
            value={stats.totalMessages}
            icon={<MessageSquare size={20} />}
            color="violet"
          />
          <StatCard
            title="Resumes Analyzed"
            value="SCANN_NG" // Glitchy text effect
            icon={<FileText size={20} />}
            color="indigo"
            isPending={true}
            statusLabel="Decrypting Data"
          />
          <StatCard
            title="Message Report"
            value="OFF_LINE"
            icon={<Activity size={20} />}
            color="emerald"
            isPending={true}
            statusLabel="Establishing Link"
          />
        </div>

        {/* --- USER MANAGEMENT SECTION --- */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Database size={18} className="text-gray-600" />
            <h2 className="text-xl font-bold text-white tracking-tight shrink-0">
              User Management
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-2 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Table Header Overlay for better UI depth */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Database Records
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <UsersTable />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- STAT CARD COMPONENT ---------------- */

function StatCard({
  title,
  value,
  icon,
  color,
  isPending = false,
  statusLabel,
}) {
  const colorVariants = {
    pink: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    violet: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };

  return (
    <motion.div
      whileHover={!isPending ? { y: -5 } : {}}
      className={`relative group border rounded-[2rem] p-8 transition-all duration-500 overflow-hidden ${
        isPending
          ? "bg-white/[0.01] border-white/5 opacity-60 grayscale-[0.5]"
          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10"
      }`}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div
          className={`p-3 rounded-2xl border ${colorVariants[color]} ${isPending ? "animate-pulse" : ""}`}
        >
          {icon}
        </div>

        {isPending ? (
          <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/10 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-gray-500 animate-ping" />
            Developing
          </div>
        ) : (
          <div className="p-1.5 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3
          className={`text-3xl font-black tracking-tighter mb-1 ${isPending ? "text-gray-500 italic" : "text-white"}`}
        >
          {value}
        </h3>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          {title}
        </p>
        {isPending && (
          <p className="mt-2 text-[9px] text-indigo-500/50 font-black uppercase tracking-[0.1em] animate-pulse">
            {statusLabel}...
          </p>
        )}
      </div>

      {/* Aesthetic radial gradient glow - Disabled for pending items */}
      {!isPending && (
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-colors" />
      )}
    </motion.div>
  );
}

export default AdminDashboard;
