import Link from "next/link";
import InteriorShell from "@/app/components/InteriorShell";

export default function BeratungPage() {
  return (
    <InteriorShell eyebrow="Beratung" title="Nicht jede Website braucht einen Neubau. Aber jede braucht Klarheit." intro="Wir prüfen unabhängig, was Ihre Website tatsächlich vermittelt — und geben Ihnen eine klare Grundlage für die nächsten Entscheidungen.">
      <section className="service-grid" aria-label="Beratungsangebote">
        <article><span>01</span><h2>Ersteinschätzung</h2><p>Ein kompakter KI-gestützter Blick auf Verständlichkeit, Wirkung und grundlegende Zugänglichkeit.</p><Link href="/analyse">Website prüfen →</Link></article>
        <article><span>02</span><h2>Vollständige Analyse</h2><p>Wir untersuchen Positionierung, Copy, Nutzerführung, Google-Signale, KI-Zuordnung und Barrierefreiheit — persönlich eingeordnet.</p><Link href="/kontakt">Analyse anfragen →</Link></article>
        <article><span>03</span><h2>Strategische Begleitung</h2><p>Wir übersetzen die Erkenntnisse in Struktur, Texte und ein klares Briefing. Ihr bestehendes Designteam kann damit weiterarbeiten — oder wir entwickeln gemeinsam weiter.</p><Link href="/kontakt">Projekt besprechen →</Link></article>
      </section>
      <section className="statement-band"><p>Wir verkaufen Ihnen keinen Neubau, wenn eine präzise Korrektur die bessere Lösung ist.</p></section>
    </InteriorShell>
  );
}
