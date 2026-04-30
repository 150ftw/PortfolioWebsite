"use client";

import { useEffect, useRef } from "react";
import { useUI } from "./UIContext";

export default function AudioPlayer() {
  const { isAudioPlaying } = useUI();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      if (isAudioPlaying) {
        audioRef.current.play().catch(err => {
          console.warn("Audio play blocked or failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  return (
    <audio
      ref={audioRef}
      src="/One Dance - Drake.mp3"
      loop
      style={{ display: "none" }}
    />
  );
}
