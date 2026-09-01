"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const introWrapperRef = useRef<HTMLDivElement>(null);

  const [isIntroShown, setIsIntroShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. STATE: INTRO_WRAPPER (LOCK SCROLLING)
    // Force scroll to top instantly
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("hide-scrollbar");

    // Since Hero (child) mounts before SmoothScroll (parent), __stopScroll might not exist yet.
    // We poll briefly to ensure Lenis is completely paused as soon as it initializes.
    const stopLenisInterval = setInterval(() => {
      if (window.__stopScroll) {
        window.__stopScroll();
        clearInterval(stopLenisInterval);
      }
    }, 10);
    let unlockFrame: number | null = null;

    const introTimer = setTimeout(() => {
      setIsIntroShown(true);
    }, 150);

    const ctx = gsap.context(() => {
      // 2. STATE: WRAPPER_AUTO_ANIMATION & HERO_REVEAL
      const revealTl = gsap.timeline({
        delay: 1.6, // Wait for text appearance animation to finish
        onComplete: () => {
          // 3. STATE: HERO_ACTIVE & NORMAL_SCROLL_ENABLED
          clearInterval(stopLenisInterval);

          // Completely remove wrapper from flow to prevent any interaction or reappearance
          gsap.set(introWrapperRef.current, { display: "none" });

          // Resume scrolling only after the hidden wrapper has been painted away.
          unlockFrame = window.requestAnimationFrame(() => {
            if (window.__startScroll) {
              window.__startScroll();
            } else {
              document.body.style.overflow = "";
              document.documentElement.style.overflow = "";
              document.documentElement.classList.remove("hide-scrollbar");
            }

            // Refresh ScrollTrigger so parallax calculations are perfectly accurate.
            ScrollTrigger.refresh();
            unlockFrame = null;
          });
        },
      });

      // Animate clip path upwards (bottom edge moves up), revealing Hero underneath
      revealTl.to(introWrapperRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.4,
        ease: "power3.inOut",
      });

      // 4. PARALLAX EFFECTS (Normal scroll-driven behavior after intro)
      // These are completely independent of the intro and will only respond to scroll 
      // once Lenis and the body overflow are restored.
      if (compositionRef.current) {
        gsap.fromTo(
          compositionRef.current,
          { y: 0 },
          {
            y: 90,
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

      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { xPercent: -50, yPercent: -50, scale: 1, opacity: 0.8 },
          {
            xPercent: -50,
            yPercent: -50,
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

    return () => {
      clearInterval(stopLenisInterval);
      clearTimeout(introTimer);
      if (unlockFrame !== null) {
        window.cancelAnimationFrame(unlockFrame);
      }
      ctx.revert();
      
      // Cleanup: restore scroll if component unmounts
      if (window.__startScroll) {
        window.__startScroll();
      } else {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.documentElement.classList.remove("hide-scrollbar");
      }
    };
  }, []);

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
          <div ref={compositionRef} className="flex flex-col w-fit">
            <h1 className="font-logo text-[13vw] sm:text-[14vw] lg:text-[13vw] leading-[0.95] tracking-[0.08em] uppercase font-[950] text-flownex-pink select-none text-center drop-shadow-[0_10px_30px_rgba(255,42,109,0.2)]">
              {"FLOWNEX".split("").map((char, idx) => (
                <span key={idx} className="inline-block">
                  {char}
                </span>
              ))}
            </h1>

            <div className="flex justify-end mt-4 sm:mt-6">
              <span className="font-wide text-[5vw] sm:text-[5.5vw] lg:text-[5vw] leading-none tracking-[0.1em] uppercase font-bold text-flownex-white text-right select-none">
                SOLUTIONS
              </span>
            </div>
          </div>
        </div>

        {/* HERO LOWER INFORMATIONAL & CTA BAR */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-12 items-end justify-between border-t border-white/10 pt-5 gap-4 pointer-events-auto">
          <div className="md:col-span-3 flex items-center gap-3">
            <div className="w-[2px] h-8 bg-flownex-pink" />
            <div className="font-body text-xs uppercase font-bold tracking-widest text-flownex-white">
              <div>SCROLL</div>
              <div>TO EXPLORE</div>
            </div>
          </div>

          <div className="md:col-span-9 flex justify-end font-body text-xs md:text-sm text-flownex-white/70 font-normal tracking-wide uppercase leading-relaxed text-right">
            <p className="max-w-lg">
              TURNING BUSINESS INFORMATION, DATA & WORKFLOWS INTO LIVING SYSTEMS.
            </p>
          </div>
        </div>
      </div>

      {/* 1. WRAPPER LAYER (ANIMATED CLIP-PATH REVEAL) */}
      <div
        ref={introWrapperRef}
        className="absolute inset-0 z-50 bg-flownex-pink flex flex-col justify-between px-4 sm:px-8 md:px-14 pt-24 pb-10 pointer-events-none"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        {/* Placeholder to match the Hero's top layout */}
        <div className="h-4" />

        {/* EXACT SAME STRUCTURE AS HERO COMPOSITION FOR PIXEL PERFECT ALIGNMENT */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full mx-auto py-2">
          <div className="flex flex-col w-fit">
            <h1 className="font-logo text-[13vw] sm:text-[14vw] lg:text-[13vw] leading-[0.95] tracking-[0.08em] uppercase font-[950] text-flownex-black select-none text-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              {"FLOWNEX".split("").map((char, idx) => (
                <span
                  key={idx}
                  style={{ "--index": idx + 1 } as React.CSSProperties}
                  className={`intro-piece ${isIntroShown ? "show" : ""}`}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Hidden SOLUTIONS to maintain exact flex dimensions */}
            <div className="flex justify-end mt-4 sm:mt-6 opacity-0">
              <span className="font-wide text-[5vw] sm:text-[5.5vw] lg:text-[5vw] leading-none tracking-[0.1em] uppercase font-bold text-transparent text-right select-none">
                SOLUTIONS
              </span>
            </div>
          </div>
        </div>

        {/* HERO LOWER BAR EQUIVALENT - HIDDEN TO MATCH HEIGHTS */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-12 items-end justify-between border-t border-transparent pt-5 gap-4 opacity-0 invisible">
          <div className="md:col-span-3 flex items-center gap-3">
            <div className="w-[2px] h-8" />
            <div className="font-body text-xs uppercase font-bold tracking-widest">
              <div>SCROLL</div>
              <div>TO EXPLORE</div>
            </div>
          </div>
          <div className="md:col-span-9 flex justify-end font-body text-xs md:text-sm tracking-wide uppercase leading-relaxed text-right">
            <p className="max-w-lg">
              TURNING BUSINESS INFORMATION, DATA & WORKFLOWS INTO LIVING SYSTEMS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
