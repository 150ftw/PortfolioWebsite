"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { DiscordIcon } from "./icons/DiscordIcon";
import { useRef, useState } from "react";
import { owner } from "@/lib/data";

const socials = [
  { icon: Github, href: owner.github, label: "GITHUB" },
  { icon: Linkedin, href: owner.linkedin, label: "LINKEDIN" },
  { icon: DiscordIcon, href: owner.discord, label: "DISCORD" },
  { icon: Instagram, href: owner.instagram, label: "INSTAGRAM" },
  { icon: MessageCircle, href: owner.whatsapp, label: "WHATSAPP" },
];

/**
 * Contact — no form, just raw type and a clickable email.
 *
 *  - Giant stacked Bebas Neue: "GOT AN IDEA?" / "LET'S TALK."
 *  - Clicking the email copies it to clipboard and flashes "COPIED."
 *  - Background slowly shifts from #050505 → #0A1A0A as user scrolls in.
 */
export default function Contact() {
  const ref = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const bg = useTransform(
    scrollYProgress,
    [0, 1],
    ["#050505", "#0A1A0A"]
  );

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(owner.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — fall back to mailto
      window.location.href = `mailto:${owner.email}`;
    }
  };

  return (
    <motion.section
      id="contact"
      ref={ref}
      style={{ backgroundColor: bg }}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-32 text-paper"
    >
      {/* Top label */}
      <div className="absolute top-10 left-0 right-0 z-10 flex w-full items-center justify-between px-6 md:px-[8vw]">
        <div className="ui-label text-paper/30 tracking-[0.4em]">INIT_CONN</div>
        <div className="ui-label text-paper/30">/ 04 · CONTACT</div>
      </div>

      {/* Giant type */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="brutal-heading text-paper"
          style={{ fontSize: "clamp(3rem, 10vw, 12rem)", lineHeight: 0.88 }}
        >
          GOT AN IDEA?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="brutal-heading text-acid"
          style={{ fontSize: "clamp(3.5rem, 12vw, 14rem)", lineHeight: 0.88 }}
        >
          LET&apos;S TALK.
        </motion.div>
      </div>

      {/* Email — FIX: underline animation applied directly on the anchor */}
      <motion.a
        href={`mailto:${owner.email}`}
        onClick={handleCopy}
        data-cursor
        data-cursor-label={copied ? "COPIED" : "COPY"}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="group mono relative mt-12 block text-center"
      >
        <span
          className={`text-[clamp(1rem,1.4rem,2rem)] tracking-wider transition-colors duration-200 ${
            copied ? "text-danger" : "text-paper hover:text-acid"
          }`}
        >
          {copied ? "COPIED." : owner.email}
        </span>
        {/* FIX: underline animates on group-hover (parent is the anchor) */}
        <span className="mt-2 block h-px w-full origin-center scale-x-0 bg-acid transition-transform duration-300 group-hover:scale-x-100" />
      </motion.a>

      {/* Social icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-16 flex items-center gap-6"
      >
        {socials.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            data-cursor
            data-cursor-label={label}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/30 text-paper/70 transition-all duration-300 hover:border-acid hover:text-acid hover:bg-acid/5"
          >
            <Icon size={16} strokeWidth={1.5} />
          </a>
        ))}
      </motion.div>

      {/* Location + phone */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-10 left-6 right-6 flex flex-col items-center justify-between gap-2 text-[10px] tracking-[0.3em] uppercase text-paper/40 md:flex-row md:px-[6vw]"
      >
        <span>{owner.location}</span>
        <span>{owner.phone}</span>
      </motion.div>
    </motion.section>
  );
}
