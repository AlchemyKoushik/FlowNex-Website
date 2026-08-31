"use client";

import React from "react";

interface FlowNexWordmarkProps {
  className?: string;
  fill?: string;
  idPrefix?: string;
  animated?: boolean;
}

export default function FlowNexWordmark({
  className = "w-full h-auto",
  fill = "currentColor",
  idPrefix = "hero",
  animated = false,
}: FlowNexWordmarkProps) {
  return (
    <svg
      viewBox="0 0 1200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill={fill}>
        {/* F */}
        <g id={`${idPrefix}-letter-F`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 10 10 H 140 V 52 H 60 V 84 H 130 V 126 H 60 V 190 H 10 Z" />
        </g>

        {/* L */}
        <g id={`${idPrefix}-letter-L`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 155 10 H 205 V 148 H 285 V 190 H 155 Z" />
        </g>

        {/* O */}
        <g id={`${idPrefix}-letter-O`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 300 10 H 450 V 190 H 300 Z M 350 54 V 146 H 400 V 54 Z" fillRule="evenodd" />
        </g>

        {/* W */}
        <g id={`${idPrefix}-letter-W`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 465 10 H 515 L 545 130 L 575 10 H 625 L 655 130 L 685 10 H 735 L 680 190 H 630 L 600 80 L 570 190 H 520 Z" />
        </g>

        {/* N */}
        <g id={`${idPrefix}-letter-N`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 750 10 H 800 L 845 125 V 10 H 895 V 190 H 845 L 800 75 V 190 H 750 Z" />
        </g>

        {/* E */}
        <g id={`${idPrefix}-letter-E`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 910 10 H 1040 V 52 H 960 V 80 H 1030 V 120 H 960 V 148 H 1040 V 190 H 910 Z" />
        </g>

        {/* X */}
        <g id={`${idPrefix}-letter-X`} className={animated ? "wordmark-piece" : ""}>
          <path d="M 1055 10 H 1108 L 1140 76 L 1172 10 H 1225 L 1168 100 L 1225 190 H 1172 L 1140 124 L 1108 190 H 1055 L 1112 100 Z" />
        </g>
      </g>
    </svg>
  );
}

