"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { owner } from "@/lib/data";

const LETTERS = owner.firstName.split(""); // ["S","H","I","V","A","M"]

/**
 * Boot sequence:
 * 1. Letters appear centered. 400ms hold.
 * 2. Letters fly to edges in random-ish directions.
 * 3. White flash (1 frame).
 * 4. onComplete fires — Hero picks up the layoutIds for a shared transition.
 */

// Final target offsets for each letter — px. Spread across the viewport edges.
const TARGETS = [
  { x: "-50vw", y: "-45vh" }, // S → top-left
  { x: "50vw", y: "-45vh" },  // H → top-right
  { x: "-50vw", y: "45vh" },  // I → bottom-left
  { x: "50vw", y: "45vh" },   // V → bottom-right
  { x: "-55vw", y: "0vh" },   // A → left
  { x: "55vw", y: "0vh" },    // M → right
];

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"hold" | "burst" | "flash" | "done">("hold");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      // Skip the entire sequence for reduced motion users.
      const t = setTimeout(onComplete, 50);
      return () => clearTimeout(t);
    }

    // Progress bar animation (4 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slightly random-ish progress for a "real" feel
        const inc = Math.random() > 0.8 ? 2 : 1;
        return Math.min(prev + inc, 100);
      });
    }, 35);

    const t1 = setTimeout(() => setPhase("burst"), 4300);
    const t2 = setTimeout(() => setPhase("flash"), 4800);
    const t3 = setTimeout(() => setPhase("done"), 4900);
    const t4 = setTimeout(onComplete, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ backgroundColor: "#050505" }}
      animate={{
        backgroundColor:
          phase === "flash" ? "#F0EDE6" : "#050505",
      }}
      transition={{ duration: 0.04 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-center">
        {LETTERS.map((letter, i) => {
          const target = TARGETS[i] ?? { x: "0vw", y: "0vh" };
          return (
            <motion.span
              key={`boot-${i}`}
              layoutId={`hero-letter-${i}`}
              className="brutal-heading text-paper inline-block"
              style={{
                fontSize: "8vw",
                lineHeight: 0.82,
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={
                phase === "hold"
                  ? { x: 0, y: 0, opacity: 1 }
                  : phase === "burst" || phase === "flash"
                    ? { x: target.x, y: target.y, opacity: 0.9 }
                    : { x: target.x, y: target.y, opacity: 0 }
              }
              transition={
                phase === "hold"
                  ? { duration: 0.3, delay: i * 0.04 }
                  : {
                      duration: 0.55,
                      ease: [0.76, 0, 0.24, 1],
                    }
              }
            >
              {letter}
            </motion.span>
          );
        })}
      </div>

      {/* Technical Loading Bar */}
      <motion.div 
        className="absolute bottom-[15%] w-[280px] md:w-[400px] flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase === "hold" ? 1 : 0, y: phase === "hold" ? 0 : -10 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="mono text-[7px] text-paper/30 tracking-[0.4em] uppercase">Boot_Sequence</span>
            <span className="mono text-[10px] text-paper/80 tracking-widest uppercase">Initializing_Shivam_OS</span>
          </div>
          <span className="mono text-[11px] text-acid font-bold">{progress}%</span>
        </div>

        <div className="h-1 w-full bg-paper/5 overflow-hidden relative border border-paper/10 p-[1px]">
          <motion.div 
            className="h-full bg-acid shadow-[0_0_10px_rgba(0,255,148,0.3)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-1.5 rounded-[1px] transition-colors duration-300 ${
                  i < (progress / 8) ? 'bg-acid/50' : 'bg-paper/5'
                }`} 
              />
            ))}
          </div>
          <span className="mono text-[8px] text-paper/20 tracking-tighter uppercase italic animate-pulse">
            {progress < 40 ? "Loading_Modules..." : progress < 80 ? "Syncing_Kernels..." : "Finalizing_Interface..."}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
