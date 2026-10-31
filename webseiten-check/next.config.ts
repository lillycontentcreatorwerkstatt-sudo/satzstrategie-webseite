import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
  devIndicators: false,
  async redirects() {
    return [
      { source: "/beratung", destination: "/leistungen", permanent: true },
      { source: "/angebot.html", destination: "/leistungen", permanent: true },
      { source: "/referenzen", destination: "/beispiele", permanent: true },
      { source: "/wir-sind", destination: "/wer-wir-sind", permanent: true },
      { source: "/ueber-uns", destination: "/wer-wir-sind", permanent: true },
      { source: "/kontakt.html", destination: "/kontakt", permanent: true },
      { source: "/datenschutz.html", destination: "/datenschutz", permanent: true },
      { source: "/impressum.html", destination: "/impressum", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/selbst-machen/texte", destination: "/selbst-machen", permanent: true },
    ];
  },
};

export default nextConfig;
