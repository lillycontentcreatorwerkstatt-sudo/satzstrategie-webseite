import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das stellt sicher, dass Chromium korrekt auf den Vercel-Server kopiert wird
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;
