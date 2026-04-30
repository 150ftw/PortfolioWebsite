"use client";

import React, { createContext, useContext, useState } from "react";

type UIContextType = {
  isHudVisible: boolean;
  toggleHud: () => void;
  isCommandCenterOpen: boolean;
  setCommandCenterOpen: (open: boolean) => void;
  toggleCommandCenter: () => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
  startAudio: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isHudVisible, setIsHudVisible] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const toggleHud = () => setIsHudVisible((prev) => !prev);
  const toggleCommandCenter = () => setIsCommandCenterOpen((prev) => !prev);
  const setCommandCenterOpen = (open: boolean) => setIsCommandCenterOpen(open);
  
  const startAudio = () => setIsAudioPlaying(true);

  return (
    <UIContext.Provider value={{ 
      isHudVisible, 
      toggleHud, 
      isCommandCenterOpen, 
      setCommandCenterOpen,
      toggleCommandCenter,
      isAudioPlaying,
      setIsAudioPlaying,
      startAudio
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
