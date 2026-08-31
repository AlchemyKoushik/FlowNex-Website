"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHAPTERS = [
  {
    num: "01",
    title: "DIGITAL BUSINESS SETUP",
    tagline: "STRUCTURE THE FOUNDATION",
    description:
      "We help businesses overcome scattered files and information, excessive reliance on manual communication through WhatsApp, email and phone calls, and disconnected digital tools by creating a structured, centralized digital workspace where information, communication and everyday operations are organized and connected.",
    elements: ["FILES", "MESSAGES", "TEAMS", "WORKSPACES", "DOCUMENTS"],
  },
  {
    num: "02",
    title: "PROCESS & WORKFLOW AUTOMATION",
    tagline: "TURN REPETITION INTO FLOW",
    description:
      "Replace repetitive manual work with structured digital workflows that automatically move requests, approvals, notifications, tasks and information to the right people at the right time.",
    elements: ["REQUESTS", "APPROVALS", "ACTIONS", "AUTO DISPATCH"],
  },
  {
    num: "03",
    title: "SALES & CUSTOMER MANAGEMENT",
    tagline: "FROM FIRST CONTACT TO CUSTOMER",
    description:
      "Bring leads, customer information, follow-ups and sales activity into one organized system so your team can see what needs attention, what is moving forward and what is being missed.",
    elements: ["LEADS", "CONTACTS", "DEALS", "CUSTOMER PIPELINE"],
  },
  {
    num: "04",
    title: "REPORTING & BUSINESS INTELLIGENCE",
    tagline: "TURN DATA INTO DIRECTION",
    description:
      "Turn scattered business data into clear reports, dashboards and insights that help you understand performance, track important metrics and make better decisions.",
    elements: ["KPIS", "TRENDS", "LIVE DASHBOARDS", "BUSINESS INSIGHTS"],
  },
  {
    num: "05",
    title: "AI FOR BUSINESS",
    tagline: "MAKE INFORMATION WORK HARDER",
    description:
      "Apply AI where it can create real business value — from finding and understanding information to assisting employees, processing documents, analyzing data and automating intelligent tasks.",
    elements: ["DOCUMENT AI", "KNOWLEDGE ENGINE", "SMART ASSISTANTS"],
  },
  {
    num: "06",
    title: "CUSTOM BUSINESS TOOLS",
    tagline: "BUILD AROUND YOUR BUSINESS",
    description:
      "When existing software does not fit the way your business works, we build focused digital tools around your specific requirements — from internal portals and trackers to dashboards, calculators and custom workflows.",
    elements: ["INTERNAL PORTALS", "TRACKERS", "CUSTOM WORKFLOWS"],
  },
];

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const chapterEls = gsap.utils.toArray<HTMLElement>(".chapter-block");

      chapterEls.forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });

        // Unified scrubbed timeline for enter, rest, and exit
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 15%",
            scrub: true,
          }
        });

        tl.fromTo(
          el,
          { opacity: 0, y: 120 },
          { opacity: 1, y: 0, ease: "none", duration: 1 } // Entrance
        )
        .to(el, { opacity: 1, y: 0, duration: 1 }) // Resting state in center
        .to(el, { opacity: 0, y: -120, ease: "none", duration: 1 }); // Exit
      });

      // Background Parallax
      gsap.to(".solutions-bg-visual", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="solutions"
      className="relative w-full bg-flownex-black text-flownex-white py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      {/* Subtle Background Parallax Visual */}
      <div className="solutions-bg-visual absolute top-[10%] right-[-5%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-flownex-burgundy/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative z-10">
        {/* Two-Column Layout (Matching Lenis 'WHY SMOOTH SCROLL?' Pinned Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          {/* LEFT COLUMN: Pure CSS Sticky Anchor */}
          <div className="lg:col-span-5 lg:sticky lg:top-[20vh] self-start space-y-8 py-2 z-10">
            {/* Lenis-Style Pink Border & Giant Stacked Display Title */}
            <div className="border-l-4 border-flownex-pink pl-6 sm:pl-8 py-1">
              <span className="font-body text-xs font-bold text-flownex-pink tracking-widest uppercase block mb-3">
                02 / CORE CAPABILITIES
              </span>
              <h2 className="font-headline text-5xl sm:text-7xl lg:text-8xl uppercase font-extrabold text-flownex-white tracking-tight leading-[0.9] select-none">
                WHAT<br />
                WE<br />
                DO?
              </h2>
            </div>

            {/* Introductory Copy */}
            <p className="font-body text-base text-flownex-white/80 font-normal leading-relaxed max-w-md pt-2">
              Every business has information, people and processes moving through it.
              When those things are scattered, work slows down. FlowNex connects them into
              systems that work together.
            </p>

            {/* Chapter Indicator Bar */}
            <div className="pt-6 border-t border-white/10 space-y-3 max-w-md">
              <div className="flex items-center justify-between font-body text-xs font-bold text-flownex-white/80">
                <span className="text-flownex-pink font-bold">
                  0{activeChapter + 1} / 06
                </span>
                <span className="truncate ml-4">{CHAPTERS[activeChapter].title}</span>
              </div>

              {/* Progress Line */}
              <div className="flex items-center gap-2">
                {CHAPTERS.map((ch, i) => (
                  <div
                    key={ch.num}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeChapter
                        ? "w-12 bg-flownex-pink"
                        : i < activeChapter
                        ? "w-4 bg-flownex-pink/50"
                        : "w-3 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scrolling Chapter Sequence */}
          <div className="lg:col-span-7 pt-[15vh] lg:pt-[30vh] pb-[15vh] lg:pb-[30vh]">
            {CHAPTERS.map((chap, index) => {
              const isActive = index === activeChapter;

              return (
                <div
                  key={chap.num}
                  className="chapter-block min-h-[50vh] lg:min-h-[75vh] flex flex-col justify-center space-y-6"
                >
                  {/* Chapter Label */}
                  <div className="font-body text-xs font-bold text-flownex-pink tracking-widest uppercase">
                    CHAPTER {chap.num} — {chap.tagline}
                  </div>

                  {/* Chapter Title */}
                  <h3 className="font-wide text-2xl sm:text-4xl lg:text-5xl uppercase font-bold text-flownex-pink tracking-[0.08em] leading-tight">
                    {chap.title}
                  </h3>

                  {/* Description Paragraph */}
                  <p className="font-body text-base sm:text-lg text-flownex-white/85 font-light leading-relaxed max-w-xl">
                    {chap.description}
                  </p>

                  {/* Fragment Badges */}
                  <div className="pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {chap.elements.map((el, i) => (
                        <span
                          key={i}
                          className={`px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wider transition-all duration-500 ${
                            isActive
                              ? "bg-flownex-burgundy/90 text-flownex-white border border-flownex-pink/40 shadow-[0_0_15px_rgba(255,42,109,0.25)]"
                              : "bg-white/5 text-flownex-white/40 border border-white/5"
                          }`}
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
