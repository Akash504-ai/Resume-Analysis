"use client";

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { AnimatedTooltip } from "../../components/ui/animated-tooltip";
import { useAuth } from "../features/auth/hooks/useAuth";
import { WorldMap } from "../../components/ui/world-map";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=300&q=80",
  },
];

// Moving Counter outside to prevent re-declaration errors
const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
  const suffix = value.replace(/[\d.]/g, "");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Intl.NumberFormat("en-US").format(Math.floor(latest)) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // FIX: Defining the missing stats array
  const stats = [
    { val: "99.2%", label: "ML Precision", color: "from-pink-500" },
    { val: "10k+", label: "Plans Built", color: "from-purple-500" },
    { val: "24/7", label: "Real-time GenAI", color: "from-indigo-500" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const handleStartAnalysis = () => {
    user ? navigate("/dashboard") : navigate("/register");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030014] selection:bg-pink-500/30 overflow-x-hidden flex flex-col items-center">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 w-full flex justify-between items-center px-6 py-8 max-w-7xl">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Nexus<span className="text-pink-500">.</span>
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600 rounded-full transition-all bg-white/5 backdrop-blur-sm"
        >
          Sign In
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20 text-center max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-[-50px]"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block p-[1px] rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500 animate-gradient-flow mb-10 shadow-[0_0_20px_rgba(219,39,119,0.2)]"
          >
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#030014] text-pink-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              ML-Powered Analysis Engine
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-8xl font-extrabold text-white tracking-tight mb-8 leading-[1.05] mt-[-15px]"
          >
            Master Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Interview Strategy
            </span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              <span className="text-white font-medium">
                Don't just apply—dominate.
              </span>{" "}
              Our neural networks analyze your resume against live job data.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
          >
            {/* START ANALYSIS BUTTON */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartAnalysis}
              className="group relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-indigo-600 text-white font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(219,39,119,0.35)] transition-all duration-300"
            >
              {/* glow background */}
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>

              {/* animated shine */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shine_1.2s_ease]" />
              </span>

              <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
                Start Analysis
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            {/* SIGN IN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="group relative w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-lg overflow-hidden transition-all duration-300 hover:border-pink-500/40 hover:bg-white/10"
            >
              {/* subtle glow */}
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></span>

              <span className="relative z-10 tracking-tight">Sign In</span>
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16"
          >
            <div className="flex flex-row items-center justify-center mt-[-15px]">
              <AnimatedTooltip items={people} />
            </div>

            <p className="text-gray-400 text-sm font-medium tracking-tight ml-2">
              Trusted by <span className="text-white font-bold">2,000+</span>{" "}
              experts from
              <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent font-bold ml-1">
                Top Tech Companies
              </span>
            </p>
          </motion.div>

          {/* World Map Section */}
          <section className="w-full py-24 flex flex-col items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center z-20 mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Global Career Connectivity
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
                Students across the world are preparing smarter interview
                strategies using Nexus AI.
              </p>
            </motion.div>

            {/* The Map now spans width and melts into background */}
            <div className="w-full max-w-7xl px-4">
              <WorldMap
                lineColor="#ec4899"
                dots={[
                  // North America → Europe
                  {
                    start: { lat: 40.7128, lng: -74.006 },
                    end: { lat: 51.5074, lng: -0.1278 },
                  }, // NYC → London

                  // North America → Asia
                  {
                    start: { lat: 37.7749, lng: -122.4194 },
                    end: { lat: 35.6762, lng: 139.6503 },
                  }, // SF → Tokyo

                  // Europe → India
                  {
                    start: { lat: 48.8566, lng: 2.3522 },
                    end: { lat: 28.6139, lng: 77.209 },
                  }, // Paris → Delhi

                  // India → Australia
                  {
                    start: { lat: 19.076, lng: 72.8777 },
                    end: { lat: -33.8688, lng: 151.2093 },
                  }, // Mumbai → Sydney

                  // Europe → Africa
                  {
                    start: { lat: 52.52, lng: 13.405 },
                    end: { lat: -1.2921, lng: 36.8219 },
                  }, // Berlin → Nairobi

                  // South America → Europe
                  {
                    start: { lat: -23.5505, lng: -46.6333 },
                    end: { lat: 41.9028, lng: 12.4964 },
                  }, // São Paulo → Rome

                  // Africa → Asia
                  {
                    start: { lat: 30.0444, lng: 31.2357 },
                    end: { lat: 1.3521, lng: 103.8198 },
                  }, // Cairo → Singapore

                  // Australia → USA
                  {
                    start: { lat: -33.8688, lng: 151.2093 },
                    end: { lat: 34.0522, lng: -118.2437 },
                  }, // Sydney → LA

                  // Japan → Canada
                  {
                    start: { lat: 35.6762, lng: 139.6503 },
                    end: { lat: 49.2827, lng: -123.1207 },
                  }, // Tokyo → Vancouver

                  // Middle East → Europe
                  {
                    start: { lat: 25.2048, lng: 55.2708 },
                    end: { lat: 40.4168, lng: -3.7038 },
                  }, // Dubai → Madrid
                ]}
              />
            </div>
          </section>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="w-full mt-16 pt-10 border-t border-white/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`relative flex flex-col items-center p-8 border-white/5 border-b sm:border-b-0 ${i === 0 ? "sm:border-r" : ""} ${i === 1 ? "md:border-r" : ""} ${i === 2 ? "sm:col-span-2 md:col-span-1 border-t sm:border-t-0" : ""}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${stat.color} to-transparent opacity-0 hover:opacity-5 transition-opacity duration-500`}
                  />
                  <div className="relative">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tighter inline-flex">
                      <Counter value={stat.val} />
                    </span>
                    <div
                      className={`absolute -right-4 top-1 w-2 h-2 rounded-full bg-gradient-to-r ${stat.color} to-white/0`}
                    />
                  </div>
                  <span className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
