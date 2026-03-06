"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePlan } from "../features/plan/hooks/usePlan";
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Target,
  Zap,
  ChevronRight,
  LayoutGrid,
  Loader2,
  LayoutDashboard,
  FileText,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, isSameDay, startOfToday } from "date-fns";
import { useAuth } from "../features/auth/hooks/useAuth";

/* --- SYNCED SIDEBAR ITEM COMPONENT --- */
const SidebarItem = ({ icon, label, active = false, highlight = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
        active
          ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      } ${highlight ? "text-pink-500" : ""}`}
    >
      {/* {active && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute left-0 w-1 h-6 bg-pink-500 rounded-r-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"
        />
      )} */}
      <span className={`${active ? "text-pink-500" : "group-hover:scale-110 transition-transform"}`}>
        {icon}
      </span>
      <span className="hidden md:block text-sm font-bold tracking-tight">
        {label}
      </span>
    </button>
  );
};

const CURRENT_YEAR = new Date().getFullYear();

export default function MyPlans() {
  const {
    plans,
    plan,
    fetchPlans,
    fetchPlanById,
    createNewPlan,
    toggleTask,
    addTask,
    deleteTask,
  } = usePlan();

  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [taskText, setTaskText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeYear, setActiveYear] = useState(CURRENT_YEAR);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    setSelectedDay(0);
  }, [plan?._id]);

  /* --- HEATMAP LOGIC (UNCHANGED) --- */
  const heatmapWeeks = useMemo(() => {
    const allCompletedTasks = plans?.flatMap(p => 
      p.days?.flatMap(d => d.tasks?.filter(t => t.completed && t.completedAt).map(t => ({
        ...t, date: new Date(t.completedAt)
      })) || []) || []
    ) || [];

    const startOfYearDate = new Date(activeYear, 0, 1);
    const endOfYearDate = new Date(activeYear, 11, 31);
    const dayRegistry = [];
    let iterDate = new Date(startOfYearDate);
    while (iterDate.getDay() !== 0) iterDate = subDays(iterDate, 1);

    while (iterDate <= endOfYearDate || dayRegistry.length % 7 !== 0) {
      const count = allCompletedTasks.filter(task => isSameDay(task.date, iterDate)).length;
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 4) level = 2;
      else if (count > 4 && count <= 6) level = 3;
      else if (count > 6) level = 4;
      dayRegistry.push({ date: new Date(iterDate), level, count });
      iterDate.setDate(iterDate.getDate() + 1);
      if (dayRegistry.length > 371) break;
    }

    const columns = [];
    for (let i = 0; i < dayRegistry.length; i += 7) {
      columns.push(dayRegistry.slice(i, i + 7));
    }
    return columns;
  }, [plans, activeYear]);

  /* --- STREAK LOGIC (UNCHANGED) --- */
  const { currentStreak, bestStreak } = useMemo(() => {
    const completedDates = plans?.flatMap(p => p.days?.flatMap(d => d.tasks?.filter(t => t.completed).map(t => new Date(t.completedAt))) || []) || [];
    if (completedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };
    const uniqueDays = [...new Set(completedDates.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()))].sort((a, b) => a - b);
    let best = 1, current = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      if ((uniqueDays[i] - uniqueDays[i - 1]) / 86400000 === 1) { current++; best = Math.max(best, current); } else { current = 1; }
    }
    let streak = 0, today = startOfToday();
    while (uniqueDays.includes(today.getTime())) { streak++; today = subDays(today, 1); }
    return { currentStreak: streak, bestStreak: best };
  }, [plans]);

  const monthLabels = useMemo(() => {
    const labels = [];
    heatmapWeeks.forEach((week, index) => {
      if (week[0].date.getDate() <= 7) labels.push({ name: format(week[0].date, "MMM"), index });
    });
    return labels;
  }, [heatmapWeeks]);

  const progress = useMemo(() => {
    const tasks = plan?.days?.[selectedDay]?.tasks || [];
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }, [plan, selectedDay]);

  const handleCreatePlan = async () => {
    if (!title.trim() || isCreating) return;
    setIsCreating(true);
    await createNewPlan({ title, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, tasks: [] })) });
    setTitle(""); setIsCreating(false); fetchPlans();
  };

  const handleAddTask = () => {
    if (!taskText.trim() || !plan?._id) return;
    addTask(plan._id, selectedDay, taskText); setTaskText("");
  };

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans">
      
      {/* --- SIDEBAR NAVIGATION (SYNCED) --- */}
      <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl z-50 flex flex-col items-center md:items-stretch py-8 px-4">
        <div onClick={() => navigate("/")} className="flex items-center gap-3 px-2 mb-12 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(219,39,119,0.4)]">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="hidden md:block text-xl font-black tracking-tighter text-white uppercase">
            Nexus<span className="text-pink-500">.</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2 w-full">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" onClick={() => navigate("/dashboard")} />
          <SidebarItem icon={<FileText size={20} />} label="My Plans" active onClick={() => navigate("/plans")} />
          <SidebarItem icon={<Plus size={20} />} label="New Strategy" highlight onClick={() => navigate("/app")} />
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 transition-all duration-300 w-full group">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform mb-1" />
          <span className="hidden md:block font-bold text-sm">Log out</span>
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA (SYNCED MARGIN) --- */}
      <main className="flex-1 ml-20 md:ml-64 p-4 md:p-12 lg:p-16 relative overflow-x-hidden">
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          
          {/* HEADER SECTION (SYNCED DESIGN) */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 text-pink-500 mb-3">
                <Zap size={18} fill="currentColor" className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.4em]">Neural Interface v2.0</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter text-white">
                Systems <span className="italic font-light text-gray-500">Active</span>
              </h1>
            </motion.div>

            <div className="flex items-center bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl backdrop-blur-2xl shadow-2xl">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreatePlan()}
                placeholder="Deploy new roadmap..."
                className="bg-transparent border-none px-5 py-2 outline-none w-full md:w-64 text-sm font-medium"
              />
              <button
                onClick={handleCreatePlan}
                disabled={isCreating}
                className="flex items-center gap-2 bg-white text-black hover:bg-pink-500 hover:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} strokeWidth={3} />}
                Create
              </button>
            </div>
          </header>

          {/* ACTIVITY HEATMAP SECTION */}
          <section className="mb-20">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-inner">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                    🔥 <span className="text-pink-400">{currentStreak}</span> <span className="text-gray-500 uppercase tracking-tighter">Streak</span>
                  </div>
                  <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                    🏆 <span className="text-indigo-400">{bestStreak}</span> <span className="text-gray-500 uppercase tracking-tighter">Best</span>
                  </div>
                </div>

                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                  {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR].map((yr) => (
                    <button key={yr} onClick={() => setActiveYear(yr)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeYear === yr ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20" : "text-gray-500 hover:text-gray-300"}`}>
                      {yr}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className={`w-3 h-3 rounded-[2px] ${l === 0 ? "bg-white/[0.05]" : l === 1 ? "bg-indigo-900/40" : l === 2 ? "bg-indigo-700/60" : l === 3 ? "bg-indigo-500/80" : "bg-pink-500"}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar relative">
                <div className="relative flex flex-col gap-2 w-max">
                  <div className="flex h-4 mb-2 relative">
                    {monthLabels.map((mon, i) => (
                      <div key={i} className="text-[10px] text-gray-600 font-bold uppercase absolute" style={{ left: `${mon.index * 18}px` }}>{mon.name}</div>
                    ))}
                  </div>
                  <div className="flex gap-[4px]">
                    {heatmapWeeks.map((week, w) => (
                      <div key={w} className="flex flex-col gap-[4px]">
                        {week.map((day, d) => (
                          <motion.div key={d} whileHover={{ scale: 1.5, zIndex: 10 }} title={`${day.count} tasks on ${format(day.date, "MMM do")}`} className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-700 ${day.date.getFullYear() !== activeYear ? "opacity-0" : ""} ${day.level === 0 ? "bg-white/[0.05]" : day.level === 1 ? "bg-indigo-900/40" : day.level === 2 ? "bg-indigo-700/60" : day.level === 3 ? "bg-indigo-500/80" : "bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <aside className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <LayoutGrid size={14} className="text-pink-500" /> Tactical Units
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {plans?.map((p) => (
                  <motion.div key={p._id} layoutId={p._id} onClick={() => fetchPlanById(p._id)} className={`p-6 rounded-3xl cursor-pointer border transition-all ${plan?._id === p._id ? "bg-gradient-to-br from-indigo-500/10 to-pink-500/10 border-pink-500/40 shadow-xl" : "bg-white/[0.02] border-white/5 hover:border-white/20"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-white">{p.title}</h3>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1"><Target size={12}/> {p.days?.length} phases</span>
                      </div>
                      <ChevronRight size={18} className={plan?._id === p._id ? "text-pink-500" : "text-gray-700"} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </aside>

            <main className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {plan ? (
                  <motion.div key={plan._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.01] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h2 className="text-3xl font-black text-white">{plan.title}</h2>
                        <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Operational Phase {selectedDay + 1}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-pink-500">{progress}%</div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Efficiency</div>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-12">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {plan.days?.map((d, i) => (
                        <button key={i} onClick={() => setSelectedDay(i)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDay === i ? "bg-white text-black shadow-lg shadow-white/10" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}>Phase {d.day}</button>
                      ))}
                    </div>

                    <div className="space-y-3 mb-10">
                      {plan.days?.[selectedDay]?.tasks?.map((task, index) => (
                        <motion.div key={index} className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                          <div onClick={() => toggleTask(plan._id, selectedDay, index)} className="flex items-center gap-4 cursor-pointer">
                            {task.completed ? <CheckCircle2 size={22} className="text-pink-500" /> : <Circle size={22} className="text-gray-700" />}
                            <span className={`text-sm font-medium ${task.completed ? "line-through text-gray-600" : "text-gray-200"}`}>{task.text}</span>
                          </div>
                          <Trash2 size={18} onClick={() => deleteTask(plan._id, selectedDay, index)} className="text-red-500/40 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-4 p-2 bg-black/30 rounded-2xl border border-white/5 focus-within:border-pink-500/30 transition-all">
                      <input value={taskText} onChange={(e) => setTaskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTask()} placeholder="Input objective..." className="flex-1 bg-transparent px-4 py-3 outline-none text-sm" />
                      <button onClick={handleAddTask} className="bg-white text-black px-8 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">Append</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01]">
                    <Zap size={48} className="text-pink-500 mb-6 animate-pulse" />
                    <h3 className="text-xl font-bold text-white mb-2">Command Center Offline</h3>
                    <p className="text-gray-600 text-sm max-w-xs text-center">Select a unit from the sidebar to initialize the neural interface.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}