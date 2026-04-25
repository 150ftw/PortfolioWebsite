"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { owner, stats, terminalLines } from "@/lib/data";
import { Github } from "lucide-react";

/**
 * About — horizontal scroll inside a vertical scroll trigger.
 *
 *  On desktop: GSAP pins the outer section and translates the inner
 *  track horizontally as the user scrolls vertically.
 *
 *  On mobile/reduced-motion: falls back to vertical stacked panels.
 */

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const terminalInView = useRef<HTMLDivElement | null>(null);
  const inView = useInView(terminalInView, { once: true, amount: 0.4 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Feature-detect once.
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setIsDesktop(desktop && !reduced);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        // Total panels = 3. Scroll distance = 2 viewports.
        const panels = 3;
        
        gsap.to(track, {
          x: () => -(window.innerWidth * (panels - 1)),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: true,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
          },
        });

        const handleLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", handleLoad);
        // Clean up inside context revert or similar if needed, 
        // but easier to manage as a one-off here.
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [isDesktop]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-50 bg-ink"
      style={{ height: isDesktop ? "300vh" : "auto" }}
    >
      {/* Sticky viewport container */}
      <div className={isDesktop ? "sticky top-0 h-[100svh] w-full overflow-hidden bg-ink" : "relative"}>
        {/* The horizontal track */}
        <div
          ref={trackRef}
          className={
            isDesktop
              ? "relative flex h-[100svh] w-max flex-nowrap will-change-transform bg-ink"
              : "relative flex flex-col bg-ink"
          }
        >
        <div
          className={`about-panel relative flex flex-col justify-center bg-paper text-ink overflow-hidden shrink-0 ${isDesktop ? "h-[100svh] w-screen px-[6vw]" : "min-h-[90vh] px-6 py-24"
            }`}
        >
          <BlueprintBackground />
          
          <div className="relative z-10 brutal-heading text-ink" style={{ fontSize: "clamp(3rem, 15vw, 18rem)", lineHeight: 0.85 }}>
            <motion.div 
              data-reveal 
              initial={{ opacity: 0, x: -40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, ease: "circOut" }}
              className="flex items-baseline gap-4"
            >
              <span>I BUILD</span>
              <span className="ui-label text-[10px] text-ink/30 tracking-[0.5em] mb-2 hidden md:inline">TYPE: FOUNDATIONAL_PHILOSOPHY</span>
            </motion.div>
            
            <motion.div 
              data-reveal 
              initial={{ opacity: 0, x: -40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
            >
              THINGS THAT
            </motion.div>
            
            <motion.div
              data-reveal
              className="text-acid relative inline-block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
              style={{ WebkitTextStroke: "1px #050505" }}
            >
              MATTER.
              <motion.div 
                className="absolute -right-12 top-1/2 -translate-y-1/2 h-px w-24 bg-ink/20 hidden md:block"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
          </div>

          {/* HUD Metadata */}
          <div className="absolute top-12 left-[6vw] flex gap-12 hidden md:flex">
            <div className="flex flex-col gap-1">
              <span className="ui-label text-[9px] text-ink/40 uppercase">Viewport_Coord</span>
              <DynamicCoord />
            </div>
            <div className="flex flex-col gap-1">
              <span className="ui-label text-[9px] text-ink/40 uppercase">Module_ID</span>
              <span className="mono text-[10px] text-ink/60">PHILO_01_ALPHA</span>
            </div>
          </div>

          <div className="ui-label absolute bottom-8 left-[6vw] text-ink/50" data-reveal>
            / 01 · PHILOSOPHY
          </div>

          {/* Right side status block */}
          <div className="absolute right-[6vw] bottom-8 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-acid animate-pulse" />
              <span className="ui-label text-[10px] text-ink/40 tracking-widest uppercase italic">Logic_Stream_Active</span>
            </div>
          </div>
        </div>

        <div
          className={`about-panel relative flex flex-col bg-ink text-paper shrink-0 ${isDesktop
            ? "h-[100svh] w-screen flex-row items-center px-[6vw] py-20"
            : "min-h-[90vh] px-6 py-24"
            }`}
        >
          {/* Diagonal rule — desktop only */}
          {isDesktop && (
            <div
              className="absolute left-0 top-1/2 h-px w-[140%] origin-left rotate-[-22deg] bg-paper/20"
              aria-hidden
            />
          )}

          {/* Bio */}
          <div className={isDesktop ? "w-1/2 pr-12" : "mb-16"}>
            <p className="ui-label mb-6 text-paper/50" data-reveal>
              / 02 · BIO
            </p>
            <p
              className="editorial italic leading-[1.55] text-paper"
              style={{ fontSize: isDesktop ? "1.6rem" : "1.3rem" }}
              data-reveal
            >
              <span className="text-acid">Co-founder</span>, builder, and
              product-minded engineer based out of {owner.location}. My work
              sits at the seam where finance meets machine intelligence — RAG
              pipelines that reason over market data, retrieval systems that
              turn raw filings into decisions, and interfaces that make it all
              feel inevitable.
            </p>
          </div>

          {/* Stats */}
          <div className={isDesktop ? "grid w-1/2 grid-cols-2 gap-8 relative z-10" : "grid grid-cols-2 gap-6 relative z-10"}>
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-paper/20 pt-4 group hover:border-acid/50 transition-colors duration-500" data-reveal>
                <div className="flex justify-between items-start mb-2">
                   <div className="ui-label text-[8px] text-paper/30 tracking-[0.3em]">METRIC_NODE</div>
                   <div className="h-1 w-1 rounded-full bg-paper/20 group-hover:bg-acid transition-colors" />
                </div>
                <div
                  className="brutal-heading leading-none text-paper group-hover:text-acid transition-colors"
                  style={{ fontSize: isDesktop ? "10vw" : "18vw" }}
                >
                  {stat.value}
                </div>
                <div className="ui-label mt-3 text-paper/50 group-hover:text-paper transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Corner metadata for Panel 2 */}
          <div className="absolute top-12 right-[6vw] hidden md:block opacity-30 select-none">
            <span className="mono text-[9px] text-paper/40 tracking-[0.5em] uppercase">Phase_02 // BIOSCAN_READY</span>
          </div>
        </div>

        <div
          className={`about-panel relative flex flex-col justify-center bg-ink text-paper shrink-0 ${isDesktop ? "h-[100svh] w-screen px-[6vw]" : "min-h-[90vh] px-6 py-24"
            }`}
        >
          <p className="ui-label mb-8 text-paper/50" data-reveal>
            / 03 · SYSTEM STATUS
          </p>

          <div className="relative z-10 grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
            {/* Row 1: Terminal + Activity */}
            <div className="lg:col-span-8">
              <div
                ref={terminalInView}
                className="mac-chrome h-full w-full"
                data-reveal
              >
                <div className="mac-chrome-bar">
                  <span className="mac-dot red" />
                  <span className="mac-dot yellow" />
                  <span className="mac-dot green" />
                  <span className="ml-3 mono text-[11px] text-paper/50">
                    shivam@portfolio — zsh — 80×24
                  </span>
                </div>
                <TerminalBlock play={inView} />
              </div>
            </div>

            <div className="lg:col-span-4">
              <GithubActivity inView={inView} isDesktop={isDesktop} />
            </div>

            {/* Row 2: Inference + Metrics + Clock + Projects */}
            <div className="lg:col-span-3">
              <InferenceLog inView={inView} />
            </div>

            <div className="lg:col-span-3">
              <SystemMetrics inView={inView} />
            </div>

            <div className="lg:col-span-3">
              <ActiveProjects inView={inView} />
            </div>

            <div className="lg:col-span-3 flex flex-col gap-6">
              <LocationClock inView={inView} />
              <SocialNodes inView={inView} />
            </div>
          </div>

          {/* Global Section Elements */}
          <SystemSidebar />
          <TechMarquee inView={inView} />
          <SectionMarkers />
        </div>
      </div>
    </div>
  </section>
);
}

function SectionMarkers() {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
       <div className="absolute top-0 left-0 w-full h-[1px] bg-paper/10" />
       <div className="absolute bottom-0 left-0 w-full h-[1px] bg-paper/10" />
       {/* Small tick markers along the edges */}
       {[...Array(10)].map((_, i) => (
         <div key={i} className="absolute top-0 h-2 w-px bg-paper/20" style={{ left: `${i * 10}%` }} />
       ))}
    </div>
  );
}

