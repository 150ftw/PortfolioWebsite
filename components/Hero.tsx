"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { owner } from "@/lib/data";

/**
 * Hero
 *
 *  - Top-left: SHIVAM in 20vw, bleeds off right edge.
 *  - Below (offset 8vw): SHARMA in acid-green.
 *  - Thin 1px rule, role line underneath.
 *  - Bottom-right: Playfair italic bio (overlaps intentionally).
 *  - Bottom-left: tiny JetBrains Mono terminal block with blinking cursor.
 *  - CTA: underlined text "View selected work ↓".
 *  - Background: 60vw circle, 1px white stroke, slowly rotating, cropped.
 *
 *  On scroll out: GSAP scales/blurs the name block (see below).
 *
 *  SHIVAM letters receive layoutId="hero-letter-{i}" so the BootScreen
 *  can perform a shared-layout transition into them.
 */

const LETTERS = owner.firstName.split("");

export default function Hero({ booted }: { booted: boolean }) {
  const reduced = useReducedMotion();
  const nameRef = useRef<HTMLDivElement | null>(null);

  // GSAP scale/blur on scroll out — loaded client-side only.
  useEffect(() => {
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
        if (!nameRef.current) return;
        gsap.to(nameRef.current, {
          scale: 1.6,
          filter: "blur(24px)",
          opacity: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: nameRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink z-10"
    >
      {/* Background HUD Layer */}
      <HeroBackground reduced={reduced} />

      {/* Background stroke circle */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[20vw] -top-[20vw] h-[60vw] w-[60vw] rounded-full border border-paper/10"
        animate={reduced ? {} : { rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Second subtle inner circle tick */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10vw] -top-[10vw] h-[35vw] w-[35vw] rounded-full border border-paper/10"
      />

      {/* Name block — receives letter layoutIds from BootScreen */}
      <div
        ref={nameRef}
        className="relative z-10 pt-[24vw] md:pt-[10vw] flex flex-col md:flex-row md:items-start justify-between px-[4vw]"
      >
        <div className="flex flex-col">
          {/* SHIVAM — bleeds off the right intentionally */}
          <h1
            className="brutal-heading whitespace-nowrap text-paper"
            style={{ fontSize: "20vw", lineHeight: 0.82 }}
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={`hero-${i}`}
                layoutId={booted ? undefined : `hero-letter-${i}`}
                className="inline-block"
                initial={booted ? { y: 60, opacity: 0 } : undefined}
                animate={booted ? { y: 0, opacity: 1 } : undefined}
                transition={{
                  delay: 0.05 * i,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* SHARMA — offset right, acid-green */}
          <h2
            className="brutal-heading whitespace-nowrap text-acid"
            style={{
              fontSize: "20vw",
              lineHeight: 0.82,
              paddingLeft: "8vw",
              marginTop: "-0.1em",
            }}
          >
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {owner.lastName}
            </motion.span>
          </h2>
        </div>

        {/* Profile Photo - Identity Activation Interaction */}
        <div className="relative mt-12 md:mt-0 z-20 flex flex-col items-center">
          <motion.div
            className="relative w-[65vw] md:w-[24vw] h-[80vw] md:h-[30vw] cursor-crosshair group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={booted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              const target = e.currentTarget as HTMLElement;
              target.style.setProperty('--mx', `${x * 15}px`);
              target.style.setProperty('--my', `${y * 15}px`);
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.setProperty('--mx', '0px');
              target.style.setProperty('--my', '0px');
            }}
            style={{
              transform: 'translate(var(--mx, 0), var(--my, 0))',
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            } as any}
          >
            {/* Soft Shadow & Background Glow */}
            <div className="absolute -inset-4 bg-acid/0 group-hover:bg-cyan-500/10 blur-3xl transition-colors duration-700 rounded-full" />
            
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-paper/10 bg-paper/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Image 1: Default Clean */}
              <motion.img 
                src="/images/shivam-base.png" 
                alt="Shivam Sharma"
                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                animate={{ 
                  opacity: 1,
                  scale: 1
                }}
                whileHover={{ scale: 1.03 }}
              />

              {/* Image 2: Cyber Portrait (Visible on Hover) */}
              <motion.img 
                src="/images/shivam-cyber.png" 
                alt="Shivam Sharma Cyber"
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-0 group-hover:opacity-100 transition-all duration-500"
                whileHover={{ scale: 1.03 }}
              />

              {/* Glitch Flicker Overlay (Short duration on hover) */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:animate-[glitch_0.25s_ease-in-out_1] bg-cyan-500/10 mix-blend-overlay" />

              {/* HUD Accents */}
              <div className="absolute inset-0 border-[1px] border-paper/5 rounded-[2rem] pointer-events-none" />
              
              {/* Scanning line sweep once on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400/30 opacity-0 group-hover:animate-[scan-once_0.8s_ease-in-out_1] z-30" />

              {/* Verified Badge / Data */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-1 z-30">
                 <span className="ui-label text-[8px] text-paper/40 tracking-[0.4em] uppercase">Status</span>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="ui-label text-[10px] text-paper tracking-[0.2em] group-hover:text-cyan-400 transition-colors">IDENTITY_VERIFIED</span>
                 </div>
              </div>
            </div>
            
            {/* Luxury Spacing / Under-photo data */}
            <div className="mt-6 flex items-center justify-between px-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
               <div className="flex items-center gap-3">
                  <span className="mono text-[8px]">SHVM_UID: 150_FTW</span>
                  <div className="h-px w-8 bg-paper/50" />
               </div>
               <span className="mono text-[8px]">BIO_SYNC: 98.4%</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rule + role line — bottom-left */}
      <div className="absolute left-[4vw] bottom-[20vh] z-10 max-w-[55%]">
        <motion.div
          className="h-px w-[60%] bg-paper/70"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        />
        <motion.p
          className="ui-label mt-4 text-paper/60 flex items-center gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <span>{owner.roleLine}</span>
          
          <a 
            href={owner.resume} 
            target="_blank" 
            rel="noreferrer"
            data-cursor
            data-cursor-label="RESUME"
            className="hidden md:flex items-center gap-2 group/cv text-paper hover:text-acid transition-colors border-l border-paper/20 pl-6"
          >
            <span className="underline underline-offset-4 decoration-paper/30 group-hover/cv:decoration-acid">DOWNLOAD CV</span>
            <ArrowUpRight size={12} className="transition-transform group-hover/cv:-translate-y-0.5 group-hover/cv:translate-x-0.5" />
          </a>
        </motion.p>
      </div>

      {/* Bottom-right Playfair bio — moved slightly to avoid photo crowd */}
      <motion.aside
        className="absolute right-[4vw] bottom-[10vh] z-10 hidden max-w-[300px] md:block"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <p className="editorial text-[1.1rem] italic leading-relaxed text-paper/90 text-right">
          {owner.bio}
        </p>
      </motion.aside>

      {/* Mobile bio — shown below the name block */}
      <motion.p
        className="relative z-10 mx-[4vw] mt-8 max-w-sm editorial text-base italic leading-relaxed text-paper/90 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {owner.bio}
      </motion.p>

      {/* Bottom-left tiny terminal — above CTA so they don't overlap on mobile */}
      <motion.div
        className="absolute left-[6vw] bottom-24 md:bottom-6 z-10 mono text-[10px] md:text-[11px] text-paper/60 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <div>&gt; location: {owner.location.toLowerCase()}</div>
        <div className="flex gap-2">
          &gt; resume: 
          <a 
            href={owner.resume} 
            target="_blank" 
            rel="noreferrer" 
            className="text-acid hover:underline underline-offset-2"
          >
            cv_sharma_v1.0
          </a>
        </div>
        <div>
          &gt; status: building
          <span className="ml-0.5 inline-block h-3 w-[7px] -translate-y-[1px] bg-acid align-middle animate-blink" />
        </div>
      </motion.div>

      {/* NEW: HUD Decorative Elements — restored to top but heading is pushed down */}
      <div className="absolute top-8 right-6 md:top-10 md:right-10 z-20 flex flex-col items-end gap-1 opacity-30">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
          <span className="ui-label text-[9px] text-paper tracking-[0.4em]">FRAME_SYNC: OK</span>
        </div>
        <span className="mono text-[8px] text-paper/60">60FPS // SHVM_OS_v1.0.4</span>
      </div>

      <div className="absolute top-8 left-6 md:top-10 md:left-10 z-20 flex flex-col gap-1 opacity-30">
        <span className="ui-label text-[9px] text-paper tracking-[0.4em]">LOC_COORD</span>
        <span className="mono text-[8px] text-paper/60">{owner.coords}</span>
      </div>

      {/* Decorative vertical metadata */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-8 opacity-20 select-none">
        <span className="mono text-[9px] uppercase tracking-[0.6em] [writing-mode:vertical-lr]">AGENTIC_BUILD_SYSTEM</span>
        <div className="h-24 w-px bg-paper/30" />
        <span className="mono text-[9px] uppercase tracking-[0.6em] [writing-mode:vertical-lr]">NODE_STABLE</span>
      </div>
    </section>
  );
}

function HeroBackground({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
      {/* 40px Grid */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(240, 237, 230, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 237, 230, 0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Large background text */}
      <div className="absolute left-[4vw] top-[50vh] brutal-heading text-[15vw] text-paper/[0.02] leading-none select-none">
        INDEX_00
      </div>

      {/* Grid Markers */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-paper/20 rounded-full" />
         <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-paper/20 rounded-full" />
         <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-acid/20 rounded-full" />
      </div>

      {/* Scanning Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-paper/20 to-transparent z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Corner Metadata */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-paper/10" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-paper/10" />
    </div>
  );
}
