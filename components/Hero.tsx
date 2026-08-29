"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIntroDone(true),
      });

      // Opening Choreography Sequence (Intro SVG reveal -> Hero settlement)
      tl.fromTo(
        introRef.current,
        { scale: 1.1, opacity: 1 },
        { scale: 1, opacity: 0, duration: 1.2, ease: "power3.inOut", delay: 0.4 }
      )
        .fromTo(
          titleRef.current,
          { y: 120, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          solutionsRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
          "-=0.8"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[720px] flex flex-col justify-between px-6 md:px-16 pt-24 pb-10 bg-flownex-black overflow-hidden select-none"
    >
      {/* Starting / Loading Choreography Overlay */}
      <div
        ref={introRef}
        className={`fixed inset-0 z-50 bg-flownex-black flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
          introDone ? "hidden" : "block"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
          >
            <circle cx="50" cy="50" r="45" stroke="#ff2a6d" strokeWidth="2" strokeDasharray="10 15" />
            <path
              d="M30 70 L70 30 M70 30 H40 M70 30 V60"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-headline text-3xl tracking-widest text-flownex-white font-extrabold uppercase">
            FLOWNEX
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-flownex-pink uppercase">
            SYSTEM INITIALIZING
          </span>
        </div>
      </div>

      {/* Hero Background Atmosphere & Subtle Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Atmospheric Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[55vw] max-w-[1200px] bg-radial from-flownex-burgundy/60 via-flownex-red/20 to-transparent blur-[160px] opacity-80" />
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-flownex-pink/10 rounded-full blur-[140px] animate-pulse-glow" />

        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 bg-noise opacity-30" />

        {/* Subtle Flowing Form SVG Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <path
            d="M -100 300 Q 400 100 800 500 T 1700 200"
            stroke="url(#hero-flow-grad)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <path
            d="M -50 700 Q 500 850 1000 300 T 1600 600"
            stroke="rgba(255,42,109,0.15)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hero-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#18030c" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Delicate Star / Particle Accent Overlay */}
        <div className="absolute top-1/3 left-1/5 w-1 h-1 rounded-full bg-white opacity-40 animate-ping" />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-flownex-pink opacity-50" />
      </div>

      {/* Hero Typography Composition */}
      <div className="relative z-10 my-auto flex flex-col justify-center max-w-[1500px] w-full mx-auto">
        {/* Massive Editorial Display Wordmark */}
        <div ref={titleRef} className="overflow-hidden">
          <h1 className="font-headline text-[21vw] sm:text-[22vw] md:text-[20vw] lg:text-[18.5vw] leading-[0.8] tracking-tighter uppercase font-extrabold text-flownex-white select-none text-left">
            FLOWNEX
          </h1>
        </div>

        {/* Secondary Editorial Phrase 'SOLUTIONS' Positioned Independently */}
        <div
          ref={solutionsRef}
          className="flex flex-col md:flex-row md:items-baseline justify-between mt-2 md:-mt-6 lg:-mt-10 px-2"
        >
          <div className="font-headline text-[11vw] sm:text-[12vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.85] tracking-tight uppercase font-bold text-flownex-pink">
            SOLUTIONS
          </div>

          <p className="max-w-md mt-6 md:mt-0 font-body text-xs sm:text-sm md:text-base leading-relaxed text-flownex-white/70 font-light border-l border-flownex-pink/40 pl-4">
            A creative technology studio connecting business information, communication, data, and workflows into fluid, structured operating systems.
          </p>
        </div>
      </div>

      {/* Hero Lower Informational Bar */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto flex items-end justify-between border-t border-white/10 pt-5">
        {/* LEFT: Scroll to explore with subtle vertical line */}
        <div className="flex items-center gap-4">
          <div className="w-[1px] h-8 bg-gradient-to-b from-flownex-pink to-transparent animate-pulse" />
          <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-flownex-white/70">
            <div>SCROLL</div>
            <div className="text-flownex-pink font-semibold">TO EXPLORE</div>
          </div>
        </div>

        {/* RIGHT: Minimal Directional Element */}
        <div className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-flownex-white/80">
          <span>SOLUTIONS</span>
          <span className="text-flownex-pink font-bold">↓</span>
        </div>
      </div>
    </section>
  );
}
