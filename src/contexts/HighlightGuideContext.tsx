"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface HighlightGuideContextType {
  // ID of the element that should be highlighted
  highlightedElementId: string | null;
  // Trigger highlight animation
  triggerHighlight: (elementId: string) => void;
  // Clear highlight
  clearHighlight: () => void;
  // Check if an element is currently highlighted
  isHighlighted: (elementId: string) => boolean;
}

const HighlightGuideContext = createContext<HighlightGuideContextType | null>(null);

interface HighlightGuideProviderProps {
  children: ReactNode;
}

export function HighlightGuideProvider({ children }: HighlightGuideProviderProps) {
  const [highlightedElementId, setHighlightedElementId] = useState<string | null>(null);

  const triggerHighlight = useCallback((elementId: string) => {
    setHighlightedElementId(elementId);
    // Auto clear after animation
    setTimeout(() => {
      setHighlightedElementId(null);
    }, 1500); // 1.5 seconds for animation
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightedElementId(null);
  }, []);

  const isHighlighted = useCallback((elementId: string) => {
    return highlightedElementId === elementId;
  }, [highlightedElementId]);

  return (
    <HighlightGuideContext.Provider
      value={{
        highlightedElementId,
        triggerHighlight,
        clearHighlight,
        isHighlighted,
      }}
    >
      {children}
    </HighlightGuideContext.Provider>
  );
}

export function useHighlightGuide() {
  const context = useContext(HighlightGuideContext);
  if (!context) {
    throw new Error("useHighlightGuide must be used within a HighlightGuideProvider");
  }
  return context;
}

// Hook for elements that can be highlighted
export function useHighlightTarget(elementId: string) {
  const { isHighlighted } = useHighlightGuide();
  return isHighlighted(elementId);
}

