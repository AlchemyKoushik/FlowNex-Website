import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-flownex-black">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[75vw] max-w-[1600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-flownex-burgundy via-flownex-red/20 to-transparent blur-[160px] opacity-80" />
      
      {/* Animated Pink Blobs */}
      <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-flownex-pink/10 rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] bg-flownex-pink/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 left-1/3 w-[20vw] h-[20vw] bg-flownex-pink/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      {/* Floating Animated Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M -100 320 Q 400 120 850 520 T 1700 220"
          stroke="url(#bg-pink-gradient)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          className="animate-flow-line"
        />
        <path
          d="M -50 680 Q 550 820 1050 280 T 1600 580"
          stroke="rgba(255,42,109,0.12)"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="bg-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a6d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#18030c" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

