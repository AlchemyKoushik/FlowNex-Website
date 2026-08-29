"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-flownex-black py-24 px-6 md:px-16 border-t border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] bg-flownex-burgundy/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col justify-between items-center text-center">
        {/* Minimal Final Statements */}
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

        {/* Huge FlowNex Wordmark */}
        <h2 className="font-headline text-[15vw] sm:text-[16vw] md:text-[14vw] leading-[0.8] font-extrabold uppercase text-flownex-white tracking-tighter select-none">
          FLOWNEX
        </h2>

        {/* Placeholder CTA Button */}
        <a
          href="#contact"
          onClick={(e) => e.preventDefault()}
          className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-flownex-pink text-white font-headline text-lg uppercase tracking-wider font-bold hover:bg-flownex-pink-light transition-all duration-300 shadow-[0_0_40px_rgba(255,42,109,0.4)]"
        >
          <span>LET&apos;S DISCUSS</span>
          <span>↗</span>
        </a>

        {/* Minimal Bottom Bar */}
        <div className="w-full mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-flownex-white/40 gap-4">
          <span>© {new Date().getFullYear()} FLOWNEX SOLUTIONS. ALL RIGHTS RESERVED.</span>
          <span className="text-flownex-pink font-semibold">
            BUSINESS SYSTEMS & PROCESS AUTOMATION
          </span>
          <span>PROTO 01 / MARKETING ENGINE</span>
        </div>
      </div>
    </footer>
  );
}

