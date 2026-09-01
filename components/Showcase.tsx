"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PANELS = [
  {
    num: "01",
    service: "DIGITAL BUSINESS SETUP",
    headline: "STRUCTURED WORKSPACE FOUNDATION",
    summary: "Consolidate scattered communication, documentation, and operational drives into a unified digital headquarters.",
    visual: "workspace",
  },
  {
    num: "02",
    service: "PROCESS & WORKFLOW AUTOMATION",
    headline: "INTELLIGENT TRIGGER ENGINE",
    summary: "Automated routing of tasks, document approvals, status updates, and notifications across department lines.",
    visual: "automation",
  },
  {
    num: "03",
    service: "SALES & CUSTOMER MANAGEMENT",
    headline: "END-TO-END LEAD PIPELINE",
    summary: "Organize customer history, follow-up reminders, deal stages, and contract handoffs in one fluid view.",
    visual: "crm",
  },
  {
    num: "04",
    service: "REPORTING & BUSINESS INTELLIGENCE",
    headline: "REAL-TIME EXECUTIVE METRICS",
    summary: "Transform raw transactional data into actionable visual dashboards and performance trend tracking.",
    visual: "bi",
  },
  {
    num: "05",
    service: "AI FOR BUSINESS",
    headline: "DOCUMENT & DATA ASSISTANT",
    summary: "Empower staff with custom AI assistants capable of indexing internal knowledge, drafting responses, and extracting data.",
    visual: "ai",
  },
  {
    num: "06",
    service: "CUSTOM BUSINESS TOOLS",
    headline: "TAILORED OPERATIONAL PORTALS",
    summary: "Bespoke internal calculators, inventory trackers, client portals, and approval dashboards built for unique needs.",
    visual: "custom",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-flownex-black overflow-hidden py-12 border-t border-white/10"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[60vw] h-[40vw] bg-flownex-burgundy/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Static Section Header */}
      <div className="px-6 md:px-16 max-w-[1500px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h2 className="font-headline text-4xl sm:text-6xl uppercase font-bold text-flownex-white mt-1">
              WHAT WE BUILD
            </h2>
          </div>
          <p className="font-body text-sm md:text-base text-flownex-white/70 font-light max-w-md">
            The tools are only the pieces. We connect them into systems that make everyday work simpler.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 px-6 md:px-16 w-max py-4"
      >
        {PANELS.map((panel) => (
          <div
            key={panel.num}
            className="w-[85vw] sm:w-[540px] lg:w-[620px] h-[520px] rounded-3xl glass-panel p-8 flex flex-col justify-between border border-white/10 hover:border-flownex-pink/50 transition-all duration-500 relative overflow-hidden group shrink-0"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-flownex-pink/15 rounded-full blur-[60px] group-hover:bg-flownex-pink/30 transition-all" />

            {/* Panel Top Metadata */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <span className="font-headline text-4xl font-bold text-flownex-pink">
                {panel.num}
              </span>
              <span className="font-body text-xs font-bold text-flownex-white/60 uppercase tracking-widest">
                {panel.service}
              </span>
            </div>

            {/* Panel Abstract Visual Representation */}
            <div className="my-auto h-[220px] w-full rounded-2xl bg-flownex-darker/80 border border-white/5 p-4 flex items-center justify-center relative overflow-hidden">
              <ShowcaseVisual type={panel.visual} />
            </div>

            {/* Panel Bottom Content */}
            <div className="relative z-10">
              <h3 className="font-headline text-xl md:text-2xl uppercase font-bold text-flownex-white tracking-wide">
                {panel.headline}
              </h3>
              <p className="font-body text-xs md:text-sm text-flownex-white/70 font-light mt-2 leading-relaxed">
                {panel.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

{/* Showcase Visual System Snapshots */}
function ShowcaseVisual({ type }: { type: string }) {
  if (type === "workspace") {
    return (
      <div className="w-full h-full flex flex-col justify-center gap-2">
        <div className="flex justify-between items-center px-3 py-2 rounded-full bg-white/5 font-body text-xs font-bold text-flownex-white">
          <span>CENTRAL HUB WORKSPACE</span>
          <span className="text-flownex-pink text-[10px]">ORGANIZED</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-white/5 font-body text-xs text-flownex-white/70 font-semibold">DOCS DRIVE</div>
          <div className="p-3 rounded-xl bg-white/5 font-body text-xs text-flownex-white/70 font-semibold">TEAM CHANNELS</div>
        </div>
      </div>
    );
  }

  if (type === "automation") {
    return (
      <div className="w-full h-full flex items-center justify-center gap-3">
        <div className="px-3 py-2 rounded-full bg-white/5 font-body text-xs font-bold text-flownex-white">TRIGGER</div>
        <div className="h-[2px] w-12 bg-flownex-pink" />
        <div className="px-4 py-2 rounded-full bg-flownex-burgundy border border-flownex-pink font-body text-xs font-bold text-flownex-pink">
          ROUTING
        </div>
        <div className="h-[2px] w-12 bg-flownex-pink" />
        <div className="px-3 py-2 rounded-full bg-white/5 font-body text-xs font-bold text-flownex-white">DISPATCH</div>
      </div>
    );
  }

  if (type === "crm") {
    return (
      <div className="w-full h-full flex flex-col justify-center gap-2">
        {["LEAD: ACME CORP", "DEAL: $45,000", "STAGE: CONTRACT SENT"].map((item, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-white/5 font-body text-xs font-bold text-flownex-white flex justify-between">
            <span>{item}</span>
            <span className="text-flownex-pink text-[10px]">FLOWING</span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "bi") {
    return (
      <div className="w-full h-full flex items-end gap-3 p-4">
        {[40, 75, 55, 90, 65, 100].map((h, i) => (
          <div key={i} className="flex-1 bg-white/10 rounded-t hover:bg-flownex-pink transition-all" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className="w-16 h-16 rounded-full border border-flownex-pink/50 flex items-center justify-center font-body text-xs text-flownex-pink font-bold animate-pulse">
          AI
        </div>
        <span className="font-body text-xs font-bold text-flownex-white/60">KNOWLEDGE RETRIEVAL</span>
      </div>
    );
  }

  // Custom Tools
  return (
    <div className="w-full h-full flex flex-col justify-center gap-2">
      <div className="h-6 w-3/4 rounded bg-white/10" />
      <div className="h-12 w-full rounded-xl bg-flownex-burgundy/80 border border-flownex-pink/40 p-3 font-body text-xs font-bold text-flownex-pink">
        CUSTOM CALCULATOR PORTAL
      </div>
      <div className="h-6 w-1/2 rounded bg-white/10" />
    </div>
  );
}
