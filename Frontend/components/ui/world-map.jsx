"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import DottedMap from "dotted-map";

export function WorldMap({ dots = [], lineColor = "#ec4899" }) {
  const containerRef = useRef(null);
  // Trigger animation when the map is 30% visible
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  // IMPORTANT: Set backgroundColor to transparent to melt with your landing page
  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#FFFFFF55", // Subtler dots
    shape: "circle",
    backgroundColor: "transparent", 
  });

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 60;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-[2/1] font-sans overflow-visible">
      
      {/* 1. Deep Background Glow (Melts the map into the page) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08)_0%,transparent_70%)] blur-3xl" />

      {/* 2. Map Container (Removed card styling) */}
      <div className="relative h-full w-full">
        
        {/* Dotted World (Masked for soft edges) */}
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full opacity-50 
          [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_90%)]
          pointer-events-none select-none"
          alt="world map"
        />

        {/* 3. Animated Connections (Triggered by Scroll) */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full absolute inset-0 pointer-events-none select-none overflow-visible"
        >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
              <stop offset="50%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {dots.map((dot, i) => {
            const start = projectPoint(dot.start.lat, dot.start.lng);
            const end = projectPoint(dot.end.lat, dot.end.lng);

            return (
              <g key={`path-group-${i}`}>
                {/* Arc Path */}
                <motion.path
                  d={createCurvedPath(start, end)}
                  fill="none"
                  stroke="url(#path-gradient)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />

                {/* Start/End Points (Fade in with arc) */}
                <motion.circle
                  cx={start.x}
                  cy={start.y}
                  r="2"
                  fill={lineColor}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: i * 0.2 }}
                />
                
                <motion.circle
                  cx={end.x}
                  cy={end.y}
                  r="2"
                  fill={lineColor}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: (i * 0.2) + 1.5 }}
                />

                {/* Pulse Ripples */}
                {isInView && (
                  <g>
                    <circle cx={end.x} cy={end.y} r="2" fill={lineColor} opacity="0.6">
                      <animate attributeName="r" from="2" to="8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}