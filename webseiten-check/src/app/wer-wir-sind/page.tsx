import InteriorShell from "@/app/components/InteriorShell";

const roles = [
  ["Strategische Führung", "Mensch", "Gespräche, Einordnung und jede finale Empfehlung werden persönlich verantwortet."],
  ["Website-Wirkung", "KI-Agent", "Prüft Botschaft, Copy und Nutzerführung aus der Perspektive Ihrer Besucher:innen."],
  ["Auffindbarkeit", "KI-Agent", "Untersucht, welche Signale Google und KI-Systeme Ihrem Unternehmen eindeutig zuordnen können."],
  ["Zugänglichkeit", "KI-Agent", "Findet Barrieren, die Menschen ausschließen oder die Nutzung unnötig erschweren."],
];

export default function AboutPage() {
  return (
    <InteriorShell eyebrow="Wer wir sind" title="Eine Gründerin. Mehrere spezialisierte Blickwinkel." intro="Satzstrategie ist ein menschlich geführtes, KI-gestütztes Strategiestudio. Transparent in der Arbeitsweise, persönlich in der Verantwortung.">
      <section className="role-grid">
        {roles.map(([title, type, copy]) => <article key={title}><span>{type}</span><h2>{title}</h2><p>{copy}</p></article>)}
      </section>
      <section className="statement-band"><p>Menschlich geführt. KI-gestützt. Persönlich verantwortet.</p></section>
    </InteriorShell>
  );
}
