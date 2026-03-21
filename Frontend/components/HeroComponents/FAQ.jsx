"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      question: "How does Nexus analyze resumes?",
      answer:
        "Nexus uses machine learning models to compare your resume with real job descriptions and identify skill gaps, strengths, and improvement areas.",
    },
    {
      question: "Is my resume data secure?",
      answer:
        "Yes. Your uploaded data is encrypted and only used for generating analysis results. We never share your data with third parties.",
    },
    {
      question: "Is Nexus free to use?",
      answer:
        "Yes. Nexus currently provides free resume analysis and interview preparation tools while the platform is in development.",
    },
    {
      question: "Can developers contribute to the project?",
      answer:
        "Absolutely. Nexus is an open-source project. Developers can contribute through GitHub by submitting pull requests or reporting issues.",
    },
    {
      question: "Does Nexus support different tech roles?",
      answer:
        "Yes. The system supports multiple developer roles including frontend, backend, full-stack, and data-related positions.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full py-24 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
              <HelpCircle className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Queries</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about the Nexus ecosystem.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group border transition-all duration-300 rounded-2xl ${
                openIndex === index 
                ? "border-pink-500/30 bg-white/[0.05] shadow-[0_0_20px_rgba(236,72,153,0.05)]" 
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`font-semibold transition-colors duration-300 ${
                  openIndex === index ? "text-pink-400" : "text-white/90"
                }`}>
                  {faq.question}
                </span>

                <div className={`p-1 rounded-full transition-all duration-300 ${
                  openIndex === index ? "bg-pink-500/20 text-pink-400 rotate-180" : "bg-white/5 text-gray-500"
                }`}>
                  <ChevronDown size={18} />
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 text-base leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}