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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Note: If you don't have date-fns, you can use native JS Date, but date-fns is recommended for accuracy.
import { format, subDays, isSameDay, startOfToday } from "date-fns";

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

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    setSelectedDay(0);
  }, [plan?._id]);

  /* -----------------------------------------------------------
      REAL-TIME HISTORICAL HEATMAP LOGIC
      This calculates actual activity for the last 364 days.
  ----------------------------------------------------------- */
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());

  const heatmapWeeks = useMemo(() => {
    // 1. Extract all completed tasks
    const allCompletedTasks =
      plans?.flatMap(
        (p) =>
          p.days?.flatMap(
            (d) =>
              d.tasks
                ?.filter((t) => t.completed)
                .map((t) => ({
                  ...t,
                  date: new Date(),
                })) || [],
          ) || [],
      ) || [];

    // 2. Calculate range for the selected year
    const startOfYearDate = new Date(activeYear, 0, 1);
    const endOfYearDate = new Date(activeYear, 11, 31);

    // To keep the grid consistent (52/53 weeks), we align to the start of the first week
    const dayRegistry = [];
    let iterDate = new Date(startOfYearDate);

    // Adjust to start on the nearest Sunday/Monday to keep columns clean
    while (iterDate.getDay() !== 0) iterDate = subDays(iterDate, 1);

    while (iterDate <= endOfYearDate || dayRegistry.length % 7 !== 0) {
      const count = allCompletedTasks.filter((task) =>
        isSameDay(task.date, iterDate),
      ).length;

      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 4) level = 2;
      else if (count > 4 && count <= 6) level = 3;
      else if (count > 6) level = 4;

      dayRegistry.push({ date: new Date(iterDate), level, count });
      iterDate.setDate(iterDate.getDate() + 1);
      if (dayRegistry.length > 371) break; // Hard cap
    }

    const columns = [];
    for (let i = 0; i < dayRegistry.length; i += 7) {
      columns.push(dayRegistry.slice(i, i + 7));
    }
    return columns;
  }, [plans, activeYear]);

  const { currentStreak, bestStreak } = useMemo(() => {
    const completedDates =
      plans?.flatMap(
        (p) =>
          p.days?.flatMap((d) =>
            d.tasks?.filter((t) => t.completed).map((t) => new Date()),
          ) || [],
      ) || [];

    if (completedDates.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    const uniqueDays = [
      ...new Set(
        completedDates.map((d) =>
          new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(),
        ),
      ),
    ].sort((a, b) => a - b);

    let best = 1;
    let current = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const diff = (uniqueDays[i] - uniqueDays[i - 1]) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 1;
      }
    }

    // Calculate current streak from today backwards
    let streak = 0;
    let today = startOfToday();

    while (true) {
      const exists = uniqueDays.includes(today.getTime());
      if (!exists) break;
      streak++;
      today = subDays(today, 1);
    }

    return {
      currentStreak: streak,
      bestStreak: best,
    };
  }, [plans]);

  // Helper to get month labels position
  const monthLabels = useMemo(() => {
    const labels = [];
    heatmapWeeks.forEach((week, index) => {
      const firstDayOfWeek = week[0].date;
      if (firstDayOfWeek.getDate() <= 7) {
        labels.push({ name: format(firstDayOfWeek, "MMM"), index });
      }
    });
    return labels;
  }, [heatmapWeeks]);

  /* -----------------------------
      PROGRESS CALCULATION
  ------------------------------ */
  const progress = useMemo(() => {
    const tasks = plan?.days?.[selectedDay]?.tasks || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [plan, selectedDay]);

  const handleCreatePlan = async () => {
    if (!title.trim() || isCreating) return;
    setIsCreating(true);
    await createNewPlan({
      title,
      days: Array.from({ length: 5 }, (_, i) => ({
        day: i + 1,
        tasks: [],
      })),
    });
    setTitle("");
    setIsCreating(false);
    fetchPlans();
  };

  const handleAddTask = () => {
    if (!taskText.trim() || !plan?._id) return;
    addTask(plan._id, selectedDay, taskText);
    setTaskText("");
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-pink-500/30 font-sans antialiased">
      {/* GLOWING BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-pink-500 mb-3">
              <Zap size={18} fill="currentColor" className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.4em]">
                Neural Interface v2.0
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              My Training <br /> Roadmap
            </h1>
          </motion.div>

          <div className="flex items-center bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl backdrop-blur-2xl focus-within:border-pink-500/50 transition-colors shadow-2xl">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlan()}
              placeholder="Deploy new roadmap..."
              className="bg-transparent border-none px-5 py-2 outline-none w-full md:w-72 text-sm font-medium"
            />
            <button
              onClick={handleCreatePlan}
              disabled={isCreating}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Plus size={16} />
              )}
              Init
            </button>
          </div>
        </header>

        {/* ACTIVITY HEATMAP (REAL-TIME UPDATING) */}
        <section className="mb-20">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-inner">
            {/* HEATMAP HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-lg">
                  🔥
                  <span className="text-pink-400">{currentStreak}</span>
                  <span className="text-gray-500">day streak</span>
                </div>

                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                  🏆
                  <span className="text-indigo-400">{bestStreak}</span>
                  <span className="text-gray-500">best</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Calendar size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    Activity Pulse
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Historical Task Matrix
                  </p>
                </div>
              </div>

              {/* YEAR SELECTOR */}
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                {[CURRENT_YEAR - 2, CURRENT_YEAR - 1, CURRENT_YEAR].map(
                  (yr) => (
                    <button
                      key={yr}
                      onClick={() => setActiveYear(yr)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeYear === yr
                          ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {yr}
                    </button>
                  ),
                )}
              </div>

              {/* LEGEND */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div
                    key={l}
                    className={`w-3 h-3 rounded-[2px] ${
                      l === 0
                        ? "bg-white/[0.05]"
                        : l === 1
                          ? "bg-indigo-900/40"
                          : l === 2
                            ? "bg-indigo-700/60"
                            : l === 3
                              ? "bg-indigo-500/80"
                              : "bg-pink-500"
                    }`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>

            {/* THE GRID */}
            <div className="overflow-x-auto no-scrollbar">
              <div className="relative flex flex-col gap-2 w-max">
                {/* MONTH LABELS ROW */}
                <div className="flex h-4 mb-2">
                  {monthLabels.map((mon, i) => (
                    <div
                      key={i}
                      className="text-[10px] text-gray-600 font-bold uppercase absolute"
                      style={{ left: `${mon.index * 18}px` }} // 14px width + 4px gap
                    >
                      {mon.name}
                    </div>
                  ))}
                </div>

                {/* COLUMNS */}
                <div className="flex gap-[4px]">
                  {heatmapWeeks.map((week, w) => (
                    <div key={w} className="flex flex-col gap-[4px]">
                      {week.map((day, d) => (
                        <motion.div
                          key={d}
                          whileHover={{ scale: 1.5, zIndex: 10 }}
                          title={`${day.count} tasks on ${format(day.date, "MMM do, yyyy")}`}
                          className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-700
                    ${day.date.getFullYear() !== activeYear ? "opacity-0 pointer-events-none" : ""}
                    ${day.level === 0 && "bg-white/[0.05] hover:bg-white/20"}
                    ${day.level === 1 && "bg-indigo-900/40"}
                    ${day.level === 2 && "bg-indigo-700/60"}
                    ${day.level === 3 && "bg-indigo-500/80"}
                    ${day.level === 4 && "bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"}
                  `}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: PLAN SELECTION */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-pink-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  Tactical Units
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">
                {plans?.length || 0} TOTAL
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {plans?.length === 0 && (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-sm text-gray-600">No active roadmaps</p>
                </div>
              )}
              {plans?.map((p) => (
                <motion.div
                  key={p._id}
                  layoutId={p._id}
                  whileHover={{ x: 8 }}
                  onClick={() => fetchPlanById(p._id)}
                  className={`p-6 rounded-3xl cursor-pointer border transition-all duration-300
                    ${
                      plan?._id === p._id
                        ? "bg-gradient-to-br from-indigo-500/15 to-pink-500/15 border-pink-500/50 shadow-lg shadow-pink-500/5"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <Target size={12} /> {p.days?.length || 0} phases
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={
                        plan?._id === p._id ? "text-pink-500" : "text-gray-700"
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </aside>

          {/* RIGHT: TASK MANAGEMENT */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {plan ? (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white/[0.01] border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-3xl shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">
                        {plan.title}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Operational Phase {selectedDay + 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black text-white">
                        {progress}%
                      </div>
                      <div className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
                        Efficiency
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-12">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", bounce: 0, duration: 1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    />
                  </div>

                  {/* DAY PICKER */}
                  <div className="flex flex-wrap gap-3 mb-12">
                    {plan.days?.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all
                          ${
                            selectedDay === i
                              ? "bg-white text-black shadow-xl shadow-white/10"
                              : "bg-white/5 text-gray-500 hover:bg-white/10"
                          }
                        `}
                      >
                        Phase {d.day}
                      </button>
                    ))}
                  </div>

                  {/* TASK LIST */}
                  <div className="space-y-3 mb-10 min-h-[200px]">
                    <AnimatePresence>
                      {plan.days?.[selectedDay]?.tasks?.map((task, index) => (
                        <motion.div
                          key={`${plan._id}-${selectedDay}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                        >
                          <div
                            onClick={() =>
                              toggleTask(plan._id, selectedDay, index)
                            }
                            className="flex items-center gap-5 cursor-pointer flex-1"
                          >
                            <div className="transition-transform active:scale-90">
                              {task.completed ? (
                                <CheckCircle2
                                  className="text-pink-500"
                                  size={24}
                                />
                              ) : (
                                <Circle
                                  className="text-gray-700 group-hover:text-gray-500"
                                  size={24}
                                />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium transition-all ${task.completed ? "line-through text-gray-600" : "text-gray-200"}`}
                            >
                              {task.text}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              deleteTask(plan._id, selectedDay, index)
                            }
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2
                              size={18}
                              className="text-red-500/70 hover:text-red-500"
                            />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {(!plan.days?.[selectedDay]?.tasks ||
                      plan.days?.[selectedDay]?.tasks.length === 0) && (
                      <div className="text-center py-12 text-gray-600 italic text-sm border border-dashed border-white/5 rounded-2xl">
                        No objectives defined for this phase
                      </div>
                    )}
                  </div>

                  {/* INPUT AREA */}
                  <div className="flex gap-4 p-2 bg-black/20 rounded-[2rem] border border-white/5 focus-within:border-white/10 transition-all">
                    <input
                      value={taskText}
                      onChange={(e) => setTaskText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                      placeholder="Input new tactical objective..."
                      className="flex-1 bg-transparent border-none px-6 py-4 outline-none text-sm"
                    />
                    <button
                      onClick={handleAddTask}
                      className="bg-white text-black px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all active:scale-95"
                    >
                      Append
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01]">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full" />
                    <Zap className="text-pink-500 relative" size={48} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Command Center Offline
                  </h3>
                  <p className="text-gray-600 text-sm max-w-xs text-center leading-relaxed">
                    Select a tactical unit from the sidebar to initialize the
                    neural interface.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
