import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
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

  // Start analysis handler
  const handleStartAnalysis = () => {
    if (user) {
      navigate("/dashboard"); // user already logged in
    } else {
      navigate("/register"); // user not logged in
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden flex flex-col items-center justify-center px-4 md:px-6 py-12">
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-20">
  
  {/* Logo */}
  <div 
    onClick={() => navigate("/")}
    className="flex items-center gap-2 cursor-pointer"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center">
      <span className="text-white font-bold">N</span>
    </div>

    <span className="text-white font-black text-lg tracking-tight">
      Nexus<span className="text-pink-500">.</span>
    </span>
  </div>

  {/* Right actions */}
  <button
    onClick={() => navigate("/login")}
    className="text-sm font-semibold text-gray-300 hover:text-white"
  >
    Sign In
  </button>

</div>
      {/* --- BACKGROUND ELEMENTS (Motion Optimized) --- */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl text-center"
      >
        
        
        {/* --- MOVING BORDER BADGE (Framer Motion Hover) --- */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="inline-block p-[1.5px] rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500 bg-[length:200%_auto] animate-gradient-flow mb-8 shadow-[0_0_20px_rgba(219,39,119,0.3)]"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#030014] backdrop-blur-3xl text-pink-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            ML-Powered Analysis Engine
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tight mb-8 leading-[1.1]"
        >
          Master Your Next <br />
          <motion.span 
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] bg-clip-text"
          >
            Interview Strategy
          </motion.span>
        </motion.h1>

        {/* Description Block */}
        <motion.div variants={itemVariants} className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 blur-2xl opacity-50" />
          <p className="relative text-gray-400 text-lg md:text-xl leading-relaxed px-4 border-l-2 border-pink-500/30 md:border-l-0">
            <span className="text-white font-medium">Don't just apply—dominate.</span> Our neural networks analyze your resume against live job data to architect a high-performance roadmap tailored for your success.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, shadow: "0 0 40px rgba(219,39,119,0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartAnalysis}
            className="w-full sm:w-auto group relative px-10 py-4 rounded-xl bg-pink-600 text-white font-bold text-lg transition-all overflow-hidden"
          >
            <span className="relative z-10">Start Analysis</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-10 py-4 rounded-xl border border-gray-700 bg-gray-900/30 backdrop-blur-md text-white font-bold text-lg transition-all"
          >
            Sign In
          </motion.button>
        </motion.div>

        {/* Social Proof / Stats */}
        <motion.div 
          variants={itemVariants}
          className="mt-4 md:mt-7 pt-10 border-t border-gray-800/50 grid grid-cols-2 md:flex md:flex-wrap justify-center gap-8 md:gap-16 opacity-70"
        >
           {[
             { val: "99.2%", label: "ML Precision" },
             { val: "10k+", label: "Plans Built" },
             { val: "24/7", label: "Real-time GenAI" }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5, opacity: 1 }}
               className={`flex flex-col items-center ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
             >
                <span className="text-2xl md:text-3xl font-bold text-white tracking-tighter">{stat.val}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-semibold">{stat.label}</span>
             </motion.div>
           ))}
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 4s ease infinite;
        }
      `}</style>
    </div>
  );
}