"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Target,
  Code,
  Link2,
  Camera,
  Save,
  X,
  User,
  Cpu,
  Globe,
  MessageSquare,
  Trophy,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react";
import Sidebar from "../layouts/sidebar";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Mobile Developer",
  "Other"
];

const suggestedSkills = [
  "React", "Node", "MongoDB", "Express", "Next.js", "Python", "Java", "C++", "Docker", "AWS", "TypeScript"
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [customSkill, setCustomSkill] = useState("");

  const [form, setForm] = useState({
    bio: "",
    targetRole: "",
    customRole: "",
    github: "",
    skills: [],
    leetcode: "",
    gfg: "",
    codeforces: "",
    codechef: "",
  });

  const completion = () => {
    let filled = 0;
    let total = 6;
    if (profile?.bio) filled++;
    if (profile?.targetRole) filled++;
    if (profile?.github) filled++;
    if (profile?.skills?.length) filled++;
    if (profile?.codingProfiles?.leetcode) filled++;
    if (profile?.profileImage) filled++;
    return Math.round((filled / total) * 100);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/profile/me", {
        credentials: "include",
      });
      const data = await res.json();
      setProfile(data?.profile || null);
      setUser(data?.user || null);

      if (data?.profile) {
        const isStandardRole = roles.includes(data.profile.targetRole);
        setForm({
          bio: data.profile.bio || "",
          targetRole: isStandardRole ? data.profile.targetRole : "Other",
          customRole: isStandardRole ? "" : data.profile.targetRole,
          github: data.profile.github || "",
          skills: data.profile.skills || [],
          leetcode: data.profile.codingProfiles?.leetcode || "",
          gfg: data.profile.codingProfiles?.gfg || "",
          codeforces: data.profile.codingProfiles?.codeforces || "",
          codechef: data.profile.codingProfiles?.codechef || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    if (!form.skills.includes(customSkill.trim())) {
        setForm({ ...form, skills: [...form.skills, customSkill.trim()] });
    }
    setCustomSkill("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    const res = await fetch("http://localhost:3000/api/profile/upload-image", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    setProfile(data);
  };

  const updateProfile = async () => {
    const finalRole = form.targetRole === "Other" ? form.customRole : form.targetRole;
    
    if (!finalRole) {
      alert("Please specify your target role");
      return;
    }

    try {
      const body = {
        bio: form.bio,
        targetRole: finalRole,
        github: form.github,
        skills: form.skills,
        codingProfiles: {
          leetcode: form.leetcode,
          gfg: form.gfg,
          codeforces: form.codeforces,
          codechef: form.codechef,
        },
      };
      const res = await fetch("http://localhost:3000/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      setProfile(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#02000d]">
        <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200 selection:bg-pink-500/30 font-sans">
      <Sidebar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[5%] left-[10%] w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="flex-1 ml-20 md:ml-64 p-6 md:p-12 lg:p-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* --- HEADER --- */}
          <header className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-pink-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <label htmlFor="imageUpload" className="relative block cursor-pointer">
                  <img
                    src={profile?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[1.8rem] border border-white/10 object-cover bg-black"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.8rem] flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </label>
                <input type="file" id="imageUpload" className="hidden" onChange={handleImageUpload} />
              </div>

              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3">
                  {user?.username}<span className="text-pink-500">.</span>
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-2 text-gray-400 font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    <Mail size={14} className="text-pink-500" /> {user?.email}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400 font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    <Target size={14} className="text-indigo-400" /> {profile?.targetRole || "Rank: Candidate"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 ${
                editing ? "bg-white/5 text-white border border-white/10" : "bg-white text-black hover:bg-pink-500 hover:text-white"
              }`}
            >
              {editing ? <><X size={18} /> Cancel</> : <><User size={18} /> Edit Core</>}
            </button>
          </header>

          {/* --- SYNC BAR --- */}
          <section className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 mb-12 backdrop-blur-xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Neural Link Sync</p>
                <h3 className="text-2xl font-bold text-white">Profile Integrity: {completion()}%</h3>
              </div>
              <Cpu size={24} className="text-pink-500 animate-pulse" />
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion()}%` }}
                className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 shadow-[0_0_20px_rgba(219,39,119,0.4)]"
              />
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/[0.02] border border-pink-500/20 rounded-[2.5rem] p-8 space-y-8"
                  >
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-pink-500 ml-2">Mission Bio</label>
                      <textarea
                        placeholder="Define your trajectory..."
                        className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] focus:border-pink-500/50 outline-none text-sm min-h-[120px]"
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-2">Designation</label>
                        <select
                          value={form.targetRole}
                          onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] focus:border-indigo-500/50 outline-none text-sm appearance-none"
                        >
                          <option value="">Select Role</option>
                          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      
                      {form.targetRole === "Other" && (
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-pink-500 ml-2">Custom Role</label>
                          <input
                            placeholder="Enter Custom Designation"
                            className="w-full bg-black/40 border border-pink-500/20 p-5 rounded-[1.5rem] outline-none text-sm"
                            value={form.customRole}
                            onChange={(e) => setForm({ ...form, customRole: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 ml-2">Tech Stack Layering</label>
                      <div className="flex flex-wrap gap-2 p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem]">
                        {suggestedSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                              form.skills.includes(skill)
                                ? "bg-pink-600 text-white"
                                : "bg-white/5 text-gray-500 hover:bg-white/10"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          placeholder="Add specialized skill..."
                          className="flex-1 bg-black/40 border border-white/10 p-4 rounded-[1.2rem] text-sm outline-none focus:border-pink-500/50"
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                        />
                        <button 
                          onClick={addCustomSkill}
                          className="px-6 bg-white/5 border border-white/10 rounded-[1.2rem] hover:bg-pink-500 transition-all"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {form.skills.map((skill) => (
                          <span key={skill} className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-300">
                            {skill}
                            <X size={14} className="cursor-pointer hover:text-white" onClick={() => toggleSkill(skill)} />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <input placeholder="Github URL" className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-sm" value={form.github} onChange={(e) => setForm({...form, github: e.target.value})} />
                       <input placeholder="LeetCode URL" className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-sm" value={form.leetcode} onChange={(e) => setForm({...form, leetcode: e.target.value})} />
                       <input placeholder="GFG URL" className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-sm" value={form.gfg} onChange={(e) => setForm({...form, gfg: e.target.value})} />
                       <input placeholder="Codeforces URL" className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-sm" value={form.codeforces} onChange={(e) => setForm({...form, codeforces: e.target.value})} />
                    </div>

                    <button onClick={updateProfile} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3">
                      <Save size={20} /> SYNC CORE DATA
                    </button>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 group">
                      <MessageSquare className="text-pink-500 mb-6 group-hover:scale-110 transition-transform" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Mission Parameters</h3>
                      <p className="text-xl leading-relaxed text-slate-300 font-light italic">
                        "{profile?.bio || "No mission parameters defined."}"
                      </p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 flex items-center gap-2">
                        <Code size={16} className="text-indigo-400" /> Mastered Tech Stack
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {profile?.skills?.map((s, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-center hover:border-pink-500/30 transition-all">
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                <Trophy className="absolute right-[-10px] top-[-10px] text-white/10 -rotate-12" size={160} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Intelligence Nodes</h3>
                  <div className="space-y-3">
                    <ProfileLink label="GitHub" url={profile?.github} />
                    <ProfileLink label="LeetCode" url={profile?.codingProfiles?.leetcode} />
                    <ProfileLink label="GFG" url={profile?.codingProfiles?.gfg} />
                    <ProfileLink label="Codeforces" url={profile?.codingProfiles?.codeforces} />
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xl font-bold text-white">Active Operational</span>
                </div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Rank</p>
                <span className="text-xl font-bold text-pink-500 uppercase">Elite Operative</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProfileLink = ({ label, url }) => {
  const isLinked = url && url.trim() !== "";
  
  return (
    <div
      className={`flex items-center justify-between p-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all group ${
        isLinked ? "hover:border-white/40 cursor-pointer" : "opacity-50 cursor-not-allowed"
      }`}
      onClick={() => isLinked && window.open(url, "_blank")}
    >
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</span>
        <span className={`text-sm font-bold ${isLinked ? "text-white/90" : "text-white/40"}`}>
          {isLinked ? label : "No profile linked"}
        </span>
      </div>
      {isLinked ? (
        <ChevronRight size={14} className="text-white/40 group-hover:translate-x-1 transition-all" />
      ) : (
        <X size={14} className="text-white/20" />
      )}
    </div>
  );
};

export default Profile;