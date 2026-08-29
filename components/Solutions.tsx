"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CHAPTERS = [
  {
    num: "01",
    label: "CHAPTER 01 OF 06",
    title: "DIGITAL BUSINESS SETUP",
    tagline: "STRUCTURE THE FOUNDATION",
    description:
      "We help businesses overcome scattered files and information, excessive reliance on manual communication through WhatsApp, email and phone calls, and disconnected digital tools by creating a structured, centralized digital workspace where information, communication and everyday operations are organized and connected.",
    elements: ["FILES", "MESSAGES", "TEAMS", "WORKSPACES", "DOCUMENTS"],
  },
  {
    num: "02",
    label: "CHAPTER 02 OF 06",
    title: "PROCESS & WORKFLOW AUTOMATION",
    tagline: "TURN REPETITION INTO FLOW",
    description:
      "Replace repetitive manual work with structured digital workflows that automatically move requests, approvals, notifications, tasks and information to the right people at the right time.",
    elements: ["REQUEST", "APPROVAL", "ACTION", "COMPLETE"],
  },
  {
    num: "03",
    label: "CHAPTER 03 OF 06",
    title: "SALES & CUSTOMER MANAGEMENT",
    tagline: "FROM FIRST CONTACT TO CUSTOMER",
    description:
      "Bring leads, customer information, follow-ups and sales activity into one organized system so your team can see what needs attention, what is moving forward and what is being missed.",
    elements: ["LEAD", "CONTACT", "DEAL", "CUSTOMER"],
  },
  {
    num: "04",
    label: "CHAPTER 04 OF 06",
    title: "REPORTING & BUSINESS INTELLIGENCE",
    tagline: "TURN DATA INTO DIRECTION",
    description:
      "Turn scattered business data into clear reports, dashboards and insights that help you understand performance, track important metrics and make better decisions.",
    elements: ["KPI", "TREND", "DATA", "INSIGHT"],
  },
  {
    num: "05",
    label: "CHAPTER 05 OF 06",
    title: "AI FOR BUSINESS",
    tagline: "MAKE INFORMATION WORK HARDER",
    description:
      "Apply AI where it can create real business value — from finding and understanding information to assisting employees, processing documents, analyzing data and automating intelligent tasks.",
    elements: ["INFORMATION", "AI ENGINE", "ACTION"],
  },
  {
    num: "06",
    label: "CHAPTER 06 OF 06",
    title: "CUSTOM BUSINESS TOOLS",
    tagline: "BUILD AROUND YOUR BUSINESS",
    description:
      "When existing software does not fit the way your business works, we build focused digital tools around your specific requirements — from internal portals and trackers to dashboards, calculators and custom workflows.",
    elements: ["NEED", "CUSTOM SYSTEM", "RESULT"],
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
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveChapter(index),
          onEnterBack: () => setActiveChapter(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="solutions"
      className="relative w-full bg-flownex-black text-flownex-white py-24 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header Top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-white/10 pb-12 mb-16">
          <div className="lg:col-span-6">
            <span className="font-mono text-xs text-flownex-pink tracking-widest uppercase">
              02 / CORE CAPABILITIES
            </span>
            <h2 className="font-headline text-5xl sm:text-7xl lg:text-8xl uppercase font-extrabold text-flownex-white tracking-tight leading-[0.88] mt-2">
              WHAT WE DO
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pl-12 flex items-end">
            <p className="font-body text-base md:text-lg text-flownex-white/80 font-light leading-relaxed border-l-2 border-flownex-pink/50 pl-6">
              Every business has information, people and processes moving through it. When those things are scattered, work slows down. FlowNex connects them into systems that work together.
            </p>
          </div>
        </div>

        {/* Two-Column Pinned Architecture: Left Fixed Sticky Anchor, Right Scrolling Chapters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
          {/* LEFT COLUMN: Sticky Visual Anchor */}
          <div className="lg:col-span-5 sticky top-28 self-start space-y-8 py-4">
            <div>
              <span className="font-mono text-xs text-flownex-pink font-bold tracking-widest uppercase">
                SYSTEM OPERATING MODEL
              </span>
              <h3 className="font-headline text-4xl sm:text-6xl uppercase font-bold text-flownex-white tracking-tight mt-1 leading-[0.9]">
                WHAT WE DO
              </h3>
            </div>

            {/* Chapter Progress Indicator */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between font-mono text-xs text-flownex-white/60">
                <span className="text-flownex-pink font-bold">
                  CHAPTER {CHAPTERS[activeChapter].num} / 06
                </span>
                <span>{CHAPTERS[activeChapter].title}</span>
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

            {/* Current Active Tagline Display */}
            <div className="p-4 rounded-xl bg-flownex-burgundy/60 border border-flownex-pink/30 font-mono text-xs text-flownex-pink uppercase tracking-widest font-semibold">
              [ {CHAPTERS[activeChapter].tagline} ]
            </div>
          </div>

          {/* RIGHT COLUMN: 6 Scrolling Editorial Chapters */}
          <div className="lg:col-span-7 space-y-28 md:space-y-36">
            {CHAPTERS.map((chap, index) => {
              const isActive = index === activeChapter;

              return (
                <div
                  key={chap.num}
                  className={`chapter-block transition-all duration-700 space-y-6 ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-40 translate-y-4"
                  }`}
                >
                  {/* Chapter Header */}
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <span className="font-mono text-5xl md:text-7xl font-bold text-flownex-pink tracking-tight">
                      {chap.num}
                    </span>
                    <span className="font-mono text-xs text-flownex-white/50 tracking-widest uppercase">
                      {chap.label}
                    </span>
                  </div>

                  {/* Chapter Title */}
                  <h3 className="font-headline text-3xl sm:text-5xl uppercase font-bold text-flownex-white tracking-tight leading-tight">
                    {chap.title}
                  </h3>

                  {/* Chapter Description */}
                  <p className="font-body text-base md:text-lg text-flownex-white/80 font-light leading-relaxed">
                    {chap.description}
                  </p>

                  {/* Subtle System Fragment Visual Line */}
                  <div className="pt-6">
                    <div className="font-mono text-[10px] text-flownex-white/40 tracking-widest uppercase mb-3">
                      SYSTEM FRAGMENTS CONNECTED:
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {chap.elements.map((el, i) => (
                        <React.Fragment key={i}>
                          <span
                            className={`px-3 py-1.5 rounded font-mono text-xs font-semibold tracking-wider transition-all duration-500 ${
                              isActive
                                ? "bg-flownex-burgundy/80 text-flownex-white border border-flownex-pink/40"
                                : "bg-white/5 text-flownex-white/40 border border-white/5"
                            }`}
                          >
                            {el}
                          </span>
                          {i < chap.elements.length - 1 && (
                            <span className="text-flownex-pink font-mono text-xs">→</span>
                          )}
                        </React.Fragment>
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
