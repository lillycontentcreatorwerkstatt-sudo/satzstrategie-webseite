import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Puppeteer für Serverless-Umgebungen optimieren
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
};

export default nextConfig;
