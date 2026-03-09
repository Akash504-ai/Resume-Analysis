"use client";

import React, { useEffect, useState } from "react";
import { Mail, Github, Target, Code, Link2 } from "lucide-react";
import Sidebar from "../layouts/sidebar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    targetRole: "",
    github: "",
    skills: "",
    leetcode: "",
    gfg: "",
    codeforces: "",
    codechef: "",
  });

  /* ---------------- FETCH PROFILE ---------------- */

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/profile/me", {
        credentials: "include",
      });

      const data = await res.json();

      setProfile(data?.profile || null);
      setUser(data?.user || null);

      if (data?.profile) {
        setForm({
          bio: data.profile.bio || "",
          targetRole: data.profile.targetRole || "",
          github: data.profile.github || "",
          skills: data.profile.skills?.join(",") || "",
          leetcode: data.profile.codingProfiles?.leetcode || "",
          gfg: data.profile.codingProfiles?.gfg || "",
          codeforces: data.profile.codingProfiles?.codeforces || "",
          codechef: data.profile.codingProfiles?.codechef || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- UPDATE PROFILE ---------------- */

  const updateProfile = async () => {
    try {
      const body = {
        bio: form.bio,
        targetRole: form.targetRole,
        github: form.github,
        skills: form.skills.split(",").map((s) => s.trim()),
        codingProfiles: {
          leetcode: form.leetcode,
          gfg: form.gfg,
          codeforces: form.codeforces,
          codechef: form.codechef,
        },
      };

      const res = await fetch("http://localhost:3000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      setProfile(data);
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="flex min-h-screen bg-[#02000d] text-slate-200">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="flex-1 ml-20 md:ml-64 p-10">
        <div className="max-w-5xl mx-auto">

          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-10 backdrop-blur-3xl shadow-2xl">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">

              <img
                src={
                  profile?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-32 h-32 rounded-2xl border border-white/10"
              />

              <div>
                <h1 className="text-3xl font-black text-white">
                  {user?.username}
                </h1>

                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <Mail size={16} />
                  {user?.email}
                </div>

                <button
                  onClick={() => setEditing(!editing)}
                  className="mt-4 px-5 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-sm font-bold"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>

                {profile?.bio && (
                  <p className="text-gray-400 mt-4 text-sm max-w-lg">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* EDIT FORM */}

            {editing && (
              <div className="space-y-4 mb-10">

                <input
                  placeholder="Bio"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                />

                <input
                  placeholder="Target Role"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.targetRole}
                  onChange={(e) =>
                    setForm({ ...form, targetRole: e.target.value })
                  }
                />

                <input
                  placeholder="Github"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.github}
                  onChange={(e) =>
                    setForm({ ...form, github: e.target.value })
                  }
                />

                <input
                  placeholder="Skills (React, Node, Python)"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.skills}
                  onChange={(e) =>
                    setForm({ ...form, skills: e.target.value })
                  }
                />

                <input
                  placeholder="Leetcode"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.leetcode}
                  onChange={(e) =>
                    setForm({ ...form, leetcode: e.target.value })
                  }
                />

                <input
                  placeholder="GeeksForGeeks"
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-lg"
                  value={form.gfg}
                  onChange={(e) =>
                    setForm({ ...form, gfg: e.target.value })
                  }
                />

                <button
                  onClick={updateProfile}
                  className="px-6 py-2 bg-indigo-600 rounded-lg font-bold"
                >
                  Save Profile
                </button>

              </div>
            )}

            {/* INFO GRID */}

            <div className="grid md:grid-cols-2 gap-10">

              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-pink-500 mb-3">
                  <Target size={18} />
                  Target Role
                </div>
                <p>{profile?.targetRole || "Not specified"}</p>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center gap-2 text-indigo-400 mb-3">
                  <Github size={18} />
                  Github
                </div>

                {profile?.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    className="text-pink-400"
                  >
                    {profile.github}
                  </a>
                ) : (
                  "Not linked"
                )}
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl md:col-span-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-4">
                  <Code size={18} />
                  Skills
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length > 0
                    ? profile.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400"
                        >
                          {s}
                        </span>
                      ))
                    : "No skills added"}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl md:col-span-2">
                <div className="flex items-center gap-2 text-pink-500 mb-4">
                  <Link2 size={18} />
                  Coding Profiles
                </div>

                {profile?.codingProfiles?.leetcode && (
                  <div>{profile.codingProfiles.leetcode}</div>
                )}
                {profile?.codingProfiles?.gfg && (
                  <div>{profile.codingProfiles.gfg}</div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;