"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Software Engineer",
    text: "Nexus helped me identify the exact skills I was missing for backend roles. The interview strategy feature is incredibly helpful.",
  },
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    text: "The AI resume analysis showed weaknesses in my resume that I never noticed before. It helped me prepare much better.",
  },
  {
    name: "Rahul Verma",
    role: "Full Stack Developer",
    text: "The job insights and resume scoring feature are amazing. Nexus gives a clear roadmap to improve your profile.",
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    text: "The most intuitive career tool I've used. The AI feedback is specific and actually actionable for senior roles.",
  },
  {
    name: "Michael Ross",
    role: "Data Scientist",
    text: "I appreciated how the system broke down live job market trends. It made my prep much more targeted.",
  },
];

export default function Testimonials() {
  // Double the array to create the infinite loop effect
  const scrollingTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="w-full py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Developers Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Developers around the world are using Nexus to improve their
            resumes and prepare smarter for interviews.
          </p>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="flex relative items-center">
        {/* Left & Right Gradients to fade the edges into the background */}
        <div className="absolute left-0 w-20 md:w-40 h-full bg-gradient-to-r from-[#030014] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 w-20 md:w-40 h-full bg-gradient-to-l from-[#030014] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 px-4"
          animate={{
            x: [0, -1800], // Adjust this value based on card width + gap
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40, // Increase for slower, calmer scroll
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {scrollingTestimonials.map((item, i) => (
            <div
              key={i}
              className="w-[350px] md:w-[400px] flex-shrink-0 p-8 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/20 transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-4 h-4 text-pink-500/80 fill-pink-500/80"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "{item.text}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600/20 to-indigo-600/20 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}