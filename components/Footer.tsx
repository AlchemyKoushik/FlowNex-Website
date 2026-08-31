"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Lenis-style Parallax Wordmark Entrance & Scale
      gsap.fromTo(
        wordmarkRef.current,
        { scale: 0.92, y: 30 },
        {
          scale: 1.04,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-flownex-black py-24 px-6 md:px-16 border-t border-white/10 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] bg-flownex-burgundy/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col justify-between items-center text-center">
        <div className="space-y-2 mb-12">
          <h3 className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight">
            BUILD BETTER.
          </h3>
          <h3 className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight">
            WORK BETTER.
          </h3>
          <h3 className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-pink tracking-tight">
            FLOW BETTER.
          </h3>
        </div>

        {/* Parallax Scaling Display Wordmark */}
        <h2
          ref={wordmarkRef}
          className="font-logo text-[11vw] sm:text-[12vw] md:text-[10vw] leading-[0.8] font-[950] uppercase text-flownex-white tracking-[0.08em] select-none transition-transform"
        >
          FLOWNEX
        </h2>

        <a
          href="#contact"
          onClick={(e) => e.preventDefault()}
          className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-flownex-pink text-white font-body text-base uppercase tracking-wider font-bold hover:bg-flownex-pink-light transition-all duration-300 shadow-[0_0_40px_rgba(255,42,109,0.4)]"
        >
          <span>LET&apos;S DISCUSS</span>
          <span>↗</span>
        </a>

        <div className="w-full mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body text-xs font-semibold text-flownex-white/50 gap-4">
          <span>© {new Date().getFullYear()} FLOWNEX SOLUTIONS. ALL RIGHTS RESERVED.</span>
          <span className="text-flownex-pink font-bold uppercase tracking-wider">
            BUSINESS SYSTEMS & PROCESS AUTOMATION
          </span>
          <span>PROTO 01 / MARKETING ENGINE</span>
        </div>
      </div>
    </footer>
  );
}
