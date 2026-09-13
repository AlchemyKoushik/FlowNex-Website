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
    points: [
      "Bring your digital tools together in one connected workspace",
      "Give every file and document a clear place to live",
      "Turn manual requests into simple digital processes",
      "Put the right access and permissions in the right hands",
    ],
    elements: ["MICROSOFT 365", "DOCUMENTS", "DIGITAL FORMS", "ACCESS & PERMISSIONS", "COLLABORATION"],
  },
  {
    num: "02",
    title: "PROCESS & WORKFLOW AUTOMATION",
    tagline: "TURN REPETITION INTO FLOW",
    description:
      "Replace repetitive manual work with structured digital workflows that automatically move requests, approvals, notifications, tasks and information to the right people at the right time.",
    points: [
      "Stop chasing approvals. Let the workflow do the chasing",
      "Keep every deadline, task, and follow-up on track",
      "Take repetitive work off your team’s plate",
      "Get the reports you need, right when you need <them></them>",
    ],
    elements: ["APPROVALS", "AUTOMATIONS", "NOTIFICATIONS", "TASKS & REMINDERS", "REPORTING"],
  },
  {
    num: "03",
    title: "SALES & CUSTOMER MANAGEMENT",
    tagline: "FROM FIRST CONTACT TO CUSTOMER",
    description:
      "Bring leads, customer information, follow-ups and sales activity into one organized system so your team can see what needs attention, what is moving forward and what is being missed.",
    points: [
      "Stop losing leads in notebooks, spreadsheets, and scattered conversations",
      "See every opportunity move from first contact to close",
      "Never let a follow-up depend on someone remembering",
      "Know exactly where every quotation stands, and what happens next",
    ],
      elements: ["CRM", "LEAD MANAGEMENT", "SALES PIPELINE", "FOLLOW-UPS", "QUOTATIONS"],
  },
  {
    num: "04",
    title: "REPORTING & BUSINESS INTELLIGENCE",
    tagline: "TURN DATA INTO DIRECTION",
    description:
      "Turn scattered business data into clear reports, dashboards and insights that help you understand performance, track important metrics and make better decisions.",
    points: [
      "Stop piecing together numbers just to understand your business",
      "See sales, finance, and operations in one clear view",
      "Turn scattered business data into decisions you can act on",
      "Know what’s happening across your business, without digging through files",
    ],
      elements: ["SALES DASHBOARDS", "FINANCE DASHBOARDS", "OPERATIONS DASHBOARDS", "MANAGEMENT KPIs"],
  },
  {
    num: "05",
    title: "AI FOR BUSINESS",
    tagline: "MAKE INFORMATION WORK HARDER",
    description:
      "Apply AI where it can create real business value — from finding and understanding information to assisting employees, processing documents, analyzing data and automating intelligent tasks.",
    points: [
      "Stop reading documents line by line. Let AI find what matters",
      "Turn sales conversations into clear summaries and ready-to-use follow-ups",
      "Give your team instant answers from your company’s own knowledge",
      "Turn a blank page into a first draft in seconds",
    ],
    elements: ["DOCUMENT AI", "SALES AI", "KNOWLEDGE AI", "CONTENT AI"],
  },
  {
    num: "06",
    title: "CUSTOM BUSINESS TOOLS",
    tagline: "BUILD AROUND YOUR BUSINESS",
    description:
      "When existing software does not fit the way your business works, we build focused digital tools around your specific requirements — from internal portals and trackers to dashboards, calculators and custom workflows.",
    points: [
      "If a spreadsheet is doing too much, it’s time for a proper tool",
      "Stop calculating the same numbers over and over",
      "Build exactly the tool your business needs, nothing more and nothing less",
      "Turn one frustrating workflow into one simple app",
    ],
    elements: ["TRACKERS", "CALCULATORS", "INTERNAL APPS", "CUSTOM WORKFLOWS"],
  },
];

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const chapterEls = gsap.utils.toArray<HTMLElement>(".chapter-block");

      chapterEls.forEach((el, index) => {
        const isLast = index === chapterEls.length - 1;

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
        .to(el, { opacity: 1, y: 0, duration: 1 }); // Resting state in center

        if (!isLast) {
          tl.to(el, { opacity: 0, y: -120, ease: "none", duration: 1 }); // Exit
        }
      });

      // Pin the Left Column via GSAP so it unpins precisely when the last chapter centers (desktop only)
      let mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: leftColumnRef.current,
          pin: true,
          start: "top 20%",
          endTrigger: chapterEls[chapterEls.length - 1],
          end: "center center",
        });
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
      className="relative w-full bg-flownex-black text-flownex-white pt-28 md:pt-36 pb-8 md:pb-12 px-6 md:px-16"
    >
      {/* Subtle Background Parallax Visual */}
      <div className="solutions-bg-visual absolute top-[10%] right-[-5%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-flownex-burgundy/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto relative z-10">
        {/* Two-Column Layout (Matching Lenis 'WHY SMOOTH SCROLL?' Pinned Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          {/* LEFT COLUMN: GSAP Pinned Anchor */}
          <div ref={leftColumnRef} className="lg:col-span-5 self-start space-y-8 py-2 z-10">
            {/* Lenis-Style Pink Border & Giant Stacked Display Title */}
            <div className="border-l-4 border-flownex-pink pl-6 sm:pl-8 py-1">
              <h2 className="font-logo text-5xl sm:text-7xl lg:text-8xl uppercase font-extrabold text-flownex-white tracking-[0.08em] leading-[1.0] select-none">
                WHAT<br />
                WE<br />
                SOLVE?
              </h2>
            </div>

            {/* Introductory Timeline */}
            <div className="relative mt-8 font-body max-w-md sm:max-w-lg mb-6">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes flowLine1 {
                  0% { top: 50%; height: 0; opacity: 1; }
                  16.66% { top: 50%; height: calc(100% + 1.5rem); opacity: 1; }
                  33.33% { top: calc(50% + 100% + 1.5rem); height: 0; opacity: 1; }
                  33.34%, 100% { height: 0; opacity: 0; }
                }
                @keyframes flowLine2 {
                  0%, 33.33% { top: 50%; height: 0; opacity: 0; }
                  33.34% { top: 50%; height: 0; opacity: 1; }
                  50% { top: 50%; height: calc(100% + 1.5rem); opacity: 1; }
                  66.66% { top: calc(50% + 100% + 1.5rem); height: 0; opacity: 1; }
                  66.67%, 100% { height: 0; opacity: 0; }
                }
                @keyframes flowLine3 {
                  0%, 66.66% { top: 50%; height: 0; opacity: 0; }
                  66.67% { top: 50%; height: 0; opacity: 1; }
                  83.33% { top: 50%; height: calc(100% + 1.5rem); opacity: 1; }
                  100% { top: calc(50% + 100% + 1.5rem); height: 0; opacity: 1; }
                }
                .animate-flow-1 { animation: flowLine1 6s ease-in-out infinite; }
                .animate-flow-2 { animation: flowLine2 6s ease-in-out infinite; }
                .animate-flow-3 { animation: flowLine3 6s ease-in-out infinite; }
              `}} />

              {/* Item 1 */}
              <div className="relative flex items-center pl-6 sm:pl-8 mb-6">
                <div className="absolute left-[29px] sm:left-[37px] w-[2px] bg-white/30 animate-flow-1 z-0 rounded-full"></div>
                <div className="shrink-0 w-[12px] h-[12px] rounded-full border-[2px] border-white/30 bg-flownex-black z-10 relative"></div>
                <p className="ml-5 text-flownex-white/90 text-base sm:text-[17px]">Your business has everything it needs</p>
              </div>

              {/* Item 2 */}
              <div className="relative flex items-center pl-6 sm:pl-8 mb-6">
                <div className="absolute left-[29px] sm:left-[37px] w-[2px] bg-white/30 animate-flow-2 z-0 rounded-full"></div>
                <div className="shrink-0 w-[12px] h-[12px] rounded-full border-[2px] border-white/30 bg-flownex-black z-10 relative"></div>
                <p className="ml-5 text-flownex-white/90 text-base sm:text-[17px]">It's just scattered everywhere</p>
              </div>

              {/* Item 3 */}
              <div className="relative flex items-center pl-6 sm:pl-8 mb-6">
                <div className="absolute left-[29px] sm:left-[37px] w-[2px] animate-flow-3 z-0 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 50%, #ff2a6d 100%)' }}></div>
                <div className="shrink-0 w-[12px] h-[12px] rounded-full border-[2px] border-white/30 bg-flownex-black z-10 relative"></div>
                <p className="ml-5 text-flownex-white/90 text-base sm:text-[17px]">Scattered information slows work down</p>
              </div>

              {/* Item 4 */}
              <div className="relative flex items-center pl-6 sm:pl-8">
                <div className="shrink-0 w-[12px] h-[12px] rounded-full bg-flownex-pink z-10 shadow-[0_0_10px_rgba(255,42,109,0.8)] relative"></div>
                <h3 className="ml-5 text-flownex-white font-bold text-[22px] sm:text-[25px] leading-tight">
                  We bring it all together
                </h3>
              </div>
            </div>

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
          <div className="lg:col-span-7 pt-[15vh] lg:pt-[30vh] pb-0">
            {CHAPTERS.map((chap, index) => {
              const isActive = index === activeChapter;

              return (
                <div
                  key={chap.num}
                  className="chapter-block min-h-[50vh] lg:min-h-[75vh] flex flex-col justify-center space-y-6"
                >
                  {/* Chapter Title */}
                  <h3 className="font-wide text-2xl sm:text-4xl lg:text-5xl uppercase font-bold text-flownex-pink tracking-[0.08em] leading-tight">
                    {chap.title}
                  </h3>

                  {/* Description */}
                  <div className="px-2 sm:px-3 lg:px-4 w-full max-w-[740px] xl:max-w-[820px]">
                    {chap.points ? (
                      <ul className="space-y-4 font-body text-base sm:text-lg text-flownex-white/85 font-light leading-relaxed">
                        {chap.points.map((point) => (
                          <li key={point} className="flex items-start gap-3">
                            <span className="pt-1 text-xl leading-none text-flownex-pink" aria-hidden="true">
                              •
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-base sm:text-lg text-flownex-white/85 font-light leading-relaxed">
                        {chap.description}
                      </p>
                    )}
                  </div>

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
