"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { owner } from "@/lib/data";
import { useUI } from "./UIContext";

const LETTERS = owner.firstName.split(""); // ["S","H","I","V","A","M"]

/**
 * Boot sequence:
 * 1. Letters appear centered. Progress bar fills.
 * 2. At 100%, show Music/Doomscrolling Prompt.
 * 3. On interaction:
 *    a. Phase transitions to "burst".
 *    b. Letters fly to edges.
 *    c. White flash.
 *    d. onComplete fires.
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
  const { startAudio } = useUI();
  const [phase, setPhase] = useState<"hold" | "burst" | "flash" | "done">("hold");
  const [progress, setProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  
  // Using refs for timeouts so we can clear them if needed
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      
      const playBeep = (time: number, freq: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.05, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Serious industrial double-beep
      playBeep(audioCtx.currentTime, 120, 0.4); // Low thud
      playBeep(audioCtx.currentTime + 0.1, 880, 0.1); // High sharp alert
      playBeep(audioCtx.currentTime + 0.25, 880, 0.1); // Second sharp alert
    } catch (e) {
      console.warn("Alert sound blocked by browser", e);
    }
  };

  const handleEnter = () => {
    setShowEnterButton(false);
    setShowPrompt(true);
    playAlertSound();
  };

  const startTransitions = (withMusic: boolean) => {
    if (withMusic) startAudio();
    setShowPrompt(false);
    
    setPhase("burst");
    
    const t2 = setTimeout(() => setPhase("flash"), 500);
    const t3 = setTimeout(() => setPhase("done"), 600);
    const t4 = setTimeout(onComplete, 700);
    
    timeouts.current.push(t2, t3, t4);
  };

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 50);
      return () => clearTimeout(t);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowEnterButton(true);
          return 100;
        }
        const inc = Math.random() > 0.8 ? 2 : 1;
        return Math.min(prev + inc, 100);
      });
    }, 35);

    return () => {
      clearInterval(interval);
      timeouts.current.forEach(clearTimeout);
    };
  }, [onComplete, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
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
                  ? { 
                      x: 0, 
                      y: showEnterButton ? -120 : 0, // Move up if button is shown
                      opacity: 1 
                    }
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
      <AnimatePresence>
        {(phase === "hold" && !showEnterButton) && (
          <motion.div 
            key="loading-bar"
            className="absolute bottom-[15%] w-[280px] md:w-[400px] flex flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
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
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showEnterButton && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 100 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", y: 120 }}
            className="fixed inset-0 z-[105] flex items-center justify-center pointer-events-auto"
          >
            <button 
              onClick={handleEnter}
              className="group relative flex flex-col items-center gap-4 transition-all active:scale-[0.98]"
            >
              <div className="relative px-12 py-5 border border-paper/20 overflow-hidden">
                {/* Background sliding fill */}
                <div className="absolute inset-0 bg-paper/5 group-hover:bg-paper/10 transition-colors" />
                <motion.div 
                  className="absolute inset-0 bg-acid/20 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                
                <span className="relative z-10 mono text-[12px] md:text-[14px] text-paper font-bold uppercase tracking-[0.6em] group-hover:text-white transition-colors">
                  Initialize_System
                </span>
                
                {/* Decorative scanning line in button */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-[1px] bg-acid/40 z-20"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="h-px w-8 bg-paper/40" />
                 <span className="mono text-[9px] uppercase tracking-widest text-acid">Ready_to_deploy</span>
                 <div className="h-px w-8 bg-paper/40" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/90 backdrop-blur-sm pointer-events-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ 
                scale: 1, 
                y: 0,
                x: [0, -5, 5, -5, 5, 0], // Shake animation
              }}
              transition={{
                x: { duration: 0.4, delay: 0.2 },
                scale: { duration: 0.4 },
                y: { duration: 0.4 }
              }}
              className="max-w-[90vw] w-[400px] border border-paper/20 bg-ink p-8 flex flex-col gap-6 relative overflow-hidden"
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-acid" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-acid" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-acid" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-acid" />

              <div className="flex flex-col gap-2">
                <span className="mono text-[10px] text-acid tracking-[0.3em] uppercase">Security_Protocol_V4</span>
                <h2 className="brutal-heading text-3xl leading-none uppercase">Doomscrolling<br/>Detected</h2>
              </div>

              <p className="mono text-[11px] text-paper/60 leading-relaxed uppercase tracking-wider">
                This is a doomscrolling portfolio website. It is designed to be consumed endlessly. 
                <br/><br/>
                System recommends synchronized audio for optimal experience.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => startTransitions(true)}
                  className="group relative w-full h-12 bg-paper text-ink mono text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-acid hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] active:scale-[0.98]"
                >
                  <span className="relative z-10">Vibe With Music</span>
                </button>
                <button 
                  onClick={() => startTransitions(false)}
                  className="w-full h-12 border border-paper/20 text-paper/40 mono text-[10px] uppercase tracking-[0.2em] transition-all hover:border-paper/60 hover:text-paper active:scale-[0.98]"
                >
                  Enter in Silence
                </button>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-acid/30" />
                  ))}
                </div>
                <span className="mono text-[8px] text-paper/20 italic">v1.0.4_production_build</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
