"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis | null;
    __stopScroll?: () => void;
    __startScroll?: () => void;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    window.scrollTo(0, 0);

    let lenis: Lenis | null = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;
    window.__stopScroll = () => {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.classList.add("hide-scrollbar");
      setIsVisible(false);
    };
    window.__startScroll = () => {
      lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("hide-scrollbar");
      setIsVisible(true);
    };

    const handleScroll = (e: any) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        const progress = e.progress !== undefined ? e.progress : (lenis?.progress || 0);
        const clamped = Math.max(0, Math.min(1, progress));
        progressBarRef.current.style.transform = `scaleX(${clamped})`;
      }
    };

    lenis.on("scroll", handleScroll);

    const updateTicker = (time: number) => {
      if (lenis) {
        lenis.raf(time * 1000);
      }
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      if (lenis) {
        lenis.off("scroll", handleScroll);
        lenis.destroy();
        lenis = null;
        window.__lenis = null;
        delete window.__stopScroll;
        delete window.__startScroll;
      }
    };
  }, []);

  return (
    <>
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 w-full h-[3px] bg-flownex-pink z-[9999] pointer-events-none origin-left"
        style={{
          transform: "scaleX(0)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
      {children}
    </>
  );
}
