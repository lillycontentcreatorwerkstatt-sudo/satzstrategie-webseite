import Link from "next/link";
import type { ReactNode } from "react";

export default function InteriorShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="interior-page">
      <header className="interior-header">
        <Link className="interior-brand" href="/">satzstrategie.</Link>
        <nav aria-label="Hauptnavigation">
          <Link href="/analyse">Analyse</Link><Link href="/beratung">Beratung</Link><Link href="/wer-wir-sind">Wer wir sind</Link>
        </nav>
        <Link className="interior-contact" href="/kontakt">Gespräch buchen ↗</Link>
      </header>
      <main>
        <section className="interior-hero">
          <p className="interior-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="interior-intro">{intro}</p>
        </section>
        {children}
      </main>
      <footer className="interior-footer">
        <span>© 2026 Satzstrategie</span>
        <div><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
      </footer>
    </div>
  );
}