function DynamicCoord() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <span className="mono text-[10px] text-ink/60">
      X:{coords.x.toString().padStart(4, "0")} Y:{coords.y.toString().padStart(4, "0")}
    </span>
  );
}

function BlueprintBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      {/* 40px Grid */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(5, 5, 5, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(5, 5, 5, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Grid Pulse Points */}
      <div className="absolute inset-0 hidden md:block">
         {[...Array(8)].map((_, i) => (
           <motion.div 
             key={i}
             className="absolute h-1 w-1 bg-acid/20 rounded-full"
             style={{ top: `${15 + i * 12}%`, left: `${8 + i * 14}%` }}
             animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 2, 1] }}
             transition={{ duration: 4, delay: i * 0.4, repeat: Infinity }}
           />
         ))}
      </div>

      {/* Diagonal Watermark Coordinates */}
      <div className="absolute left-[-10%] top-[30%] rotate-[-35deg] select-none opacity-[0.03] hidden xl:block">
        <span className="brutal-heading text-[12vw] whitespace-nowrap tracking-tighter">COORD_DATA_28.4595_77.0266</span>
      </div>

      {/* Large background number */}
      <div className="absolute -right-[5vw] -top-[5vw] brutal-heading text-[30vw] text-ink/[0.03] leading-none select-none">
        01
      </div>

      {/* Scanning Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-acid/40 to-transparent z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Corner Markers */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-ink/10" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-ink/10" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-ink/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-ink/10" />

      {/* Technical Labels */}
      <div className="absolute top-[15%] right-12 hidden lg:flex flex-col gap-1 opacity-20">
         <span className="mono text-[8px] uppercase tracking-widest">Spec_Alpha_v1.0.4</span>
         <div className="h-px w-16 bg-ink" />
      </div>
      <div className="absolute bottom-[15%] left-12 hidden lg:flex flex-col gap-1 opacity-20">
         <span className="mono text-[8px] uppercase tracking-widest">Module_Verified_Secure</span>
         <div className="h-px w-16 bg-ink" />
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-[15vw] top-0 bottom-0 w-px bg-ink/[0.03]" />
      <div className="absolute right-[15vw] top-0 bottom-0 w-px bg-ink/[0.03]" />
    </div>
  );
}

