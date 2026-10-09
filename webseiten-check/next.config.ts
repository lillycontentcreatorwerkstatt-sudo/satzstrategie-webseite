import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
  devIndicators: false,
  async redirects() {
    return [
      { source: "/kontakt.html", destination: "/kontakt", permanent: true },
      { source: "/datenschutz.html", destination: "/datenschutz", permanent: true },
      { source: "/impressum.html", destination: "/impressum", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
