/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        flownex: {
          black: "#030305",
          darker: "#020203",
          card: "#0b0b12",
          burgundy: "#18030c",
          red: "#2c0615",
          pink: "#ff2a6d",
          "pink-light": "#ff5285",
          "pink-subtle": "rgba(255, 42, 109, 0.12)",
          white: "#ffffff",
          "off-white": "#e5e5ec",
          muted: "#88889a",
          border: "rgba(255, 255, 255, 0.08)",
          "border-pink": "rgba(255, 42, 109, 0.25)",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        headline: ["var(--font-anton)", "sans-serif"],
        wide: ["var(--font-outfit)", "var(--font-syne)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 8s ease-in-out infinite alternate",
        "flow-line": "flowLine 12s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%": { opacity: "0.3", transform: "scale(1)" },
          "100%": { opacity: "0.75", transform: "scale(1.1)" },
        },
        flowLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
