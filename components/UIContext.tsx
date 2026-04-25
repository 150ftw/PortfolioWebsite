"use client";

import React, { createContext, useContext, useState } from "react";

type UIContextType = {
  isHudVisible: boolean;
  toggleHud: () => void;
  isCommandCenterOpen: boolean;
  setCommandCenterOpen: (open: boolean) => void;
  toggleCommandCenter: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isHudVisible, setIsHudVisible] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);

  const toggleHud = () => setIsHudVisible((prev) => !prev);
  const toggleCommandCenter = () => setIsCommandCenterOpen((prev) => !prev);
  const setCommandCenterOpen = (open: boolean) => setIsCommandCenterOpen(open);

  return (
    <UIContext.Provider value={{ 
      isHudVisible, 
      toggleHud, 
      isCommandCenterOpen, 
      setCommandCenterOpen,
      toggleCommandCenter 
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
