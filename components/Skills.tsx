"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Marquee from "@/components/Marquee";
import { skillRows } from "@/lib/data";

/**
 * Skills — 5 full-width marquee rows.
 *
 * Big Bebas Neue skill names travel horizontally in alternating
 * directions at varied speeds. Hover over a skill name to lock it acid-green
 * and pop a 1-line context tooltip.
 *
 * Giant word "SKILLS" sits at 6% opacity filling the vertical center.
 */

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full overflow-hidden bg-ink py-32 text-paper"
    >
      {/* Technical HUD Overlay */}
      <SkillsBackground />

      {/* Giant background text — SKILLS at 25vw, 6% opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="brutal-heading whitespace-nowrap text-paper/[0.04]"
          style={{ fontSize: "25vw", lineHeight: 0.82 }}
        >
          SKILLS
        </span>
      </div>

      {/* Small top label */}
      <div className="relative z-10 mb-16 px-6 md:px-[6vw]">
        <div className="ui-label text-paper/50">/ 02 · CAPABILITIES</div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 md:gap-8">
        {skillRows.map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: rowIdx * 0.1 }}
          >
            <Marquee direction={row.direction} speed={row.speed}>
              {row.items.map((item, i) => (
                <SkillItem
                  key={`${rowIdx}-${item.name}-${i}`}
                  name={item.name}
                  context={item.context}
                />
              ))}
            </Marquee>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SkillItem({ name, context }: { name: string; context: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        data-cursor
        data-cursor-label="STACK"
        className={`brutal-heading mx-6 cursor-none whitespace-nowrap transition-colors duration-200 ${
          hovered ? "text-acid" : "text-paper"
        }`}
        style={{ fontSize: "clamp(1.5rem, 4vw, 5rem)", lineHeight: 0.95 }}
      >
        {name}
      </span>
      <span className="text-acid/70 brutal-heading" style={{ fontSize: "clamp(1rem, 3vw, 4rem)" }}>✦</span>

      {/* Tooltip */}
      {hovered && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="mono pointer-events-none absolute left-1/2 top-[110%] z-20 -translate-x-1/2 whitespace-nowrap rounded-sm border border-acid bg-ink px-3 py-1.5 text-[10px] tracking-wider text-acid"
        >
          {context}
        </motion.span>
      )}
    </span>
  );
}
function SkillsBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(240, 237, 230, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 237, 230, 0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-acid/20 to-transparent z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute top-1/2 left-[5vw] -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-10">
        <span className="mono text-[9px] uppercase tracking-[0.6em] [writing-mode:vertical-lr] rotate-180">CAPABILITY_MATRIX</span>
        <div className="h-32 w-px bg-paper/30" />
      </div>
    </div>
  );
}
