import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Diese Einstellung zwingt Vercel, die Chromium-Dateien 
  // komplett und unverändert auf den Server zu kopieren.
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;
