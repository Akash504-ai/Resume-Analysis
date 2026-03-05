// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export function ContainerTextFlip({
//   words = ["Strategy", "Success", "Future", "Roadmap"],
//   interval = 3000,
//   className = "",
//   animationDuration = 700
// }) {
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [maxWidth, setMaxWidth] = useState(0);
//   const wordRefs = useRef([]);

//   useEffect(() => {
//     // Shrunk the buffer from 100 to 40 for a tighter fit
//     const widths = wordRefs.current.map(ref => ref?.scrollWidth || 0);
//     const maximum = Math.max(...widths);
//     setMaxWidth(maximum + 40); 
//   }, [words]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
//     }, interval);
//     return () => clearInterval(intervalId);
//   }, [words, interval]);

//   return (
//     <div className="relative inline-flex items-center justify-center align-middle">
//       {/* HIDDEN MEASUREMENT LAYER */}
//       <div className="absolute opacity-0 pointer-events-none whitespace-nowrap flex flex-col">
//         {words.map((word, i) => (
//           <span 
//             key={i} 
//             ref={el => wordRefs.current[i] = el} 
//             className="px-4 font-black tracking-tighter text-3xl md:text-7xl uppercase"
//           >
//             {word}
//           </span>
//         ))}
//       </div>

//       {/* VISIBLE ANIMATED CONTAINER */}
//       <motion.div
//         animate={{ width: maxWidth > 0 ? maxWidth : "auto" }}
//         transition={{ duration: 0.5, ease: "circOut" }}
//         // Tightened padding (px-2) and removed overflow-hidden
//         className={`relative inline-block rounded-xl py-1 md:py-1.5 text-center border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(219,39,119,0.1)] ${className}`}
//       >
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={words[currentWordIndex]}
//             className="inline-flex items-center justify-center whitespace-nowrap"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//           >
//             {words[currentWordIndex].split("").map((letter, index) => (
//               <motion.span
//                 key={`${words[currentWordIndex]}-${index}`}
//                 initial={{ opacity: 0, filter: "blur(8px)", y: 5 }}
//                 animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
//                 transition={{
//                   duration: 0.3,
//                   delay: index * 0.03,
//                 }}
//                 // Added mr-[-2px] (negative margin) to pull letters closer 
//                 // while pr-[4px] ensures the gradient doesn't clip.
//                 className="inline-block font-black tracking-tighter whitespace-pre bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pr-[4px] mr-[-2px]"
//                 style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
//               >
//                 {letter}
//               </motion.span>
//             ))}
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }