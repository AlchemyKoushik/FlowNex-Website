"use client";

import React, { useEffect } from "react";
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
    };
    window.__startScroll = () => {
      lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("hide-scrollbar");
    };

    const handleScroll = () => {
      ScrollTrigger.update();
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

  return <>{children}</>;
}
