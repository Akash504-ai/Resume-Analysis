"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Brain, Rocket, ChevronRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-pink-500" />,
      title: "Data Ingestion",
      description:
        "Upload your resume in PDF format. Our system securely parses your experience and technical stack.",
      gradient: "from-pink-500/20",
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: "Neural Analysis",
      description:
        "Our proprietary ML models compare your profile against 50k+ live job descriptions and industry benchmarks.",
      gradient: "from-purple-500/20",
    },
    {
      icon: <Rocket className="w-8 h-8 text-indigo-500" />,
      title: "Strategic Output",
      description:
        "Generate a high-precision interview roadmap, including targeted skill improvements and personalized talking points.",
      gradient: "from-indigo-500/20",
    },
  ];

  return (
    <section className="w-full py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
          >
            The Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Workflow</span>
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            A three-stage automated pipeline designed to transform your application data into a winning interview strategy.
          </p>
        </div>

        {/* Workflow Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 -translate-y-12 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group z-10"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-lg bg-[#030014] border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-xl z-20 group-hover:border-pink-500/50 transition-colors">
                0{i + 1}
              </div>

              {/* Card Content */}
              <div className="relative h-full p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 backdrop-blur-sm overflow-hidden group-hover:border-white/20 transition-all duration-500">
                
                {/* Glow Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon Box */}
                  <div className="w-16 h-16 rounded-2xl bg-[#030014] border border-white/10 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>

                  <h3 className="text-white text-2xl font-bold mb-4 tracking-tight flex items-center gap-2">
                    {step.title}
                    {i < 2 && (
                      <ChevronRight className="hidden lg:block w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                    )}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}