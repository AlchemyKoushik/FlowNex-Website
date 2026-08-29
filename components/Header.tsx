"use client";

import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-5 flex items-center justify-between pointer-events-none">
      {/* Left - Minimal Empty / Subtle Tag */}
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-flownex-pink" />
        <span className="font-mono text-[10px] tracking-widest text-flownex-white/50 uppercase">
          FLOWNEX.OS
        </span>
      </div>

      {/* Center - FlowNex brand mark / logo */}
      <a
        href="#"
        className="pointer-events-auto group flex items-center gap-2 text-flownex-white no-underline focus:outline-none"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 ease-out group-hover:rotate-90"
        >
          <rect width="40" height="40" rx="8" fill="#0b0b12" />
          <path
            d="M12 28L28 12M28 12H16M28 12V24"
            stroke="#ff2a6d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="26" r="3" fill="#ffffff" />
          <circle cx="26" cy="14" r="3" fill="#ff2a6d" />
        </svg>
        <span className="font-headline tracking-wider text-lg uppercase font-extrabold text-flownex-white">
          FLOWNEX
        </span>
      </a>

      {/* Right - LET'S DISCUSS ↗ Visual CTA */}
      <a
        href="#contact"
        onClick={(e) => e.preventDefault()}
        className="pointer-events-auto group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-flownex-pink/50 hover:bg-flownex-pink/10 transition-all duration-300 backdrop-blur-md text-xs font-mono tracking-widest uppercase text-flownex-white"
      >
        <span>LET&apos;S DISCUSS</span>
        <span className="text-flownex-pink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </a>
    </header>
  );
}
