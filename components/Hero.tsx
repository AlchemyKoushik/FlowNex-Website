"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const lowerBarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isFontLoaded, setIsFontLoaded] = useState(false);
  const [isIntroShown, setIsIntroShown] = useState(false);
  const [isCurtainOut, setIsCurtainOut] = useState(false);

  // 1. Font Readiness Guard
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkFonts = async () => {
      try {
        if ("fonts" in document) {
          await document.fonts.ready;
        }
      } catch (err) {
        console.warn("Font loading check fallback", err);
      } finally {
        setIsFontLoaded(true);
      }
    };

    checkFonts();
  }, []);

  // 2. Lenis.dev Replicated Intro State Machine
  useEffect(() => {
    if (typeof window === "undefined" || !isFontLoaded) return;

    // Lock scroll during intro
    if (window.__stopScroll) {
      window.__stopScroll();
    }

    // Step A: Trigger letterform assembly transition
    const showTimer = setTimeout(() => {
      setIsIntroShown(true);
    }, 100);

    // Step B: Trigger curtain vertical slide out AND Hero elements reveal
    const outTimer = setTimeout(() => {
      setIsCurtainOut(true);
    }, 1450);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(outTimer);
    };
  }, [isFontLoaded]);

  // 3. Handle Curtain Exit Completion
  const handleCurtainTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== introWrapperRef.current) return;

    setIsIntroActive(false);

    if (window.__startScroll) {
      window.__startScroll();
    }

    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

  // 4. Lenis Parallax Scroll Scrubbing for Hero Elements
  useEffect(() => {
    if (typeof window === "undefined" || isIntroActive) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (titleRef.current && containerRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 0 },
          {
            y: 110,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (solutionsRef.current && containerRef.current) {
        gsap.fromTo(solutionsRef.current,
          { y: 0 },
          {
            y: 60,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (glowRef.current && containerRef.current) {
        gsap.fromTo(glowRef.current,
          { xPercent: -50, yPercent: -50, scale: 1, opacity: 0.8 },
          {
            xPercent: -50, yPercent: -50,
            scale: 1.3,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isIntroActive]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[780px] bg-flownex-black overflow-hidden select-none"
    >
      {/* 2. HERO BACKGROUND ATMOSPHERE WITH SCRUBBED PARALLAX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[55vw] max-w-[1300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-flownex-burgundy via-flownex-red/20 to-transparent blur-[160px] opacity-80"
        />
        <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] bg-flownex-pink/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute inset-0 bg-noise opacity-30" />

        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <path
            d="M -100 320 Q 400 120 850 520 T 1700 220"
            stroke="url(#hero-pink-gradient)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
          />
          <path
            d="M -50 680 Q 550 820 1050 280 T 1600 580"
            stroke="rgba(255,42,109,0.12)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hero-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#18030c" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. HERO LAYER (PERSISTENT STAGE) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between px-4 sm:px-8 md:px-14 pt-24 pb-10 pointer-events-none">
        
        {/* Placeholder for top layout to keep flex-between structure identical */}
        <div className="h-4" />

        {/* Main Hero Wordmark Composition */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full mx-auto py-2 pointer-events-auto">
          <div className="flex flex-col w-fit">
            <h1
              ref={titleRef}
              className={`font-logo text-[13vw] sm:text-[14vw] lg:text-[13vw] leading-[0.95] tracking-[0.08em] uppercase font-[950] text-flownex-pink select-none text-center drop-shadow-[0_10px_30px_rgba(255,42,109,0.2)] ${isIntroActive ? "hero-reveal-element" : ""} ${isCurtainOut ? "show" : ""}`}
              style={{ transitionDelay: "0.05s" }}
            >
              FLOWNEX
            </h1>

            <div
              ref={solutionsRef}
              className={`flex justify-end mt-4 sm:mt-6 ${isIntroActive ? "hero-reveal-element" : ""} ${isCurtainOut ? "show" : ""}`}
              style={{ transitionDelay: "0.15s" }}
            >
              <span className="font-wide text-[5vw] sm:text-[5.5vw] lg:text-[5vw] leading-none tracking-[0.1em] uppercase font-bold text-flownex-white text-right select-none">
                SOLUTIONS
              </span>
            </div>
          </div>
        </div>

        {/* HERO LOWER INFORMATIONAL & CTA BAR */}
        <div
          ref={lowerBarRef}
          className={`relative z-10 w-full max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-12 items-end justify-between border-t border-white/10 pt-5 gap-4 pointer-events-auto ${isIntroActive ? "hero-reveal-element" : ""} ${isCurtainOut ? "show" : ""}`}
          style={{ transitionDelay: "0.25s" }}
        >
          <div className="md:col-span-3 flex items-center gap-3">
            <div className="w-[2px] h-8 bg-flownex-pink" />
            <div className="font-body text-xs uppercase font-bold tracking-widest text-flownex-white">
              <div>SCROLL</div>
              <div>TO EXPLORE</div>
            </div>
          </div>

          <div className="md:col-span-5 font-body text-xs md:text-sm text-flownex-white/70 font-normal tracking-wide uppercase leading-relaxed">
            <p>
              TURNING BUSINESS INFORMATION, DATA & WORKFLOWS INTO LIVING SYSTEMS.
            </p>
          </div>

          <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3">
            <a
              href="#contact"
              onClick={(e) => e.preventDefault()}
              className="px-5 py-2.5 rounded-full bg-flownex-pink text-white font-body text-xs font-bold uppercase tracking-wider hover:bg-flownex-pink-light transition-all shadow-[0_0_25px_rgba(255,42,109,0.35)] flex items-center gap-2"
            >
              <span>LET&apos;S DISCUSS</span>
              <span>↗</span>
            </a>
            <a
              href="#solutions"
              className="px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white font-body text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <span>SOLUTIONS</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. LENIS.DEV REPLICATED PINK INTRO CURTAIN (WRAPPER LAYER) */}
      {isIntroActive && (
        <div
          ref={introWrapperRef}
          id="intro-curtain"
          onTransitionEnd={handleCurtainTransitionEnd}
          className={`absolute inset-0 z-50 bg-flownex-pink flex flex-col justify-between px-4 sm:px-8 md:px-14 pt-24 pb-10 transition-transform duration-[1.1s] ease-[cubic-bezier(0.19,1,0.22,1)] ${isCurtainOut ? "-translate-y-full" : "translate-y-0"}`}
        >
          {/* Top Metadata Header */}
          <div className="flex items-center justify-between font-body text-xs font-bold uppercase tracking-widest text-black/80">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black" />
              FLOWNEX SOLUTIONS
            </span>
            <span>CREATIVE STUDIO</span>
          </div>

          {/* Central Oversized Wordmark sharing EXACT SAME context */}
          <div className="my-auto w-full mx-auto flex flex-col items-center justify-center py-2">
            <div className="flex flex-col w-fit">
              <div className="font-logo text-[13vw] sm:text-[14vw] lg:text-[13vw] leading-[0.95] tracking-[0.08em] uppercase font-[950] text-flownex-black select-none text-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                {"FLOWNEX".split("").map((char, idx) => (
                  <span
                    key={idx}
                    style={{ "--index": idx + 1 } as React.CSSProperties}
                    className={`intro-piece ${isIntroShown ? "show" : ""}`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Metadata Bar */}
          <div className="flex justify-between items-end font-body text-xs font-bold uppercase tracking-widest text-black/80">
            <span>BUSINESS SYSTEMS & PROCESS AUTOMATION</span>
            <span>01 / 06</span>
          </div>
        </div>
      )}
    </section>
  );
}
