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
    visual: "scattered",
  },
  {
    num: "02",
    name: "STRUCTURE",
    copy: "Organize information, responsibilities and processes.",
    detail: "Define standardized data models, responsibilities, access control, and clear digital file organization across all teams.",
    visual: "structured",
  },
  {
    num: "03",
    name: "CONNECT",
    copy: "Bring tools, people and information together.",
    detail: "Link disconnected software, CRMs, communication tools, and databases into a synchronized single source of truth.",
    visual: "connected",
  },
  {
    num: "04",
    name: "AUTOMATE",
    copy: "Remove repetitive manual work.",
    detail: "Implement intelligent triggers, automated handoffs, instant approvals, and automated notifications to eliminate manual work.",
    visual: "automated",
  },
  {
    num: "05",
    name: "EVOLVE",
    copy: "Improve and expand the system as the business changes.",
    detail: "Continuously refine workflows, add new capability modules, integrate AI automation, and adapt to business growth.",
    visual: "evolving",
  },
];

export default function Method() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const current = STAGES[activeStage];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Lenis-Style Line-by-Line Staggered Reveal on Headline
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
            trigger: titleRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-flownex-darker py-32 px-6 md:px-16 border-t border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-flownex-burgundy/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header Block with Staggered Line Reveals */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-12 gap-8">
          <div>
            <span className="font-body text-xs text-flownex-pink font-bold tracking-widest uppercase">
              04 / OUR METHODOLOGY
            </span>
            <h2
              ref={titleRef}
              className="font-headline text-4xl sm:text-6xl lg:text-7xl uppercase font-bold text-flownex-white mt-2 leading-[0.9] overflow-hidden"
            >
              <span className="appear-line block">HOW WE WORK</span>
            </h2>
          </div>

          <div className="max-w-xl text-left md:text-right overflow-hidden">
            <h3 className="appear-line font-headline text-2xl sm:text-3xl uppercase font-bold text-flownex-white leading-tight">
              WE DON&apos;T JUST ADD TOOLS.
            </h3>
            <h3 className="appear-line font-headline text-2xl sm:text-3xl uppercase font-bold text-flownex-pink leading-tight mt-1">
              WE CONNECT HOW YOU WORK.
            </h3>
          </div>
        </div>

        {/* 5 Stages Grid & Visual Transformation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-center">
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {STAGES.map((stage, idx) => {
              const isActive = idx === activeStage;
              return (
                <div
                  key={stage.num}
                  onClick={() => setActiveStage(idx)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 border ${
                    isActive
                      ? "glass-panel-pink border-flownex-pink/60 translate-x-2 shadow-[0_0_20px_rgba(255,42,109,0.2)]"
                      : "glass-panel border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-headline text-2xl font-bold ${
                          isActive ? "text-flownex-pink" : "text-flownex-white/40"
                        }`}
                      >
                        {stage.num}
                      </span>
                      <h4
                        className={`font-headline text-xl uppercase font-bold tracking-wider ${
                          isActive ? "text-flownex-white" : "text-flownex-white/70"
                        }`}
                      >
                        {stage.name}
                      </h4>
                    </div>
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-flownex-pink animate-pulse" />
                    )}
                  </div>
                  <p
                    className={`font-body text-sm mt-2 leading-relaxed ${
                      isActive ? "text-flownex-white" : "text-flownex-white/50"
                    }`}
                  >
                    {stage.copy}
                  </p>
                  {isActive && (
                    <p className="font-body text-xs text-flownex-pink/90 mt-3 font-light border-l border-flownex-pink/40 pl-3">
                      {stage.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-6 h-[460px] w-full rounded-2xl glass-panel-pink p-8 flex flex-col justify-between relative overflow-hidden border border-flownex-pink/30">
            <div className="flex items-center justify-between font-body text-xs font-bold border-b border-white/10 pb-4">
              <span className="text-flownex-white/70 uppercase">
                STAGE {current.num} — {current.name}
              </span>
              <span className="text-flownex-pink font-bold uppercase">{current.visual} SYSTEM</span>
            </div>

            <div className="my-auto flex items-center justify-center relative">
              <MethodVisual visual={current.visual} />
            </div>

            <div className="flex items-center justify-between font-body text-[11px] font-semibold text-flownex-white/50 pt-4 border-t border-white/5 uppercase">
              <span>FLOWNEX TRANSFORMATION METHOD</span>
              <span className="text-flownex-pink">STEP {activeStage + 1} OF 5</span>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center border-t border-white/10 pt-16">
          <h3 className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-extrabold text-flownex-white tracking-tight">
            BUILD SYSTEMS THAT KEEP MOVING.
          </h3>
          <p className="font-headline text-xl sm:text-2xl uppercase font-bold text-flownex-pink tracking-widest mt-2">
            THAT&apos;S THE FLOWNEX WAY.
          </p>
        </div>
      </div>
    </section>
  );
}

function MethodVisual({ visual }: { visual: string }) {
  if (visual === "scattered") {
    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        {[
          { label: "RAW DATA", pos: "top-2 left-4" },
          { label: "FILES", pos: "top-10 right-2" },
          { label: "CHAT", pos: "bottom-4 left-8" },
          { label: "LOGS", pos: "bottom-12 right-6" },
          { label: "EMAILS", pos: "top-24 left-2" },
        ].map((item, i) => (
          <div
            key={i}
            className="absolute px-3 py-1.5 rounded-full glass-panel border border-white/10 font-body text-xs font-semibold text-flownex-white/70 animate-bounce duration-[3s]"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  if (visual === "structured") {
    return (
      <div className="grid grid-cols-2 gap-4 w-64">
        {["WORKSPACE A", "DATABASE B", "DEPT C", "WORKFLOW D"].map((group, i) => (
          <div
            key={i}
            className="p-4 rounded-xl glass-panel border border-flownex-pink/40 flex flex-col justify-center text-center font-body text-xs font-bold text-flownex-white"
          >
            <span className="text-[10px] text-flownex-pink font-normal uppercase">GROUP 0{i + 1}</span>
            {group}
          </div>
        ))}
      </div>
    );
  }

  if (visual === "connected") {
    return (
      <div className="relative w-72 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full">
          <line x1="144" y1="128" x2="60" y2="60" stroke="#ff2a6d" strokeWidth="2" />
          <line x1="144" y1="128" x2="220" y2="60" stroke="#ff2a6d" strokeWidth="2" />
          <line x1="144" y1="128" x2="60" y2="200" stroke="#ff2a6d" strokeWidth="2" />
          <line x1="144" y1="128" x2="220" y2="200" stroke="#ff2a6d" strokeWidth="2" />
        </svg>
        <div className="z-10 w-20 h-20 rounded-full bg-flownex-burgundy border-2 border-flownex-pink flex items-center justify-center font-body text-xs font-bold text-flownex-white shadow-[0_0_30px_rgba(255,42,109,0.5)]">
          HUB
        </div>
      </div>
    );
  }

  if (visual === "automated") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-2 rounded-full glass-panel font-body text-xs text-flownex-white font-bold">INPUT</span>
          <span className="text-flownex-pink font-bold">→</span>
          <span className="px-4 py-2 rounded-full bg-flownex-burgundy border border-flownex-pink font-body text-xs font-bold text-flownex-pink animate-pulse">
            AUTO TRIGGER
          </span>
          <span className="text-flownex-pink font-bold">→</span>
          <span className="px-3.5 py-2 rounded-full glass-panel font-body text-xs text-flownex-white font-bold">OUTPUT</span>
        </div>
        <span className="font-body text-[11px] font-bold text-flownex-white/50 tracking-wider">ZERO MANUAL LATENCY</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border border-flownex-pink/40 animate-ping duration-[4s]" />
      <div className="absolute w-32 h-32 rounded-full border border-white/20 flex items-center justify-center font-body text-xs font-bold text-flownex-white uppercase">
        SCALABLE OS
      </div>
    </div>
  );
}
