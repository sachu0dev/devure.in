"use client";
import { useEffect, useState } from "react";
import { SmoothCursor } from "./smooth-cursor";

export function SmoothCursorWrapper() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return null;
  }

  return <SmoothCursor />;
}
