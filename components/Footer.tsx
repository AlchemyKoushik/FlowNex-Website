"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h3Ref = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
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
      .to(h1Ref.current, {
        opacity: 0, y: -30, filter: "blur(4px)", duration: 0.5, ease: "power2.inOut", delay: 0.9
      })

      // WORK BETTER
      .fromTo(h2Ref.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
        "<0.15" // Overlap slightly with previous exit
      )
      .to(h2Ref.current, {
        opacity: 0, y: -30, filter: "blur(4px)", duration: 0.5, ease: "power2.inOut", delay: 0.9
      })

      // FLOW BETTER
      .fromTo(h3Ref.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
        "<0.15"
      )

      // CTA
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
        "+=0.8" // Hold FLOW BETTER briefly before CTA appears
      )

      // Bottom Footer
      .fromTo(bottomFooterRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );

      // Existing Wordmark Parallax scaling (Scrubbed)
      gsap.fromTo(
        wordmarkRef.current,
        { scale: 0.92, y: 30 },
        {
          scale: 1.04,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
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
        <div className="grid grid-cols-1 grid-rows-1 place-items-center mb-10 md:mb-12">
          <h3 
            ref={h1Ref} 
            className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight will-change-transform opacity-0"
          >
            BUILD BETTER.
          </h3>
          <h3 
            ref={h2Ref} 
            className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight will-change-transform opacity-0"
          >
            WORK BETTER.
          </h3>
          <h3 
            ref={h3Ref} 
            className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-pink tracking-tight will-change-transform opacity-0"
          >
            FLOW BETTER.
          </h3>
        </div>

        {/* Parallax Scaling Display Wordmark */}
        <h2
          ref={wordmarkRef}
          className="font-logo text-[11vw] sm:text-[12vw] md:text-[10vw] leading-[0.8] font-[950] uppercase text-flownex-white tracking-[0.08em] select-none transition-transform will-change-transform"
        >
          FLOWNEX
        </h2>

        <a
          ref={ctaRef}
          href="#contact"
          onClick={(e) => e.preventDefault()}
          className="mt-10 md:mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-flownex-pink text-white font-body text-base uppercase tracking-wider font-bold hover:bg-flownex-pink-light transition-colors duration-300 shadow-[0_0_40px_rgba(255,42,109,0.4)] pointer-events-auto will-change-transform opacity-0"
        >
          <span>LET&apos;S DISCUSS</span>
          <span>↗</span>
        </a>
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
