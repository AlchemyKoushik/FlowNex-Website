"use client";

import React from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ScheduleIcon } from "@/components/icons/ScheduleIcon";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 md:px-12 py-5 flex items-center justify-between pointer-events-none">
      {/* Left - Clean minimal branding placeholder */}
      <div className="pointer-events-auto flex items-center gap-2.5 opacity-0 invisible w-[160px]">
      </div>

      {/* Center - FlowNex brand mark / logo */}
      <a
        href="#"
        className="pointer-events-auto group flex items-center gap-2 text-flownex-white no-underline focus:outline-none"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 ease-out group-hover:rotate-90"
        >
          <path d="M511.92 245.05C511.92 252.34 511.92 259.63 511.92 266.92C510.09 270.05 510.58 275.64 509.92 279.28C508.99 284.45 507.42 289.74 505.82 294.75C499.49 314.56 487.17 332.59 471.82 346.73C422.68 391.99 348.47 387.38 301.89 341.25C296.18 335.59 290.54 329.86 284.83 324.2C282.53 321.91 278.83 319.34 277.63 316.32C290.53 303.41 303.42 290.5 316.32 277.59C319.68 278.93 322.6 283.19 325.16 285.74C330.86 291.41 336.5 297.15 342.22 302.8C358.88 319.23 384.25 326.49 406.98 319.73C432.64 312.1 451.42 290.06 454.79 263.45C459.26 228.09 431.39 192.55 395.51 190.08C366.85 188.1 351.63 199.56 332.63 218.79C323.73 227.8 314.76 236.75 305.76 245.66C283.44 267.75 261.44 290.18 239.11 312.27C223.41 327.79 208.64 345.48 190.27 357.89C173.64 369.12 154.33 375.59 134.43 377.9C124.24 379.09 113.68 378.08 103.57 376.99C93.19 375.88 83.06 372.15 73.52 368.17C59.5 362.32 47.11 353.38 36.13 342.85C21.69 329.01 10.73 310.51 5.13 291.52C3.43 285.75 2.36 279.88 1.17 273.99C0.69 271.63 1.28 269.15 0.08 266.99C0.08 259.65 0.08 252.31 0.08 244.97C1.84 241.74 1.45 236.34 2.06 232.67C2.92 227.48 4.61 222.24 6.14 217.22C12.2 197.36 24.96 179.35 40.16 165.25C88.54 120.36 162.89 124.62 209.21 169.78C215.28 175.7 221.24 181.73 227.21 187.76C229.48 190.06 233.23 192.65 234.37 195.68C221.48 208.57 208.58 221.45 195.68 234.34C192.34 233.07 189.41 228.74 186.86 226.24C180.82 220.29 174.97 214.13 168.87 208.24C152.09 192.06 127.46 186.2 105 192.23C97.89 194.14 91.25 197.67 85.13 201.77C42.8 230.17 50.03 295.34 95.57 316.12C102.32 319.2 110.08 321.71 117.62 321.96C128.5 322.33 139.26 321.18 149.23 316.81C162.17 311.15 171.35 301.13 181.22 291.32C189.27 283.33 197.27 275.29 205.28 267.26C229.74 242.76 254.42 218.49 278.73 193.85C293.94 178.43 308.85 161.24 327.78 150.34C361.93 130.69 404.86 128.14 440.79 144.82C453.87 150.89 465.57 159.01 475.92 169.13C489.37 182.27 500.27 199.38 505.84 217.23C507.41 222.25 509.04 227.51 509.93 232.69C510.56 236.31 510.1 241.94 511.92 245.05Z" fill="#ff2a6d" fillRule="evenodd" stroke="#ff2a6d" strokeWidth="0.25" strokeLinejoin="round"/>
        </svg>
        <span className="font-headline tracking-wider text-lg uppercase font-bold text-flownex-white">
          FLOWNEX SOLUTIONS
        </span>
      </a>

      {/* Right - CTA Buttons */}
      <div className="pointer-events-auto flex items-center gap-3">
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 px-4 py-2 md:px-5 rounded-full border border-flownex-white/20 text-flownex-white hover:bg-flownex-white/10 transition-all duration-300 backdrop-blur-md text-[10px] md:text-xs font-body font-bold tracking-wider uppercase"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>CONNECT</span>
        </a>
        <a
          href="/schedule"
          className="group relative inline-flex items-center gap-2 px-4 py-2 md:px-5 rounded-full bg-flownex-pink text-white hover:bg-flownex-pink-light transition-all duration-300 backdrop-blur-md text-[10px] md:text-xs font-body font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,42,109,0.3)]"
        >
          <ScheduleIcon className="w-3.5 h-3.5" />
          <span className="hidden md:inline">SCHEDULE A MEETING</span>
          <span className="md:hidden">SCHEDULE</span>
        </a>
      </div>
    </header>
  );
}
