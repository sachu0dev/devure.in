"use client"

import { useEffect } from "react";

interface ScrollProviderProps {
  children: React.ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = await import("locomotive-scroll");
      new LocomotiveScroll.default({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        multiplier: 0.5,
        inertia: 0.5,
        smartphone: {
          smooth: true,
        },
      });
    })();
  }, []);

  return <>{children}</>;
} 