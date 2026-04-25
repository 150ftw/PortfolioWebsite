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

  useEffect(() => {
    if (reduced) {
      // Skip the entire sequence for reduced motion users.
      const t = setTimeout(onComplete, 50);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setPhase("burst"), 400);
    const t2 = setTimeout(() => setPhase("flash"), 1050);
    const t3 = setTimeout(() => setPhase("done"), 1120);
    const t4 = setTimeout(onComplete, 1180);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
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
    </motion.div>
  );
}
