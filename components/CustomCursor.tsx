"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useVelocity,
  useTransform,
} from "framer-motion";

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Velocity tracking for tilt/rotation
  const velX = useVelocity(mouseX);
  const velY = useVelocity(mouseY);

  const rotation = useMotionValue(0);

  useEffect(() => {
    const updateRotation = () => {
      const vx = velX.get();
      const vy = velY.get();
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      // Ignore noise/very slow movement
      if (speed < 2) return;

      // Dominant axis locking: if one axis is significantly stronger, 
      // zero out the other to prevent "jitter tilt"
      let cleanVx = vx;
      let cleanVy = vy;
      const ratio = Math.abs(vx) / (Math.abs(vy) || 0.1);
      
      if (ratio < 0.15) cleanVx = 0; // Purely vertical
      if (ratio > 6.5) cleanVy = 0;  // Purely horizontal

      let targetAngle = (Math.atan2(cleanVy, cleanVx) * 180) / Math.PI + 90;
      
      const prevAngle = rotation.get();
      let diff = targetAngle - (prevAngle % 360);
      
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      rotation.set(prevAngle + diff);
    };

    const unsubX = velX.on("change", updateRotation);
    const unsubY = velY.on("change", updateRotation);
    return () => {
      unsubX();
      unsubY();
    };
  }, [velX, velY, rotation]);

  const springRotate = useSpring(rotation, { stiffness: 300, damping: 40, mass: 1.2 });
  const springX = useSpring(mouseX, { stiffness: 800, damping: 50, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 50, mass: 0.1 });

  // Scaling on speed
  const speed = useTransform([velX, velY], ([vx, vy]) => {
    const s = Math.sqrt((vx as number) ** 2 + (vy as number) ** 2);
    return 1 + Math.min(s / 1200, 0.3); // subtle stretch effect
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      setIsTouch(!mq.matches);
      const onChange = () => setIsTouch(!mq.matches);
      mq.addEventListener?.("change", onChange);
      return () => mq.removeEventListener?.("change", onChange);
    }
  }, []);

  useEffect(() => {
    if (!mounted || reduced || isTouch) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor], input, textarea, select"
      );
      setHovering(!!interactive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mounted, mouseX, mouseY, reduced, isTouch]);

  if (!mounted || reduced || isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        rotate: springRotate,
        scaleY: speed,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Chevron Shape (pointed up by default at 0deg) */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: hovering ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.2s ease-out",
        }}
      >
        <path
          d="M12 4L4 20L12 16L20 20L12 4Z"
          stroke="white"
          strokeWidth="1.5"
          fill={hovering ? "white" : "transparent"}
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
