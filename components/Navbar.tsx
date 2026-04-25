"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Instagram, Menu, X } from "lucide-react";
import { DiscordIcon } from "./icons/DiscordIcon";
import { navSections, owner } from "@/lib/data";

const socials = [
  { icon: Github, href: owner.github, label: "GITHUB" },
  { icon: Linkedin, href: owner.linkedin, label: "LINKEDIN" },
  { icon: DiscordIcon, href: owner.discord, label: "DISCORD" },
  { icon: Instagram, href: owner.instagram, label: "INSTAGRAM" },
];

import Image from "next/image";

const Logo = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Image
      src="/logo.png"
      alt="Logo"
      fill
      className="object-contain transition-all duration-300 group-hover:brightness-125"
    />
  </div>
);

import { useUI } from "./UIContext";
import { Activity } from "lucide-react";

export default function Navbar() {
  const { isHudVisible, toggleHud } = useUI();
  const [active, setActive] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ... rest of the existing state/effects ...

  // Spy on sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    );

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* DESKTOP — right-edge vertical strip */}
      <nav
        aria-label="Primary navigation"
        className="fixed right-0 top-0 z-[80] hidden h-screen w-12 flex-col items-center justify-between border-l border-paper/10 bg-ink/40 py-6 backdrop-blur-sm md:flex"
      >
        {/* Monogram rotated */}
        <button
          onClick={() => scrollTo("hero")}
          data-cursor
          data-cursor-label="TOP"
          className="group transition-colors"
        >
          <Logo className="h-16 w-16 text-paper transition-colors group-hover:brightness-125" />
        </button>

        {/* Section indicators */}
        <ul className="flex flex-col items-center gap-5">
          {navSections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="group relative">
                <button
                  onClick={() => scrollTo(section.id)}
                  aria-label={section.label}
                  data-cursor
                  data-cursor-label={section.label}
                  className="flex items-center"
                >
                  <span
                    className={`block rounded-full border border-paper transition-all duration-300 ${
                      isActive
                        ? "h-2.5 w-2.5 bg-acid border-acid"
                        : "h-1.5 w-1.5 bg-paper group-hover:bg-acid group-hover:border-acid"
                    }`}
                  />
                  {/* Label appears on hover/active, positioned to the left */}
                  <span
                    className={`ui-label pointer-events-none absolute right-7 whitespace-nowrap text-[10px] tracking-[0.25em] transition-all duration-300 ${
                      isActive
                        ? "text-acid opacity-100 translate-x-0"
                        : "text-paper opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    {section.number} — {section.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Resume / CV Link */}
        <div className="mb-6 rotate-[-90deg] origin-center">
          <a
            href={owner.resume}
            target="_blank"
            rel="noreferrer"
            data-cursor
            data-cursor-label="RESUME"
            className="ui-label text-[9px] tracking-[0.4em] text-paper/40 hover:text-acid transition-colors"
          >
            RESUME_v1.0
          </a>
        </div>

        {/* HUD Toggle */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <button
            onClick={toggleHud}
            data-cursor
            data-cursor-label={isHudVisible ? "HIDE HUD" : "SHOW HUD"}
            className={`p-2 transition-all border ${
              isHudVisible ? "text-acid border-acid/30 bg-acid/10" : "text-paper/40 border-paper/10 hover:border-paper/30"
            }`}
          >
            <Activity size={14} strokeWidth={2} className={isHudVisible ? "animate-pulse" : ""} />
          </button>
          <div className="h-px w-4 bg-paper/10" />
        </div>

        {/* Socials */}
        <div className="flex flex-col items-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              data-cursor
              data-cursor-label={label}
              className="text-paper/60 transition-colors hover:text-acid"
            >
              <Icon size={14} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </nav>

    <div className="fixed bottom-0 left-0 right-0 z-[80] flex items-center justify-between border-t border-paper/10 bg-ink/90 px-5 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-4">
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center"
        >
          <Logo className="h-12 w-12 text-paper" />
        </button>
        <button
          onClick={toggleHud}
          className={`p-2 border ${isHudVisible ? "text-acid border-acid/30" : "text-paper/40 border-paper/10"}`}
        >
          <Activity size={16} />
        </button>
      </div>
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="text-paper p-1"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE — full-screen takeover */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex bg-acid text-ink md:hidden"
          >
            {/* LEFT — links */}
            <div className="relative flex w-[60%] flex-col justify-center gap-2 px-6 py-16">
              {navSections.map((section, i) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
                  className="group flex items-baseline gap-3 text-left"
                >
                  <span
                    className="editorial text-lg italic text-ink/60"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {section.number}
                  </span>
                  <span className="brutal-heading text-[14vw] leading-none text-ink group-hover:-translate-y-0.5 transition-transform">
                    {section.label}
                  </span>
                </motion.button>
              ))}
              <div className="mt-8 pt-8 border-t border-ink/10 space-y-4">
                <a 
                  href={owner.resume} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block brutal-heading text-[10vw] leading-none text-ink underline decoration-ink/20"
                >
                  GET CV
                </a>
                <div className="ui-label text-ink/80 space-y-1">
                  <div>{owner.location}</div>
                  <div className="mono text-[10px] normal-case tracking-normal">{owner.email}</div>
                </div>
              </div>
            </div>
            {/* RIGHT — generative noise */}
            <div className="relative w-[40%] overflow-hidden bg-acid noise">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-acid/10 to-ink/20 mix-blend-overlay" />
              <div className="brutal-heading absolute bottom-6 right-4 text-[8vw] leading-none text-ink/90">
                MENU
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
