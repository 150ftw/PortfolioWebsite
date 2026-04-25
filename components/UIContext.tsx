"use client";

import React, { createContext, useContext, useState } from "react";

type UIContextType = {
  isHudVisible: boolean;
  toggleHud: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isHudVisible, setIsHudVisible] = useState(false);

  const toggleHud = () => setIsHudVisible((prev) => !prev);

  return (
    <UIContext.Provider value={{ isHudVisible, toggleHud }}>
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
