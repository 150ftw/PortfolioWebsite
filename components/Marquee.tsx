"use client";

import { ReactNode } from "react";

/**
 * Reusable bidirectional marquee.
 *
 * Content is duplicated once inside the track. The track translates by -50%,
 * producing a seamless loop. Direction and speed are CSS-controllable.
 *
 * IMPORTANT: The keyframes are defined in globals.css (not just Tailwind config)
 * because inline styles cannot reference Tailwind-only keyframes.
 */
export default function Marquee({
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  children,
  className = "",
}: {
  direction?: "left" | "right";
  speed?: "slow" | "fast";
  pauseOnHover?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const duration = speed === "slow" ? 60 : 30;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="marquee-track"
        style={{
          animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${duration}s linear infinite`,
          animationPlayState: "running",
          gap: "3rem",
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
