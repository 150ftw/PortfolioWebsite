import { motion, useReducedMotion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, Pause } from "lucide-react";
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

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const spotlightRadius = useMotionValue(0);

  // Smooth springs for the scanner
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const smoothRadius = useSpring(spotlightRadius, { damping: 40, stiffness: 300 });

  const maskImage = useTransform(
    [smoothX, smoothY, smoothRadius],
    ([x, y, r]) => `radial-gradient(circle ${r as number}px at ${x as number}% ${y as number}%, black ${(r as number) * 0.2}px, transparent ${r as number}px)`
  );

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
        className="relative z-10 pt-[35vw] md:pt-[10vw] px-[6vw] md:px-[4vw]"
      >
        {/* Name: Added pointer-events-none so it doesn't block the photo hover */}
        <div className="flex flex-col relative z-20 pointer-events-none">
          {/* SHIVAM — bleeds off the right intentionally */}
          <h1
            className="brutal-heading whitespace-nowrap text-paper"
            style={{ 
              fontSize: "clamp(3.2rem, 14vw, 16vw)", 
              lineHeight: 0.85 
            }}
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
              fontSize: "clamp(3.2rem, 14vw, 16vw)",
              lineHeight: 0.85,
              paddingLeft: "8vw",
              marginTop: "-0.05em",
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

          {/* NEW: Music Player — Floating underneath the name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={booted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="pointer-events-auto mt-12 ml-[8vw] flex items-center gap-6"
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </div>


      {/* Profile Photo - Identity Activation Interaction — Locked to Bottom-Right on Mobile */}
      <motion.div
        className="absolute bottom-[6vh] right-[4vw] md:top-[12vh] md:bottom-auto md:right-[6vw] z-30 w-[38vw] md:w-[22vw] h-[50vw] md:h-[30vw] cursor-none group"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={booted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        transition={{ 
          delay: 0.8, 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          scale: { duration: 0.4, ease: "easeOut" }
        }}
        onMouseEnter={() => spotlightRadius.set(220)}
        onMouseLeave={() => {
          spotlightRadius.set(0);
          const target = document.getElementById('hero-portrait-tilt');
          if (target) {
            target.style.setProperty('--mx', '0px');
            target.style.setProperty('--my', '0px');
          }
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          mouseX.set(x);
          mouseY.set(y);
          
          // Also keep the parallax tilt
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          const target = e.currentTarget as HTMLElement;
          target.style.setProperty('--mx', `${px * 10}px`);
          target.style.setProperty('--my', `${py * 10}px`);
        }}
        id="hero-portrait-tilt"
        style={{
          transform: 'translate(var(--mx, 0), var(--my, 0))',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
        } as any}
      >
        {/* Spotlight background glow follows mouse */}
        <motion.div 
          className="absolute -inset-12 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"
          style={{ WebkitMaskImage: maskImage, maskImage } as any}
        />
        
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-paper/10 bg-paper/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Image 1: Default Clean (Always Visible) */}
          <img 
            src="/shivam-base.png" 
            alt="Shivam Sharma"
            className="absolute inset-0 w-full h-full object-cover object-[51%_20%] scale-[1.12] transition-[filter] duration-500 group-hover:brightness-[0.85]"
          />

          {/* Image 2: Cyber Portrait (Revealed by Spotlight Mask) */}
          <motion.img 
            src="/shivam-cyber.png" 
            alt="Shivam Sharma Cyber"
            className="absolute inset-0 w-full h-full object-cover object-[56%_22%] z-20 pointer-events-none scale-[1.0]"
            style={{ WebkitMaskImage: maskImage, maskImage } as any}
          />

          {/* Glitch Flicker Overlay — subtle scan inside spotlight */}
          <motion.div 
            className="absolute inset-0 pointer-events-none group-hover:animate-[glitch_0.25s_ease-in-out_infinite] bg-cyan-500/5 mix-blend-overlay z-30"
            style={{ WebkitMaskImage: maskImage, maskImage } as any}
          />

          {/* Scanning line sweep inside the spotlight */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[1px] bg-cyan-400/40 group-hover:animate-[scan-once_1.5s_infinite] z-40" 
            style={{ WebkitMaskImage: maskImage, maskImage } as any}
          />

          {/* Verified Badge / Data — Hidden on mobile for cleaner look */}
          <div className="absolute bottom-6 left-6 hidden md:flex flex-col gap-1 z-50 pointer-events-none">
              <span className="ui-label text-[8px] text-white/40 tracking-[0.4em] uppercase">Status</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="ui-label text-[10px] text-white tracking-[0.2em] group-hover:text-cyan-400 transition-colors">IDENTITY_VERIFIED</span>
              </div>
          </div>
        </div>
        
        {/* Luxury Spacing / Under-photo data — Hidden on mobile for cleaner look */}
        <div className="mt-6 hidden md:flex items-center justify-between px-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="mono text-[8px]">SHVM_UID: 150_FTW</span>
              <div className="h-px w-8 bg-paper/50" />
            </div>
            <span className="mono text-[8px]">BIO_SYNC: 98.4%</span>
        </div>
      </motion.div>

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
        className="relative z-10 mx-[6vw] mt-8 max-w-[85vw] editorial text-[15px] italic leading-relaxed text-paper/80 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {owner.aboutBio}
      </motion.p>

      {/* Bottom-left tiny terminal — anchored for HUD symmetry */}
      <motion.div
        className="absolute left-[6vw] bottom-[6vh] md:bottom-6 z-10 mono text-[10px] md:text-[11px] text-paper/60 flex flex-col"
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

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-4 group/player">
      <audio 
        ref={audioRef} 
        src="https://p.scdn.co/mp3-preview/742217c45f4ca61286a51d2f8df4a42b93f6f9e2?cid=774b29d4f13844c495f2061947e4d83f" 
        onEnded={() => setIsPlaying(false)}
      />
      
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="h-12 w-12 rounded-full border border-paper/20 bg-paper/5 flex items-center justify-center text-paper hover:border-acid hover:text-acid transition-colors relative"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="pause"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Pause size={18} fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulsing ring when playing */}
        {isPlaying && (
          <motion.div 
            className="absolute -inset-1 rounded-full border border-acid/30"
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="ui-label text-[10px] text-paper/80 tracking-[0.2em] uppercase">Now Playing</span>
          <div className="flex gap-[2px] h-2 items-end">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] bg-acid"
                animate={isPlaying ? { height: [2, 8, 3, 6, 2] } : { height: 2 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="mono text-[12px] text-paper font-bold uppercase tracking-tight">One Dance</span>
          <span className="mono text-[9px] text-paper/40">— DRAKE</span>
        </div>
      </div>

      {/* Technical Data Overlay */}
      <div className="hidden lg:flex flex-col gap-0.5 ml-6 pl-6 border-l border-paper/10 opacity-20">
        <span className="mono text-[8px]">FREQ_LOCK: 44.1kHz</span>
        <span className="mono text-[8px]">BITRATE: 320kbps</span>
      </div>
    </div>
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
