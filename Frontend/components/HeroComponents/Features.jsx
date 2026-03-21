"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Brain,
  BarChart3,
  Target,
  Sparkles,
  Users,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI Resume Analysis",
      description: "Our machine learning engine analyzes your resume against real job descriptions to identify strengths and weaknesses instantly.",
      icon: <FileText className="h-6 w-6 text-pink-500" />,
      color: "from-pink-500/20",
    },
    {
      title: "Interview Strategy Generator",
      description: "Get a personalized interview preparation strategy tailored to the job role you are targeting.",
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      color: "from-purple-500/20",
    },
    {
      title: "ATS Optimization",
      description: "Improve your resume score and ensure your application passes Applicant Tracking Systems used by major companies.",
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      color: "from-indigo-500/20",
    },
    {
      title: "Skill Gap Detection",
      description: "Identify missing skills required for your dream role and receive actionable recommendations.",
      icon: <Target className="h-6 w-6 text-pink-500" />,
      color: "from-pink-500/20",
    },
    {
      title: "Real-time Job Insights",
      description: "Our system studies live job market data to help you understand what companies are looking for.",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      color: "from-purple-500/20",
    },
    {
      title: "Developer Community",
      description: "Collaborate with developers worldwide, share interview strategies, and grow together.",
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      color: "from-indigo-500/20",
    },
  ];

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-pink-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-400 text-xs font-bold uppercase tracking-widest"
          >
            Core Capabilities
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">AI Career Tools</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Nexus leverages proprietary neural networks to bridge the gap between your current profile and your dream role.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative p-8 rounded-3xl bg-[#030014]/50 border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20 shadow-2xl"
    >
      {/* Dynamic Gradient Background on Hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        feature.color,
        "to-transparent"
      )} />

      {/* Icon Container */}
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
        <div className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-50 transition-opacity">
          {feature.icon}
        </div>
        <span className="relative z-10">
          {feature.icon}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
          {feature.description}
        </p>
      </div>

      {/* Corner Accent Light */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/5 blur-2xl group-hover:bg-pink-500/10 transition-colors rounded-full" />
    </motion.div>
  );
};