"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STAGES = [
  {
    num: "01",
    name: "UNDERSTAND",
    copy: "See how the business actually works.",
    detail: "We audit existing workflows, communication channels, data bottlenecks, and tool fragmentation before changing anything.",
  },
  {
    num: "02",
    name: "STRUCTURE",
    copy: "Organize information, responsibilities and processes.",
    detail: "We turn scattered information and disconnected processes into a clear operating structure.",
  },
  {
    num: "03",
    name: "CONNECT",
    copy: "Bring tools, people, and information together.",
    detail: "We connect the systems your team already uses so information can move where it needs to go.",
  },
  {
    num: "04",
    name: "AUTOMATE",
    copy: "Remove repetitive manual work.",
    detail: "We identify repeatable work and replace unnecessary manual steps with practical automation.",
  },
  {
    num: "05",
    name: "EVOLVE",
    copy: "Improve and expand the system as the business changes.",
    detail: "The system should grow with the business rather than becoming another limitation.",
  },
];

export default function Method() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Header Text Reveal
      gsap.fromTo(
        ".appear-line",
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      if (prefersReducedMotion) {
        gsap.set(cardsRef.current, { opacity: 1, y: 0, x: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          is2XL: "(min-width: 1536px)",
          isXL: "(min-width: 1280px) and (max-width: 1535px)",
          isLG: "(min-width: 1024px) and (max-width: 1279px)",
          isMD: "(min-width: 768px) and (max-width: 1023px)",
          isSM: "(max-width: 767px)",
        },
        (context) => {
          const { is2XL, isXL, isLG, isMD, isSM } = context.conditions as any;

          const getOffsets = (index: number) => {
            if (is2XL) return { x: (index - 2) * 260, y: (index - 2) * 20 };
            if (isXL) return { x: (index - 2) * 200, y: (index - 2) * 20 };
            if (isLG) return { x: (index - 2) * 150, y: (index - 2) * 20 };
            if (isMD) return { x: (index - 2) * 100, y: (index - 2) * 20 };
            return { x: 0, y: (index - 2) * 60 }; // SM
          };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: trackRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: (self) => {
                const progress = self.progress;
                let step = 1;
                if (progress > 0.1) step = 2;
                if (progress > 0.35) step = 3;
                if (progress > 0.6) step = 4;
                if (progress > 0.85) step = 5;
                setCurrentStep(step);
              }
            },
          });

          // Set initial states
          cardsRef.current.forEach((card, i) => {
            const offsets = getOffsets(i);
            
            if (i === 0) {
              gsap.set(card, { x: offsets.x, y: offsets.y, opacity: 1, zIndex: 10, scale: 1 });
            } else {
              // Start lower down and scaled slightly
              const startY = (isMD || isLG || isXL || is2XL) ? 800 : 300;
              const startX = (isMD || isLG || isXL || is2XL) ? 300 : 0;
              gsap.set(card, { x: offsets.x + startX, y: startY, opacity: 0, zIndex: 10 + i, scale: 0.9 });
            }
          });

          // Sequence the animations
          cardsRef.current.forEach((card, i) => {
            if (i === 0) return;
            
            const offsets = getOffsets(i);
            
            tl.to(card, {
              y: offsets.y,
              x: offsets.x,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out"
            });
          });
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-transparent relative border-t border-white/5">
      {/* 
        Scroll Track: 
        Height determines pinning duration. 4 cards = 400vh.
      */}
      <div ref={trackRef} className="h-[400vh] w-full relative">
        
        {/* Sticky Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-6 md:px-16">

          {/* Section Header (Asymmetrical) */}
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-[1520px] mx-auto mt-4 md:mt-8 gap-4 md:gap-8">
            <h2
              ref={titleRef}
              className="font-headline text-4xl sm:text-5xl lg:text-7xl uppercase font-bold text-flownex-white leading-[0.9] overflow-hidden"
            >
              <span className="appear-line block">HOW WE WORK</span>
            </h2>

            <div className="max-w-md text-left md:text-right overflow-hidden">
              <h3 className="appear-line font-headline text-xl sm:text-2xl uppercase font-bold text-flownex-white leading-tight">
                WE DON&apos;T JUST ADD TOOLS.
              </h3>
              <h3 className="appear-line font-headline text-xl sm:text-2xl uppercase font-bold text-flownex-pink leading-tight mt-1">
                WE CONNECT HOW YOU WORK.
              </h3>
            </div>
          </div>

          {/* Cards Composition Stage */}
          <div className="relative z-10 flex-1 w-full max-w-[1520px] mx-auto flex items-center justify-center my-8">
            {STAGES.map((stage, i) => (
              <div
                key={stage.num}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="absolute w-[280px] md:w-[340px] lg:w-[380px] xl:w-[440px] 2xl:w-[480px] h-[400px] md:h-[500px] lg:h-[560px] xl:h-[640px] 2xl:h-[700px] p-6 lg:p-10 2xl:p-12 rounded-3xl bg-[#0d0d12]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-colors hover:border-flownex-pink/40 flex flex-col justify-between"
                style={{
                  opacity: i === 0 ? 1 : 0, // Fallback
                }}
              >
                {/* Top Left: Massive Number */}
                <div className="font-headline text-7xl md:text-[100px] lg:text-[120px] 2xl:text-[160px] font-bold text-flownex-pink opacity-80 leading-none tracking-tighter">
                  {stage.num}
                </div>

                {/* Bottom Left: Content */}
                <div className="flex flex-col gap-3 lg:gap-5 pr-4">
                  <h4 className="font-headline text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl uppercase font-bold tracking-tight text-flownex-white leading-[0.9]">
                    {stage.name}
                  </h4>
                  <p className="font-body text-xs md:text-sm lg:text-base 2xl:text-lg text-flownex-white/70 font-light leading-relaxed">
                    {stage.copy} {stage.detail}
                  </p>
                </div>
                
                {/* Subtle Edge Glow Overlay */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_0_1px_rgba(255,42,109,0.15)]" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
