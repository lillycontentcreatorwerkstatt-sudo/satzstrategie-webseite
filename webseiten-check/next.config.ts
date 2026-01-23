import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das verhindert, dass Next.js versucht, Puppeteer zu "bundlen"
  serverExternalPackages: ["puppeteer"],
};

export default nextConfig;
