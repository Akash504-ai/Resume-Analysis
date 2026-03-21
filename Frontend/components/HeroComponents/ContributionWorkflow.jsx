"use client";

import React from "react";
import { GitFork, GitBranch, GitPullRequest, CheckCircle, ChevronRight } from "lucide-react";

export default function ContributionWorkflow() {
  const steps = [
    {
      icon: <GitFork className="w-6 h-6" />,
      title: "Fork the Repository",
      description: "Copy the Nexus AI codebase to your own GitHub account to start your journey.",
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-500/20",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Create a Branch",
      description: "Isolate your changes in a new branch. Keep the main branch clean and stable.",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: "Open a Pull Request",
      description: "Share your work with the maintainers. This kicks off the code review process.",
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-500/20",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Review & Merge",
      description: "Collaborate on feedback and get your code officially merged into Nexus AI.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Contribution <span className="text-gray-500 font-light italic text-3xl md:text-4xl">Roadmap</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Your path to becoming a Nexus AI contributor. We’ve streamlined 
              the process so you can focus on writing great code.
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <span className="text-xs font-mono text-gray-600 uppercase tracking-[0.3em]">
              Start Journey &bull;&bull;&bull;&bull; End
            </span>
          </div>
        </div>

        {/* Workflow Path */}
        <div className="relative">
          
          {/* Background Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="group flex flex-col items-center md:items-start">
                
                {/* Step Marker & Icon */}
                <div className="relative mb-8">
                  {/* Step Number Bubble */}
                  <div className={`absolute -top-3 -right-3 w-6 h-6 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 z-20 group-hover:border-white/40 transition-colors`}>
                    0{i + 1}
                  </div>
                  
                  {/* Main Icon Container */}
                  <div className={`relative z-10 p-5 rounded-2xl ${step.bgColor} border ${step.borderColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]`}>
                    <div className={step.color}>{step.icon}</div>
                  </div>

                  {/* Connecting Arrow (Desktop) */}
                  {i !== steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 -translate-y-1/2 text-white/5 group-hover:text-white/20 transition-colors">
                      <ChevronRight size={24} strokeWidth={1} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] md:max-w-none mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Progress Dot (Bottom) */}
                <div className="hidden md:block mt-8 w-2 h-2 rounded-full bg-white/5 group-hover:bg-white/40 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Connector Line (Visual only) */}
        <div className="md:hidden absolute left-[50%] top-48 bottom-24 w-px bg-gradient-to-b from-pink-500/20 via-purple-500/20 to-emerald-500/20 -translate-x-1/2" />
      </div>
    </section>
  );
}