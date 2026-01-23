import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das verhindert, dass Next.js versucht, Puppeteer zu "bundlen"
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium-min",
  ],
  // Inkludiere Chromium-Binärdateien explizit für Vercel
  // Für App Router muss der Pfad mit src/app/api/** beginnen
  outputFileTracingIncludes: {
    "src/app/api/**": [
      "./node_modules/@sparticuz/chromium-min/**/*",
    ],
  },
};

export default nextConfig;
