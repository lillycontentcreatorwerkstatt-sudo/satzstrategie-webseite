import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dies stellt sicher, dass die Browser-Binärdateien beim Bauen 
  // auf den Vercel-Server mitgenommen werden.
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;
