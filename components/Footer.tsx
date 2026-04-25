"use client";

/**
 * Footer — slim 80px bar. Nothing fancy.
 */
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative flex h-20 w-full items-center justify-between border-t border-paper/20 bg-ink px-6 text-[10px] tracking-[0.25em] uppercase text-paper/50 md:px-[6vw]">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 opacity-60 transition-opacity hover:opacity-100">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <span>© {year}</span>
      </div>
      <span className="hidden md:inline">
        BUILT WITH NEXT.JS · FRAMER MOTION · GSAP
      </span>
      <span>GURUGRAM, INDIA</span>
    </footer>
  );
}
