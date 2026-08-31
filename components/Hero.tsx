"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Step 1: Staggered Intro Reveal Sequence
      const introTl = gsap.timeline({
        onComplete: () => setIsIntroComplete(true),
      });

      introTl
        .fromTo(
          ".intro-letter",
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: "power4.out",
            delay: 0.1,
          }
        )
        .to(
          introWrapperRef.current,
          {
            y: "-100%",
            duration: 1.2,
            ease: "power4.inOut",
          },
          "+=0.15"
        )
        .fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
          "-=0.8"
        )
        .fromTo(
          solutionsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
          "-=0.6"
        );

      // Step 2: Lenis-Style Parallax Scroll Effect on Hero Typography
      gsap.to(titleRef.current, {
        y: 120,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(solutionsRef.current, {
        y: 70,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(glowRef.current, {
        scale: 1.25,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[760px] flex flex-col justify-between px-6 md:px-16 pt-28 pb-12 bg-flownex-black overflow-hidden select-none"
    >
      {/* 1. LENIS-STYLE OPENING INTRO CURTAIN */}
      {!isIntroComplete && (
        <div
          ref={introWrapperRef}
          className="fixed inset-0 z-50 bg-flownex-pink text-black flex flex-col justify-between p-8 md:p-16 pointer-events-none"
        >
          <div className="flex items-center justify-between font-body text-xs font-bold uppercase tracking-widest text-black/80">
            <span>FLOWNEX SOLUTIONS</span>
            <span>CREATIVE STUDIO</span>
          </div>

          <div className="my-auto overflow-hidden text-center">
            <div className="flex items-center justify-center font-headline text-[18vw] sm:text-[20vw] leading-none tracking-tight uppercase font-bold text-black">
              {"FLOWNEX".split("").map((char, index) => (
                <span key={index} className="intro-letter inline-block">
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-end font-body text-xs font-bold uppercase tracking-widest text-black/80">
            <span>BUSINESS SYSTEMS & PROCESS AUTOMATION</span>
            <span>01 / 06</span>
          </div>
        </div>
      )}

      {/* 2. HERO BACKGROUND ATMOSPHERE WITH SCRUBBABLE PARALLAX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[55vw] max-w-[1300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-flownex-burgundy via-flownex-red/20 to-transparent blur-[160px] opacity-80 transition-transform"
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

      {/* 3. HERO TYPOGRAPHY COMPOSITION — WITH PARALLAX SCROLL DISPLACEMENT */}
      <div className="relative z-10 my-auto flex flex-col justify-center max-w-[1500px] w-full mx-auto py-4">
        <div ref={titleRef} className="py-2 overflow-visible">
          <h1 className="font-headline text-[18vw] sm:text-[19vw] lg:text-[17vw] leading-[0.95] tracking-tight uppercase font-extrabold text-flownex-pink select-none text-left drop-shadow-[0_10px_30px_rgba(255,42,109,0.2)]">
            FLOWNEX
          </h1>
        </div>

        <div
          ref={solutionsRef}
          className="flex flex-col md:flex-row items-baseline justify-end mt-4 md:mt-2 pr-2"
        >
          <div className="font-wide text-[7.5vw] sm:text-[8.5vw] lg:text-[7.5vw] leading-none tracking-[0.14em] uppercase font-black text-flownex-white text-right">
            SOLUTIONS
          </div>
        </div>
      </div>

      {/* 4. HERO LOWER INFORMATIONAL & CTA BAR */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-12 items-end justify-between border-t border-white/10 pt-6 gap-6">
        <div className="md:col-span-3 flex items-center gap-4">
          <div className="w-[2px] h-9 bg-flownex-pink" />
          <div className="font-body text-xs uppercase font-bold tracking-widest text-flownex-white">
            <div>SCROLL</div>
            <div>TO EXPLORE</div>
          </div>
        </div>

        <div className="md:col-span-5 font-body text-xs md:text-sm text-flownex-white/70 font-normal tracking-wide uppercase leading-relaxed">
          <p>A CREATIVE TECHNOLOGY STUDIO CONNECTING BUSINESS INFORMATION, DATA, AND WORKFLOWS INTO FLUID OPERATING SYSTEMS.</p>
        </div>

        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3">
          <a
            href="#contact"
            onClick={(e) => e.preventDefault()}
            className="px-6 py-3 rounded-full bg-flownex-pink text-white font-body text-xs font-bold uppercase tracking-wider hover:bg-flownex-pink-light transition-all shadow-[0_0_25px_rgba(255,42,109,0.35)] flex items-center gap-2"
          >
            <span>LET&apos;S DISCUSS</span>
            <span>↗</span>
          </a>
          <a
            href="#solutions"
            className="px-6 py-3 rounded-full bg-white/10 border border-white/15 text-white font-body text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <span>SOLUTIONS</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
