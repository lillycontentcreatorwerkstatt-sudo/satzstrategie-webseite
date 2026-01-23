import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das verhindert, dass Next.js versucht, Puppeteer zu "bundlen"
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium-min",
  ],
  // Inkludiere Chromium-Binärdateien explizit für Vercel
  // outputFileTracingIncludes wurde aus experimental verschoben (Next.js 16+)
  outputFileTracingIncludes: {
    "/api/analyze/**": [
      "./node_modules/@sparticuz/chromium-min/**/*",
    ],
  },
};

export default nextConfig;
