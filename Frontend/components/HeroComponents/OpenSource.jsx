"use client";

import React from "react";
import { Github, Star, GitFork, Users, ArrowUpRight } from "lucide-react";

export default function OpenSource() {
  const stats = [
    {
      icon: <Star className="text-amber-400" size={22} />,
      label: "Stars",
      value: "1.2k+",
      borderColor: "group-hover:border-amber-500/50",
    },
    {
      icon: <GitFork className="text-indigo-400" size={22} />,
      label: "Forks",
      value: "150+",
      borderColor: "group-hover:border-indigo-500/50",
    },
    {
      icon: <Users className="text-emerald-400" size={22} />,
      label: "Contributors",
      value: "40+",
      borderColor: "group-hover:border-emerald-500/50",
    },
  ];

  return (
    <section className="w-full py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.2em]">
              Community Driven
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Built in Public. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              Open Source.
            </span>
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            Nexus AI is powered by the community. Join developers worldwide 
            architecting the future of recruitment.
          </p>
        </div>

        {/* Stats Grid - Enhanced with Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 transition-all duration-500 hover:-translate-y-2 ${stat.borderColor}`}
            >
              {/* Subtle inner glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-6">
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Github size={22} />
            Contribute on GitHub
            <ArrowUpRight size={18} className="text-black/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          
          <p className="text-zinc-500 text-sm font-medium">
            MIT Licensed • Documentation available on GitHub
          </p>
        </div>
      </div>
    </section>
  );
}