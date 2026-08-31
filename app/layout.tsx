import type { Metadata } from "next";
import { Syne, Anton, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowNex Solutions — Creative Business Technology Studio",
  description:
    "FlowNex connects scattered business information, communication, data, and processes into structured, automated digital systems that flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${anton.variable} ${jakarta.variable} ${outfit.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-flownex-black text-flownex-white antialiased selection:bg-flownex-pink selection:text-white min-h-screen"
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