function TerminalBlock({ play }: { play: boolean }) {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{ prompt: string; output: string | string[] }[]>([]);
  const [currentAutoType, setCurrentAutoType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isInteractive, setIsInteractive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentAutoType, userInput]);

  useEffect(() => {
    if (!play || isInteractive) return;
    if (step >= terminalLines.length) {
      setTimeout(() => setIsInteractive(true), 500);
      return;
    }

    const line = terminalLines[step];
    let i = 0;
    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      i += 1;
      setCurrentAutoType(line.prompt.slice(0, i));
      if (i >= line.prompt.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (cancelled) return;
          setHistory((prev) => [...prev, line]);
          setCurrentAutoType("");
          setStep((s) => s + 1);
        }, 300);
      }
    }, 30);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [play, step, isInteractive]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = userInput.trim().toLowerCase();
    const originalInput = userInput;
    setUserInput("");

    if (!cmd) return;

    let response: string | string[] = "";

    switch (cmd) {
      case "help":
        response = [
          "AVAILABLE_COMMANDS:",
          " - ls: List virtual files",
          " - cat [file]: View file content",
          " - whoami: Display user bio",
          " - clear: Clear terminal history",
          " - contact: Get contact details",
          " - help: Show this menu"
        ];
        break;
      case "ls":
        response = "projects.md  stack.txt  mission.env  resume.pdf  contact.json";
        break;
      case "cat stack.txt":
        response = "TECH_STACK: React, Next.js, TypeScript, Node.js, MongoDB, Docker, AWS, RAG, Web3";
        break;
      case "cat mission.env":
        response = "MISSION: Democratizing financial intelligence through agentic AI.";
        break;
      case "cat projects.md":
        response = "PROJECTS: CalmSphere, EcoInsight, Solar-3D, AcademiQ. (See section 02 for details)";
        break;
      case "cat resume.pdf":
      case "open resume.pdf":
        response = "ACCESSING_STORAGE: [Click to view resume](https://drive.google.com/file/d/1titvNBBECHSbFHTQVI7mnvXloDjLPene/view?usp=sharing)";
        break;
      case "whoami":
        response = "SHIVAM_SHARMA: Full-Stack Developer & AI Builder. Co-founder @ EcoInsight.AI.";
        break;
      case "clear":
        setHistory([]);
        return;
      case "contact":
        response = "EMAIL: ss18244646@gmail.com | Instagram: @shiv_mmm";
        break;
      default:
        response = `Command not found: ${cmd}. Type 'help' for options.`;
    }

    setHistory((prev) => [...prev, { prompt: `shivam@portfolio ~ $ ${originalInput}`, output: response }]);
  };

  const renderText = (text: string) => {
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(mdLinkRegex);

    if (parts.length > 1) {
      const result = [];
      for (let i = 0; i < parts.length; i += 3) {
        result.push(parts[i]);
        if (i + 1 < parts.length) {
          result.push(
            <a
              key={i}
              href={parts[i + 2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-acid hover:text-white transition-all"
            >
              {parts[i + 1]}
            </a>
          );
        }
      }
      return result;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlParts = text.split(urlRegex);
    return urlParts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-acid hover:text-white transition-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div
      ref={scrollRef}
      className="mono h-[280px] overflow-y-auto px-6 py-5 text-[13px] leading-relaxed text-paper scrollbar-hide cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="mb-3">
          <div className="text-paper/70">{line.prompt}</div>
          {Array.isArray(line.output) ? (
            <div className="pl-3 space-y-0.5 mt-1">
              {line.output.map((out, j) => (
                <div key={j} className="text-acid">&gt; {renderText(out)}</div>
              ))}
            </div>
          ) : (
            <div className="pl-3 text-acid mt-0.5">&gt; {renderText(line.output)}</div>
          )}
        </div>
      ))}

      {!isInteractive ? (
        <div className="text-paper/70">
          {currentAutoType}
          <span className="ml-0.5 inline-block h-3 w-[7px] -translate-y-[1px] bg-acid align-middle animate-blink" />
        </div>
      ) : (
        <form onSubmit={handleCommand} className="flex items-center text-paper/70">
          <span className="mr-2 shrink-0">shivam@portfolio ~ $</span>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow bg-transparent outline-none caret-acid min-w-0"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      )}
    </div>
  );
}

function GithubActivity({ inView, isDesktop }: { inView: boolean; isDesktop: boolean }) {
  const [data, setData] = useState<{ contributions: any[][]; total: number } | null>(null);

  useEffect(() => {
    fetch("https://github-contributions-api.deno.dev/150ftw.json")
      .then((res) => res.json())
      .then((json) => {
        setData({
          contributions: json.contributions,
          total: json.totalContributions,
        });
      })
      .catch((err) => console.error("GitHub fetch failed:", err));
  }, []);

  const weeksToShow = isDesktop ? 18 : 12;

  const displayWeeks = data
    ? data.contributions.slice(-weeksToShow)
    : Array.from({ length: weeksToShow }).map(() =>
      Array.from({ length: 7 }).map(() => ({ contributionLevel: "NONE" }))
    );

  const getOpacity = (level: string) => {
    switch (level) {
      case "FIRST_QUARTILE": return 0.3;
      case "SECOND_QUARTILE": return 0.6;
      case "THIRD_QUARTILE": return 0.8;
      case "FOURTH_QUARTILE": return 1;
      default: return 0.05;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mac-chrome w-full max-w-[340px] p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github size={14} className="text-paper/40" />
          <span className="ui-label text-[10px] text-paper/40 tracking-widest uppercase">150ftw_activity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
          <span className="mono text-[9px] text-acid uppercase tracking-tighter">Live_Sync</span>
        </div>
      </div>

      <div className="flex gap-[3.5px]">
        {displayWeeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3.5px]">
            {week.map((day: any, d: number) => (
              <div
                key={d}
                className="h-[10px] w-[10px] rounded-[1px]"
                style={{
                  backgroundColor: day.contributionLevel === "NONE" ? "rgba(240,237,230,0.05)" : "var(--acid)",
                  opacity: getOpacity(day.contributionLevel),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-paper/10 pt-4">
        <div>
          <div className="mono text-[22px] font-bold leading-none text-paper tracking-tight">
            {data ? data.total.toLocaleString() : "---"}
          </div>
          <div className="ui-label mt-1 text-[9px] text-paper/40">TOTAL_COMMITS_LTM</div>
        </div>
        <div className="text-right">
          <div className="ui-label text-[9px] text-acid uppercase">Rank_Alpha</div>
          <div className="ui-label mt-1 text-[9px] text-paper/40 uppercase">Dev_Status</div>
        </div>
      </div>
    </motion.div>
  );
}

function SystemMetrics({ inView }: { inView: boolean }) {
  const metrics = [
    { label: "CPU_USAGE", value: 42, color: "var(--acid)" },
    { label: "MEM_LOAD", value: 68, color: "var(--acid)" },
    { label: "NET_STABILITY", value: 94, color: "var(--acid)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mac-chrome p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="ui-label text-[10px] text-paper/40 tracking-widest uppercase">System_Metrics</span>
        <span className="mono text-[9px] text-acid">0.4ms_Latency</span>
      </div>
      <div className="space-y-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="mb-1.5 flex justify-between">
              <span className="mono text-[10px] text-paper/60">{m.label}</span>
              <span className="mono text-[10px] text-paper/60">{m.value}%</span>
            </div>
            <div className="h-1 w-full bg-paper/5">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${m.value}%` } : {}}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.8 }}
                className="h-full"
                style={{ backgroundColor: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LocationClock({ inView }: { inView: boolean }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mac-chrome p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="ui-label text-[10px] text-paper/40 tracking-widest uppercase">Loc_Time</span>
        <span className="mono text-[9px] text-acid">UTC_+5:30</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mono text-[32px] font-bold leading-none text-paper tracking-tighter">
          {time || "00:00:00"}
        </div>
        <div className="mt-2 flex flex-col gap-0.5">
          <div className="mono text-[11px] text-paper/60 uppercase">Gurugram, India</div>
          <div className="mono text-[10px] text-paper/40">28.4595° N, 77.0266° E</div>
        </div>
      </div>
    </motion.div>
  );
}

function SocialNodes({ inView }: { inView: boolean }) {
  const socials = [
    { name: "GitHub", handle: "@150ftw", href: owner.github },
    { name: "LinkedIn", handle: "/shivam-sharma", href: owner.linkedin },
    { name: "Discord", handle: "@shivam", href: owner.discord },
    { name: "Instagram", handle: "@shiv_mmm", href: owner.instagram },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="mac-chrome flex-grow p-4 bg-acid/5 border-acid/20"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="ui-label text-[9px] text-acid tracking-widest uppercase font-bold">External_Uplinks</span>
      </div>
      <div className="space-y-2">
        {socials.map((s) => (
          <a 
            key={s.name} 
            href={s.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-between items-center group cursor-pointer border-b border-acid/5 pb-1 last:border-0 hover:bg-acid/10 transition-all px-1 rounded-sm"
          >
            <span className="mono text-[10px] text-acid/60">{s.name}</span>
            <span className="mono text-[10px] text-paper/80 group-hover:text-acid transition-colors">{s.handle}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function SystemSidebar() {
  return (
    <>
      <div className="hidden lg:flex absolute left-4 top-0 bottom-0 flex-col items-center justify-center gap-12 opacity-20 pointer-events-none z-20">
        <div className="flex flex-col items-center gap-6">
          <span className="mono text-[8px] uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180">System_Core_V1.0_Stable</span>
          <div className="h-48 w-[1px] bg-paper/20" />
          <span className="mono text-[8px] uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180">Node_SHVM_01</span>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-4 top-0 bottom-0 flex-col items-center justify-center gap-12 opacity-20 pointer-events-none z-20">
        <div className="flex flex-col items-center gap-6">
          <span className="mono text-[8px] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">AI_Inference_Active</span>
          <div className="h-48 w-[1px] bg-paper/20" />
          <span className="mono text-[8px] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">Frame_Buffer_Synced</span>
        </div>
      </div>
    </>
  );
}

function TechMarquee({ inView }: { inView: boolean }) {
  const techs = ["NEXT.JS", "TYPESCRIPT", "PYTHON", "SOLIDITY", "RAG", "DOCKER", "AWS", "MONGODB", "REACT", "TAILWIND"];

  return (
    <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center px-10"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-20">
              {techs.map((t) => (
                <span key={t} className="mono text-[11px] font-bold tracking-[0.4em]">{t}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function InferenceLog({ inView }: { inView: boolean }) {
  const logs = [
    "LOG: Model weights loaded.",
    "LOG: Context window set to 128k.",
    "THINK: Analyzing market sentiment...",
    "THINK: Retrieving SEC filings...",
    "LOG: RAG pipeline initialized.",
    "LOG: Inference step 04 complete.",
    "THINK: Cross-referencing price action...",
    "LOG: Confidence score: 0.94",
    "LOG: Thread-01 synced.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mac-chrome h-full p-4 overflow-hidden"
    >
      <div className="mb-3 flex items-center justify-between border-b border-paper/10 pb-2">
        <span className="ui-label text-[9px] text-paper/40 tracking-widest uppercase">AI_Inference_Log</span>
        <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
      </div>
      <div className="space-y-1.5">
        {logs.map((log, i) => (
          <div key={i} className="mono text-[10px] leading-tight text-paper/50">
            <span className={log.startsWith("THINK") ? "text-acid" : ""}>{log}</span>
          </div>
        ))}
        <div className="mono text-[10px] text-acid animate-pulse">_</div>
      </div>
    </motion.div>
  );
}

function ActiveProjects({ inView }: { inView: boolean }) {
  const projs = [
    { name: "EcoInsight", status: "LIVE", load: 72 },
    { name: "CalmSphere", status: "LIVE", load: 45 },
    { name: "Solar-3D", status: "LIVE", load: 28 },
    { name: "AcademiQ", status: "STAGING", load: 12 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mac-chrome h-full p-4"
    >
      <div className="mb-3 flex items-center justify-between border-b border-paper/10 pb-2">
        <span className="ui-label text-[9px] text-paper/40 tracking-widest uppercase">Active_Nodes</span>
        <span className="mono text-[9px] text-paper/40">v1.2.0</span>
      </div>
      <div className="space-y-3 mt-4">
        {projs.map((p) => (
          <div key={p.name} className="flex items-center justify-between">
            <div>
              <div className="mono text-[11px] text-paper font-bold">{p.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`h-1 w-1 rounded-full ${p.status === 'LIVE' ? 'bg-acid' : 'bg-paper/30'}`} />
                <span className="ui-label text-[8px] text-paper/40 uppercase">{p.status}</span>
              </div>
            </div>
            <div className="h-1 w-16 bg-paper/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${p.load}%` } : {}}
                className="h-full bg-acid opacity-50"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
