import type { Metadata } from "next";
import localFont from "next/font/local";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const rokiest = localFont({
  src: [
    { path: "./fonts/rokiest/Rokiest-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Semibold.otf", weight: "600", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Extrabold.otf", weight: "800", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Black.otf", weight: "900", style: "normal" },
    { path: "./fonts/rokiest/Rokiest-Extrablack.otf", weight: "950", style: "normal" },
  ],
  variable: "--font-rokiest",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowNex Solutions",
  description:
    "FlowNex connects scattered business information, communication, data, and processes into structured, automated digital systems that flow.",
};

const stripExtensionAttrs = `
(() => {
  const attrs = ["bis_skin_checked"];

  const stripFrom = (root) => {
    if (!root || !root.querySelectorAll) return;
    for (const attr of attrs) {
      root.querySelectorAll(\`[\${attr}]\`).forEach((el) => el.removeAttribute(attr));
    }
  };

  const stripNode = (node) => {
    if (!node || node.nodeType !== 1) return;
    for (const attr of attrs) {
      node.removeAttribute?.(attr);
    }
    stripFrom(node);
  };

  const run = () => {
    stripFrom(document.documentElement);
    stripFrom(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          stripNode(node);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("load", () => observer.disconnect(), { once: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rokiest.variable} ${syne.variable} ${jakarta.variable} dark`}
    >
      <head>
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {stripExtensionAttrs}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if (window.history) {
                  window.history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-flownex-black text-flownex-white antialiased selection:bg-flownex-pink selection:text-white min-h-screen"
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
