"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ScheduleIcon } from "@/components/icons/ScheduleIcon";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h3Ref = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomFooterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Main storytelling timeline (Automatic)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", // Starts a bit before fully in view for smoother perception
          toggleActions: "play none none none",
        },
      });

      // BUILD BETTER
      tl.fromTo(h1Ref.current, 
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
      )

      // WORK BETTER
      .fromTo(h2Ref.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        "-=0.6" // Stagger entry
      )

      // FLOW BETTER
      .fromTo(h3Ref.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )

      // Wordmark "Flownex" appears automatically
      .fromTo(wordmarkRef.current,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.6" 
      )

      // CTA
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
        "-=1.0" // Start shortly after wordmark starts
      )

      // Bottom Footer
      .fromTo(bottomFooterRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="w-full relative bg-flownex-black overflow-hidden flex flex-col justify-between min-h-screen pt-24 md:pt-32"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] bg-flownex-burgundy/50 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center max-w-[1400px] mx-auto w-full px-6 md:px-16 flex-grow">
        
        {/* The Stage for Animated Headlines */}
        <div className="flex flex-col items-center gap-1 md:gap-2 mb-10 md:mb-12">
          <h3 
            ref={h1Ref} 
            className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight will-change-transform opacity-0"
          >
            BUILD BETTER
          </h3>
          <h3 
            ref={h2Ref} 
            className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight will-change-transform opacity-0"
          >
            WORK BETTER
          </h3>
          <h3 
            ref={h3Ref} 
            className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-pink tracking-tight will-change-transform opacity-0"
          >
            FLOW BETTER
          </h3>
        </div>

        {/* Parallax Scaling Display Wordmark */}
        <h2
          ref={wordmarkRef}
          className="font-logo text-[11vw] sm:text-[12vw] md:text-[10vw] leading-[0.8] font-[950] uppercase text-flownex-white tracking-[0.08em] select-none transition-transform will-change-transform opacity-0"
        >
          FLOWNEX
        </h2>

        <div
          ref={ctaRef}
          className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 will-change-transform opacity-0"
        >
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full border border-flownex-white/20 text-flownex-white font-body text-base uppercase tracking-wider font-bold hover:bg-flownex-white/10 transition-colors duration-300 pointer-events-auto group"
          >
            <WhatsAppIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span>CONNECT WITH US</span>
          </a>
          <a
            href="/schedule"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full bg-flownex-pink text-white font-body text-base uppercase tracking-wider font-bold hover:bg-flownex-pink-light transition-colors duration-300 shadow-[0_0_40px_rgba(255,42,109,0.4)] pointer-events-auto group"
          >
            <ScheduleIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <span>SCHEDULE A MEETING</span>
          </a>
        </div>
      </div>

      {/* Standard Footer Bottom Bar */}
      <div ref={bottomFooterRef} className="w-full px-6 md:px-16 pb-8 pt-20 relative opacity-0">
        <div className="max-w-[1400px] mx-auto w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body text-xs font-semibold text-flownex-white/50 gap-4 relative z-10">
          <span>© {new Date().getFullYear()} FLOWNEX SOLUTIONS. ALL RIGHTS RESERVED.</span>
          <span className="text-flownex-pink font-bold uppercase tracking-wider">
            BUSINESS SYSTEMS & PROCESS AUTOMATION
          </span>
        </div>
      </div>
    </footer>
  );
}
