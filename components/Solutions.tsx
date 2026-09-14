"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHAPTERS = [
  {
    num: "01",
    title: "DIGITAL ECOSYSTEM IMPLEMENTATION",
    tagline: "STRUCTURE THE FOUNDATION",
    description:
      "We help businesses overcome scattered files and information, excessive reliance on manual communication through WhatsApp, email and phone calls, and disconnected digital tools by creating a structured, centralized digital workspace where information, communication and everyday operations are organized and connected.",
    points: [
      "Bring your essential digital tools into one connected workspace",
      "Give every file and document a clear, organised home",
      "Set up how your team works, shares, and collaborates",
      "Put the right access and permissions in the right hands",
    ],
    elements: [
      { name: "MICROSOFT 365 SETUP", details: "Configure Exchange, Teams, SharePoint, and OneDrive to create a unified ecosystem for your business." },
      { name: "FILE ORGANISATION", details: "Design logical folder structures and naming conventions so files are always easy to find." },
      { name: "TEAM COLLABORATION", details: "Set up channels, shared workspaces, and real-time co-authoring tools to keep teams aligned." },
      { name: "ACCESS & PERMISSIONS", details: "Implement secure access controls, ensuring data is only available to the right people." }
    ],
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
      "Get the reports you need, right when you need them",
    ],
    elements: [
      { name: "APPROVALS", details: "Automate multi-step approval chains for expenses, leave requests, and document sign-offs." },
      { name: "AUTOMATIONS", details: "Connect your apps to automatically transfer data and trigger actions without manual data entry." },
      { name: "NOTIFICATIONS", details: "Set up smart alerts via Teams or email when important events happen or deadlines approach." },
      { name: "TASKS & REMINDERS", details: "Auto-generate task lists for onboarding, projects, or recurring activities." },
      { name: "REPORTING", details: "Schedule automated report generation and distribution so stakeholders are always informed." }
    ],
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
    elements: [
      { name: "CRM", details: "Centralize customer data, communication history, and key contacts in one accessible platform." },
      { name: "LEAD MANAGEMENT", details: "Capture leads automatically from your website and route them to the right sales reps." },
      { name: "SALES PIPELINE", details: "Visualize your sales process with drag-and-drop boards to track deals at every stage." },
      { name: "FOLLOW-UPS", details: "Automate follow-up reminders and email sequences to keep leads engaged." },
      { name: "QUOTATIONS", details: "Generate professional, standardized quotes and track when they are opened or accepted." }
    ],
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
    elements: [
      { name: "SALES DASHBOARDS", details: "Track revenue, conversion rates, and sales rep performance in real-time." },
      { name: "FINANCE DASHBOARDS", details: "Monitor cash flow, expenses, and profitability metrics at a glance." },
      { name: "OPERATIONS DASHBOARDS", details: "Visualize project statuses, resource allocation, and operational bottlenecks." },
      { name: "MANAGEMENT KPIs", details: "Consolidate high-level metrics into executive summaries for strategic decision-making." }
    ],
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
    elements: [
      { name: "DOCUMENT AI", details: "Extract key data from invoices, contracts, and forms automatically." },
      { name: "SALES AI", details: "Analyze sales calls for insights, sentiment, and action items." },
      { name: "KNOWLEDGE AI", details: "Chat with your internal wikis and documents to get instant, accurate answers." },
      { name: "CONTENT AI", details: "Draft emails, proposals, and marketing copy using AI trained on your brand voice." }
    ],
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
    elements: [
      { name: "TRACKERS", details: "Custom databases and interfaces for tracking assets, inventory, or specialized processes." },
      { name: "CALCULATORS", details: "Interactive tools for complex pricing, quotes, or ROI estimation." },
      { name: "INTERNAL APPS", details: "Web and mobile apps built specifically for your employees' workflows." },
      { name: "CUSTOM WORKFLOWS", details: "Bespoke automation logic bridging gaps between your unique software stack." }
    ],
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="solutions"
      className="relative w-full bg-transparent text-flownex-white pt-28 md:pt-36 pb-8 md:pb-12 px-6 md:px-16"
    >
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
                <p className="ml-5 text-flownex-white/90 text-base sm:text-[17px]">Your business has information everywhere</p>
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
                  <div className="pt-2 w-full max-w-full">
                    {/* Hide scrollbar with CSS class or inline style, using a container that scrolls horizontally */}
                    <div className="flex flex-nowrap items-start gap-3 overflow-x-auto pb-4 pr-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
                      {chap.elements.map((el, i) => (
                        <div
                          key={i}
                          className={`group relative flex flex-col items-center rounded-3xl font-body text-xs tracking-wider transition-all duration-500 overflow-hidden shrink-0 ${
                            isActive
                              ? "bg-flownex-burgundy/90 text-flownex-white border border-flownex-pink/40 shadow-[0_0_15px_rgba(255,42,109,0.25)] hover:bg-flownex-burgundy hover:border-flownex-pink/70 hover:shadow-[0_0_20px_rgba(255,42,109,0.4)]"
                              : "bg-white/5 text-flownex-white/40 border border-white/5"
                          }`}
                        >
                          <div className={`px-4 py-2 font-semibold text-center whitespace-nowrap transition-all duration-300 group-hover:font-extrabold ${isActive ? "group-hover:text-flownex-pink" : ""}`}>
                            {el.name}
                          </div>
                          
                          {/* Expanded content area */}
                          <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-in-out px-4 w-full">
                            <div className="overflow-hidden">
                              <div className="pb-4 pt-1 text-xs leading-relaxed text-flownex-white/85 text-center font-normal normal-case tracking-normal whitespace-normal break-words w-[140px] mx-auto">
                                {el.details}
                              </div>
                            </div>
                          </div>
                        </div>
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
