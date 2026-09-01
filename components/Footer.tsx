"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h3Ref = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Main Scroll-Driven Storytelling Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Total timeline duration is 100 for easy percentage reasoning
      // 0-20: BUILD BETTER holds (no animation)
      
      // 20-40: BUILD -> WORK transition
      tl.to(h1Ref.current, { opacity: 0, y: -40, duration: 20 }, 20)
        .fromTo(h2Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 20 }, 20)
      
      // 40-60: WORK BETTER holds
      
      // 60-80: WORK -> FLOW transition
      tl.to(h2Ref.current, { opacity: 0, y: -40, duration: 20 }, 60)
        .fromTo(h3Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 20 }, 60)
        
      // 80-100: FLOW BETTER holds
      tl.to(h3Ref.current, { opacity: 1, duration: 20 }, 80);

      // Existing Wordmark Parallax scaling
      // We still want it to scale slightly as we scroll through the section
      gsap.fromTo(
        wordmarkRef.current,
        { scale: 0.92, y: 30 },
        {
          scale: 1.04,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="w-full relative bg-flownex-black h-[250vh]"
      >
        <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[30vw] bg-flownex-burgundy/50 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center max-w-[1400px] w-full px-6 md:px-16">
            
            {/* The Stage for Animated Headlines */}
            <div className="grid grid-cols-1 grid-rows-1 place-items-center mb-12">
              <h3 
                ref={h1Ref} 
                className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight"
              >
                BUILD BETTER.
              </h3>
              <h3 
                ref={h2Ref} 
                className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-white tracking-tight opacity-0"
              >
                WORK BETTER.
              </h3>
              <h3 
                ref={h3Ref} 
                className="col-start-1 row-start-1 font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-bold text-flownex-pink tracking-tight opacity-0"
              >
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
              className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-flownex-pink text-white font-body text-base uppercase tracking-wider font-bold hover:bg-flownex-pink-light transition-all duration-300 shadow-[0_0_40px_rgba(255,42,109,0.4)] pointer-events-auto"
            >
              <span>LET&apos;S DISCUSS</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Standard Footer Bottom Bar */}
      <footer className="w-full bg-flownex-black px-6 md:px-16 pb-8 pt-4 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body text-xs font-semibold text-flownex-white/50 gap-4 relative z-10">
          <span>© {new Date().getFullYear()} FLOWNEX SOLUTIONS. ALL RIGHTS RESERVED.</span>
          <span className="text-flownex-pink font-bold uppercase tracking-wider">
            BUSINESS SYSTEMS & PROCESS AUTOMATION
          </span>
        </div>
      </footer>
    </>
  );
}
