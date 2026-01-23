import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das verhindert, dass Next.js versucht, Puppeteer zu "bundlen"
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium-min",
  ],
  // Inkludiere Chromium-Binärdateien explizit für Vercel
  experimental: {
    outputFileTracingIncludes: {
      "/api/analyze/**": [
        "./node_modules/@sparticuz/chromium-min/**/*",
      ],
    },
  },
};

export default nextConfig;
