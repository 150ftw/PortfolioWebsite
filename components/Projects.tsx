"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Marquee from "@/components/Marquee";
import { projects, type Project } from "@/lib/data";

export default function Projects() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

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
        const panels = gsap.utils.toArray<HTMLElement>(".peel-panel");
        panels.forEach((panel, i) => {
          if (i === panels.length - 1) return;
          const inner = panel.querySelector(".peel-panel-inner");
          gsap.to(inner, {
            scale: 0.94,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top top",
              endTrigger: panels[i + 1],
              end: "top top",
              scrub: true,
            },
          });
        });
      }, wrapperRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="projects" className="relative w-full">
      {/* Technical Background */}
      <ProjectsBackground />

      {/* Floating label — high z-index, mix-blend so it's always legible */}
      <div className="pointer-events-none sticky top-0 z-50 flex w-full items-center justify-between px-6 py-5 mix-blend-difference">
        <span className="ui-label text-white/60">/ SELECTED_WORK</span>
        <span className="ui-label text-white/60">01 — 0{projects.length}</span>
      </div>

      <div ref={wrapperRef} className="peel-wrapper">
        {projects.map((project, idx) => (
          <ProjectPanel key={project.number} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Colours — defined outside component to avoid re-compute */
/* ──────────────────────────────────────────────────────── */
const PANEL_BG: Record<Project["bg"], string> = {
  navy:    "#060D1F",   // deep blue
  ink:     "#050505",   // near-black
  paper:   "#F0EDE6",   // off-white shock
  surface: "#0F0F0F",   // dark surface
};
const PANEL_TEXT: Record<Project["bg"], string> = {
  navy:    "#F0EDE6",
  ink:     "#F0EDE6",
  paper:   "#050505",
  surface: "#F0EDE6",
};
const PANEL_MUTED: Record<Project["bg"], string> = {
  navy:    "rgba(240,237,230,0.85)",
  ink:     "rgba(240,237,230,0.85)",
  paper:   "rgba(5,5,5,0.8)",
  surface: "rgba(240,237,230,0.85)",
};
const PANEL_BORDER: Record<Project["bg"], string> = {
  navy:    "rgba(240,237,230,0.25)",
  ink:     "rgba(240,237,230,0.25)",
  paper:   "rgba(5,5,5,0.25)",
  surface: "rgba(240,237,230,0.25)",
};

/* ──────────────────────────────────────────────────────── */
/* ProjectPanel                                            */
/* ──────────────────────────────────────────────────────── */
function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const bg     = PANEL_BG[project.bg];
  const text   = PANEL_TEXT[project.bg];
  const muted  = PANEL_MUTED[project.bg];
  const border = PANEL_BORDER[project.bg];

  return (
    <div
      className="peel-panel w-full"
      style={{ zIndex: index + 1 }}
    >
      <div
        className="peel-panel-inner relative overflow-hidden"
        style={{ 
          backgroundColor: bg, 
          color: text,
          "--panel-border": border 
        } as React.CSSProperties}
      >
        {/* Corner Markers for consistency */}
        <div className="absolute top-12 left-6 w-8 h-8 border-t border-l opacity-20 pointer-events-none hidden md:block" style={{ borderColor: text }} />
        <div className="absolute top-12 right-6 w-8 h-8 border-t border-r opacity-20 pointer-events-none hidden md:block" style={{ borderColor: text }} />
        <div className="absolute bottom-16 left-6 w-8 h-8 border-b border-l opacity-20 pointer-events-none hidden md:block" style={{ borderColor: text }} />
        <div className="absolute bottom-16 right-6 w-8 h-8 border-b border-r opacity-20 pointer-events-none hidden md:block" style={{ borderColor: text }} />

        {/* ── Two-column layout ── */}
        <div
          className={`project-panel-inner flex flex-col ${
            project.layout === "right" ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* NAME COLUMN */}
          <NameCol project={project} muted={muted} index={index} />

          {/* INFO COLUMN */}
          <InfoCol project={project} text={text} muted={muted} index={index} />
        </div>

        {/* Bottom marquee */}
        <BottomMarquee project={project} muted={muted} index={index} />
      </div>
    </div>
  );
}

/* ── Name column ── */
function NameCol({
  project, muted, index,
}: {
  project: Project; muted: string; index: number;
}) {
  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-6 pb-12 pt-14 md:px-[6vw] md:py-0">
      {/* Decorative diagonal — project 02 only */}
      {index === 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 h-px w-[45%] origin-left -rotate-[18deg] bg-[var(--panel-border)]"
        />
      )}

      <div
        className="mono mb-5 text-[11px] tracking-[0.25em] uppercase"
        style={{ color: muted }}
      >
        [{project.number}]&nbsp; /&nbsp; {project.year}
      </div>

      <motion.h3
        className="brutal-heading"
        style={{ fontSize: "clamp(2.5rem, 7.5vw, 10rem)", lineHeight: 0.86 }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.name}
        <span className="text-acid">.{project.accent}</span>
      </motion.h3>

      <p
        className="editorial mt-5 italic"
        style={{ fontSize: "1rem", lineHeight: 1.55, maxWidth: "30rem", color: muted }}
      >
        {project.tagline}
      </p>

      <div className="mt-8 flex flex-wrap gap-8">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            data-cursor
            data-cursor-label="GITHUB"
            className="group/link inline-flex items-center gap-2 text-sm"
          >
            <span className="underline underline-offset-8 decoration-current/30 transition-colors group-hover/link:decoration-acid group-hover/link:text-acid">
              GITHUB
            </span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-acid"
            />
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            data-cursor
            data-cursor-label="LIVE"
            className="group/link inline-flex items-center gap-2 text-sm"
          >
            <span className="underline underline-offset-8 decoration-current/30 transition-colors group-hover/link:decoration-acid group-hover/link:text-acid">
              LIVE SITE
            </span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-acid"
            />
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Info column ── */
function InfoCol({
  project, text, muted, index,
}: {
  project: Project; text: string; muted: string; index: number;
}) {
  return (
    <div
      className="project-info-col group relative flex flex-col justify-between px-6 pb-16 pt-8 md:w-[40%] md:px-10 md:py-0"
    >
      {/* Top */}
      <motion.div
        className="relative z-10 flex items-start justify-between pt-4 md:pt-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <div className="ui-label mb-1 text-[10px]" style={{ color: muted }}>
            PROJECT / {project.number}
          </div>
          <div className="brutal-heading text-[2.2rem] leading-none text-acid">
            {project.number}
          </div>
        </div>
        {project.featured && (
          <span className="ui-label rounded-full border border-acid px-3 py-1 text-[10px] text-acid">
            FEATURED
          </span>
        )}
      </motion.div>

      {/* Project Image */}
      {project.image && (
        <div className="relative z-10 mt-6 mb-2 group-hover:shadow-[0_0_50px_-12px_rgba(0,255,148,0.3)] transition-all duration-700 md:mt-8 md:mb-6">
          <div className="relative overflow-hidden rounded-md border border-[var(--panel-border)] shadow-2xl">
            <Image 
              src={project.image} 
              alt={`${project.name} preview`} 
              width={1200}
              height={800}
              className="w-full h-auto object-cover opacity-80 mix-blend-lighten transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100 group-hover:mix-blend-normal" 
            />
            {/* Image scanning line */}
            <motion.div 
              className="absolute left-0 right-0 h-px bg-acid/30 z-20 pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
          {/* Decorative image label */}
          <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-ink text-[8px] mono text-paper border border-paper/10 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            IMG_REF_{project.number}_S01
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="relative z-10 pb-8 md:pb-12 mt-8 md:mt-0">
        <p className="text-sm leading-relaxed" style={{ color: muted }}>
          {project.description}
        </p>

        <div className="mt-5 pt-4 border-t border-[var(--panel-border)]">
          <div className="ui-label mb-2 text-[10px]" style={{ color: muted }}>
            STACK
          </div>
          <div className="mono flex flex-wrap gap-x-3 gap-y-1.5 text-[11px]">
            {project.stack.map((s) => (
              <span key={s} style={{ color: text, opacity: 0.85 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Bottom marquee ── */
function BottomMarquee({
  project, muted, index,
}: {
  project: Project; muted: string; index: number;
}) {
  const items = [...project.stack, ...project.stack, ...project.stack];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 py-2.5 border-t border-[var(--panel-border)]"
    >
      <Marquee direction={index % 2 === 0 ? "left" : "right"} speed="fast">
        {items.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="mono whitespace-nowrap text-[10px] tracking-[0.2em] uppercase"
            style={{ color: muted }}
          >
            {s}&nbsp;&nbsp;<span style={{ opacity: 0.4 }}>✦</span>&nbsp;&nbsp;
          </span>
        ))}
      </Marquee>
    </div>
  );
}


function ProjectsBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
      <div className="absolute left-[6vw] top-[30vh] brutal-heading text-[15vw] text-paper/[0.03] leading-none select-none">
        WORKS_02
      </div>
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-paper/20 to-transparent z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
