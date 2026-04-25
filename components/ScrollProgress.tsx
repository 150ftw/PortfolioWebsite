"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin acid-green left-edge line that fills from top to bottom
 * as the user scrolls through the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-screen w-[2px] origin-top bg-acid"
      style={{ scaleY }}
    />
  );
}
