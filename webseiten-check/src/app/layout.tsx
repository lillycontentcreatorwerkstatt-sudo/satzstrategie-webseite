import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Satzstrategie Check - Kostenlose Webseiten-Analyse",
  description: "Kostenlose KI-Analyse in 30 Sekunden. Wir prüfen Design, Botschaft und Google-Sichtbarkeit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Satzstrategie Check
              </Link>
              <Link
                href="#kontakt"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Kontakt
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-[#1A1A1A] text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-400">
                © 2026 Satzstrategie Check. Alle Rechte vorbehalten.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
