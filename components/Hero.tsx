"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
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
        className="relative z-10 pt-[12vw] md:pt-[10vw]"
      >
        {/* SHIVAM — bleeds off the right intentionally */}
        <h1
          className="brutal-heading whitespace-nowrap pl-[4vw] text-paper"
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
            paddingLeft: "12vw",
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

      {/* Rule + role line — bottom-left */}
      <div className="absolute left-[4vw] bottom-[20vh] z-10 max-w-[55%]">
        <motion.div
          className="h-px w-[60%] bg-paper/70"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        />
        <motion.p
          className="ui-label mt-4 text-paper/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {owner.roleLine}
        </motion.p>
      </div>

      {/* Bottom-right Playfair bio — overlaps intentionally, hidden on mobile */}
      <motion.aside
        className="absolute right-[4vw] bottom-[14vh] z-10 hidden max-w-[340px] md:block"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        <p className="editorial text-[1.2rem] italic leading-relaxed text-paper/90">
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
        className="absolute left-[4vw] bottom-6 z-10 mono text-[11px] text-paper/60 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      >
        <div>&gt; location: {owner.location.toLowerCase()}</div>
        <div>
          &gt; status: building
          <span className="ml-0.5 inline-block h-3 w-[7px] -translate-y-[1px] bg-acid align-middle animate-blink" />
        </div>
      </motion.div>

      {/* NEW: HUD Decorative Elements */}
      <div className="absolute top-10 right-10 z-20 hidden md:flex flex-col items-end gap-1 opacity-40">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-acid animate-pulse" />
          <span className="ui-label text-[9px] text-paper tracking-[0.4em]">FRAME_SYNC: OK</span>
        </div>
        <span className="mono text-[8px] text-paper/60">60FPS // SHVM_OS_v1.0.4</span>
      </div>

      <div className="absolute top-10 left-10 z-20 hidden md:flex flex-col gap-1 opacity-40">
        <span className="ui-label text-[9px] text-paper tracking-[0.4em]">LOC_COORD</span>
        <span className="mono text-[8px] text-paper/60">28°27'34.2"N 77°01'35.8"E</span>
      </div>

      {/* Decorative vertical metadata */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-8 opacity-20 select-none">
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
