import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { 
    Code2, 
    MessageSquare, 
    Map, 
    Download, 
    ChevronDown, 
    Target, 
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    BarChart3 // Added for Resume Analysis icon
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'analysis', label: 'Resume Analysis', icon: <BarChart3 size={18} /> }, // Now the first section
    { id: 'technical', label: 'Technical Intelligence', icon: <Code2 size={18} /> },
    { id: 'behavioral', label: 'Behavioral Strategy', icon: <MessageSquare size={18} /> },
    { id: 'roadmap', label: 'Preparation Roadmap', icon: <Map size={18} /> },
]

// ── Sub-components ────────────────────────────────────────────────────────────

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group mb-4 rounded-2xl border transition-all duration-300 ${open ? 'bg-white/[0.04] border-pink-500/30 shadow-lg shadow-pink-500/5' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
        >
            <div className='flex items-start gap-4 p-5 cursor-pointer' onClick={() => setOpen(!open)}>
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border transition-colors ${open ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/5 border-white/10 text-gray-500 group-hover:text-white'}`}>
                    Q{index + 1}
                </span>
                <p className={`flex-1 text-sm font-bold leading-relaxed transition-colors ${open ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.question}
                </p>
                <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${open ? 'rotate-180 text-pink-500' : ''}`} />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='overflow-hidden border-t border-white/5'
                    >
                        <div className='p-6 space-y-6 bg-black/20'>
                            <div className='space-y-2'>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-pink-500/80'>Evaluator's Intention</span>
                                <p className='text-sm text-gray-400 leading-relaxed italic'>"{item.intention}"</p>
                            </div>
                            <div className='space-y-3 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10'>
                                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500'>Architected Answer</span>
                                <p className='text-sm text-gray-200 leading-relaxed font-medium'>{item.answer}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const RoadMapDay = ({ day, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className='relative pl-10 pb-10 group last:pb-0'
    >
        <div className="absolute left-[15px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-pink-500/50 to-indigo-500/50 group-last:bg-none" />
        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#030014] border-2 border-pink-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(219,39,119,0.3)]">
            <span className="text-[10px] font-black text-white">{day.day}</span>
        </div>
        <div className='bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-all'>
            <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-3'>
                {day.focus}
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/5 text-gray-500 uppercase tracking-widest">Phase {day.day}</span>
            </h3>
            <ul className='space-y-3'>
                {day.tasks.map((task, i) => (
                    <li key={i} className='flex items-start gap-3 text-sm text-gray-400 leading-relaxed'>
                        <div className='mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]' />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
)

// ── Main Component ────────────────────────────────────────────────────────────

const Interview = () => {
    const [activeNav, setActiveNav] = useState('analysis') // Default to Analysis
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className='min-h-screen bg-[#02000d] flex items-center justify-center'>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-pink-500 border-white/10 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Decrypting Intelligence...</p>
                </div>
            </main>
        )
    }

    const scoreColor = report.matchScore >= 80 ? 'text-emerald-500' : report.matchScore >= 60 ? 'text-amber-500' : 'text-pink-500'

    return (
        <div className='flex h-screen bg-[#02000d] text-slate-200 overflow-hidden font-sans'>
            
            {/* ── LEFT SIDEBAR NAV ── */}
            <nav className='w-72 border-r border-white/5 bg-[#030014]/50 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto'>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-10 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Logs
                </button>

                <div className="space-y-1 flex-1">
                    <p className='text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-2'>Report Sections</p>
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-bold ${activeNav === item.id ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => getResumePdf(interviewId)}
                    className='mt-auto flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl shadow-white/5'
                >
                    <Download size={16} /> Download Resume
                </button>
            </nav>

            {/* ── CENTER SCROLLABLE CONTENT ── */}
            <main className='flex-1 overflow-y-auto bg-gradient-to-b from-white/[0.02] to-transparent scroll-smooth'>
                <div className='max-w-4xl mx-auto py-16 px-8'>
                    <AnimatePresence mode='wait'>
                    <motion.div 
                        key={activeNav}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* ================= SECTION: RESUME ANALYSIS ================= */}
                        {activeNav === 'analysis' && (
                            <section>
                                <header className='mb-12'>
                                    <h1 className='text-4xl font-black text-white tracking-tighter mb-2 italic'>Resume Compatibility Analysis</h1>
                                    <p className='text-gray-500 font-medium tracking-tight'>Neural mapping of your profile against the target job architecture.</p>
                                </header>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
                                    {/* Main Gauge */}
                                    <div className='bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative overflow-hidden'>
                                        <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent' />
                                        <p className='text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8'>Compatibility Index</p>
                                        <div className='relative w-48 h-48'>
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="96" cy="96" r="85" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                                                <motion.circle 
                                                    cx="96" cy="96" r="85" fill="transparent" stroke="currentColor" strokeWidth="10" 
                                                    strokeDasharray={534}
                                                    initial={{ strokeDashoffset: 534 }}
                                                    animate={{ strokeDashoffset: 534 - (534 * report.matchScore) / 100 }}
                                                    transition={{ duration: 2, ease: "circOut" }}
                                                    className={scoreColor}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-6xl font-black text-white tracking-tighter">{report.matchScore}</span>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Percent</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Verdict & Gaps */}
                                    <div className='space-y-6'>
                                        <div className='bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-8 h-full'>
                                            <div className="flex items-center gap-3 mb-4 text-emerald-500">
                                                <CheckCircle2 size={24} />
                                                <span className="text-sm font-black uppercase tracking-widest">System Verdict</span>
                                            </div>
                                            <p className="text-lg text-gray-200 leading-relaxed font-medium italic mb-6">
                                                "Analysis complete. The candidate shows strong fundamentals. Focus on bridging the identified deltas in Phase 2 of the Roadmap."
                                            </p>
                                            <div className='h-[1px] bg-white/5 mb-6' />
                                            <p className='text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4'>Critical Delta Gaps</p>
                                            <div className='flex flex-wrap gap-2'>
                                                {report.skillGaps.map((gap, i) => (
                                                    <span key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${gap.severity === 'high' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                                        {gap.skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ================= SECTION: TECHNICAL ================= */}
                        {activeNav === 'technical' && (
                            <section>
                                <header className='mb-12'>
                                    <h1 className='text-4xl font-black text-white tracking-tighter mb-2 italic'>Technical Intelligence</h1>
                                    <p className='text-gray-500 font-medium tracking-tight'>AI-generated insights and high-probability interview questions.</p>
                                </header>
                                <div className='space-y-2'>
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ================= SECTION: BEHAVIORAL ================= */}
                        {activeNav === 'behavioral' && (
                            <section>
                                <header className='mb-12'>
                                    <h1 className='text-4xl font-black text-white tracking-tighter mb-2 italic'>Behavioral Strategy</h1>
                                    <p className='text-gray-500 font-medium tracking-tight'>Psychometric alignment and situational response patterns.</p>
                                </header>
                                <div className='space-y-2'>
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ================= SECTION: ROADMAP ================= */}
                        {activeNav === 'roadmap' && (
                            <section>
                                <header className='mb-12'>
                                    <h1 className='text-4xl font-black text-white tracking-tighter mb-2 italic'>Preparation Roadmap</h1>
                                    <p className='text-gray-500 font-medium tracking-tight'>A comprehensive {report.preparationPlan.length}-day execution plan.</p>
                                </header>
                                <div className='pt-4'>
                                    {report.preparationPlan.map((day, i) => (
                                        <RoadMapDay key={day.day} day={day} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default Interview