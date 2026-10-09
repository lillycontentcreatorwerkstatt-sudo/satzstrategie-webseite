import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satzstrategie — Copywriting, Webdesign & Entwicklung",
  description: "Texte schreiben. Webseiten gestalten und entwickeln. Lilly und Piet prüfen bestehende Auftritte und helfen bei der Überarbeitung. Auch ohne kompletten Neubau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
