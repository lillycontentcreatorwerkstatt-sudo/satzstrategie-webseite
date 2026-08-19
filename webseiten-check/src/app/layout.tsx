import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satzstrategie — gefunden, verstanden und gewählt",
  description: "Satzstrategie analysiert, wie Menschen, Google und KI Ihre Website wahrnehmen — für mehr Klarheit, Sichtbarkeit und Wirkung.",
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
