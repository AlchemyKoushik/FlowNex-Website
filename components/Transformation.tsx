"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const FRAGMENTS = [
  { id: "EMAIL", label: "EMAIL INBOX", icon: "✉️", scatteredPos: { x: -280, y: -160 }, connectedPos: { x: -160, y: -90 } },
  { id: "FILES", label: "SCATTERED FILES", icon: "📁", scatteredPos: { x: 260, y: -190 }, connectedPos: { x: 160, y: -90 } },
  { id: "MESSAGES", label: "WHATSAPP & CALLS", icon: "💬", scatteredPos: { x: -320, y: 140 }, connectedPos: { x: -210, y: 70 } },
  { id: "DATA", label: "ISOLATED DATA", icon: "📊", scatteredPos: { x: 300, y: 130 }, connectedPos: { x: 210, y: 70 } },
  { id: "CRM", label: "UNTRACKED CRM", icon: "👤", scatteredPos: { x: 0, y: -240 }, connectedPos: { x: 0, y: -140 } },
  { id: "FORMS", label: "MANUAL FORMS", icon: "📝", scatteredPos: { x: -140, y: 240 }, connectedPos: { x: -90, y: 150 } },
  { id: "APPROVALS", label: "DELAYED APPROVALS", icon: "⏳", scatteredPos: { x: 140, y: 240 }, connectedPos: { x: 90, y: 150 } },
];

export default function Transformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [progressState, setProgressState] = useState<"SCATTERED" | "ORGANIZED" | "CONNECTED" | "FLOWING">("SCATTERED");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: pinRef.current,
        start: "top top",
        end: "+=2800",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);
          if (p < 0.25) setProgressState("SCATTERED");
          else if (p < 0.55) setProgressState("ORGANIZED");
          else if (p < 0.85) setProgressState("CONNECTED");
          else setProgressState("FLOWING");
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-flownex-black">
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col justify-between px-6 md:px-16 py-12 overflow-hidden relative"
      >
        {/* Background Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-flownex-burgundy/60 rounded-full blur-[180px] pointer-events-none transition-all duration-1000"
          style={{ opacity: 0.3 + scrollProgress * 0.5 }}
        />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-4xl mx-auto border-b border-white/10 pb-6 w-full">
          <span className="font-body text-xs text-flownex-pink font-bold tracking-widest uppercase">
            03 / THE TRANSFORMATION
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl uppercase font-extrabold text-flownex-white mt-2 tracking-tight">
            FROM DISCONNECTED TO CONNECTED.
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="font-body text-xs font-semibold text-flownex-white/60">SYSTEM STATE:</span>
            <span className="font-body text-xs font-bold text-flownex-pink uppercase tracking-widest px-4 py-1.5 rounded-full bg-flownex-pink/10 border border-flownex-pink/30">
              {progressState}
            </span>
          </div>
        </div>

        {/* Interactive Cinematic Flow Canvas */}
        <div className="relative z-10 w-full max-w-5xl mx-auto h-[460px] my-auto flex items-center justify-center">
          {/* Connecting Energy SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {FRAGMENTS.map((frag, i) => {
              const startX = 500 + frag.scatteredPos.x * (1 - scrollProgress);
              const startY = 230 + frag.scatteredPos.y * (1 - scrollProgress);
              const centerX = 500;
              const centerY = 230;

              return (
                <g key={frag.id}>
                  {/* Flowing pink connection beam */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={centerX}
                    y2={centerY}
                    stroke="#ff2a6d"
                    strokeWidth={1 + scrollProgress * 2}
                    strokeOpacity={Math.max(0, (scrollProgress - 0.2) * 1.25)}
                    strokeDasharray="4 6"
                  />
                  {scrollProgress > 0.7 && (
                    <circle
                      cx={startX + (centerX - startX) * 0.5}
                      cy={startY + (centerY - startY) * 0.5}
                      r={3}
                      fill="#ffffff"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Central FlowNex Core Node */}
          <div
            className={`z-20 w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center transition-all duration-700 ${
              scrollProgress > 0.7
                ? "bg-flownex-burgundy border-2 border-flownex-pink shadow-[0_0_60px_rgba(255,42,109,0.5)] scale-110"
                : "bg-flownex-black/80 border border-white/10 scale-95"
            }`}
          >
            <span className="font-headline text-lg md:text-xl font-bold uppercase text-flownex-white tracking-wider">
              FLOWNEX
            </span>
            <span className="font-body text-[10px] text-flownex-pink font-bold uppercase mt-1">
              CORE OS
            </span>
          </div>

          {/* Scattered / Converging System Fragments */}
          {FRAGMENTS.map((frag) => {
            const currentX = frag.scatteredPos.x * (1 - scrollProgress) + frag.connectedPos.x * scrollProgress;
            const currentY = frag.scatteredPos.y * (1 - scrollProgress) + frag.connectedPos.y * scrollProgress;

            return (
              <div
                key={frag.id}
                style={{
                  transform: `translate(${currentX}px, ${currentY}px)`,
                }}
                className={`absolute px-4 py-2.5 rounded-full font-body text-xs flex items-center gap-2 border shadow-2xl transition-colors duration-500 ${
                  scrollProgress > 0.5
                    ? "glass-panel-pink border-flownex-pink/50 text-flownex-white"
                    : "glass-panel border-white/10 text-flownex-white/60"
                }`}
              >
                <span>{frag.icon}</span>
                <span className="font-semibold tracking-wider">{frag.label}</span>
                {scrollProgress > 0.7 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-flownex-pink" />
                )}
              </div>
            );
          })}
        </div>

        {/* Section Bottom Statement */}
        <div className="relative z-10 text-center border-t border-white/10 pt-6">
          <h3 className="font-headline text-2xl md:text-4xl uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-flownex-pink to-white tracking-wider">
            ONE CONNECTED SYSTEM.
          </h3>
          <p className="font-body text-xs text-flownex-white/60 font-bold tracking-widest uppercase mt-2">
            NO SCATTERED FILES / NO ISOLATED WORKFLOWS / NO SILOED DATA
          </p>
        </div>
      </div>
    </section>
  );
}
