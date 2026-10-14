import Link from "next/link";
import StudioShell from "@/app/components/StudioShell";
import FirstLookLetter from "@/app/components/FirstLookLetter";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata("/erster-blick", "Ein erster Blick auf Ihre Webseite | Satzstrategie", "Schicken Sie Lilly Ihre Webadresse und Ihr Ziel. Auf Wunsch erhalten Sie eine kostenlose kurze Ersteinschätzung per E-Mail. Persönlich, ohne automatischen Check.");

const examples = [
  { title: "Das Angebot greifbar machen", before: "Wir bieten innovative Lösungen für Ihren Erfolg.", after: "Wir schreiben die Texte, die Ihr Angebot verständlich machen.", reason: "Die Leistung wird benannt. Der Leser muss nicht erraten, was angeboten wird." },
  { title: "Den Nutzen zeigen", before: "Unsere Software verfügt über eine integrierte Terminverwaltung.", after: "Ihre Kunden buchen ihren Termin selbst. Sie behalten den Überblick.", reason: "Der Satz beschreibt, was Menschen damit tun können, statt nur eine Funktion aufzuzählen." },
  { title: "Handwerk: den nächsten Schritt benennen", before: "Mehr erfahren", after: "Renovierung besprechen", reason: "Der Link kündigt das Gespräch an. Besucher wissen, was sie beim Klicken erwartet." },
];

export default function FirstLookPage() {
  return <StudioShell active="/erster-blick">
    <section className="first-look-layout" aria-labelledby="first-look-title">
      <div className="first-look-intro">
        <h1 id="first-look-title">Ihre Webseite.<br /><span>Mein erster<br />Eindruck.</span></h1>
        <p>Schicken Sie mir Ihren Link und sagen Sie, was Ihre Webseite erreichen soll. Ich schaue persönlich drauf.</p>
        <p className="first-look-signature">Lilly</p>
        <a className="studio-button first-look-jump" href="#look-website">Webadresse eintragen</a>
        <aside className="first-look-ps"><h2>P.S.</h2><p>Auf Wunsch bekommen Sie ein bis zwei konkrete Hinweise kostenlos per E-Mail. Für neue Texte oder eine gründliche Überarbeitung besprechen wir einen Auftrag.</p></aside>
      </div>
      <FirstLookLetter />
    </section>
    <section className="first-look-examples" aria-labelledby="look-examples-title">
      <div className="first-look-examples-heading"><h2 id="look-examples-title">So wird aus Text<br />eine Aussage.</h2><p>Selbst entwickelte Beispiele, keine Kundenprojekte.</p></div>
      <div>{examples.map(example => <details key={example.title} className="first-look-example"><summary>{example.title}<span aria-hidden="true" className="example-plus" /></summary><div className="first-look-comparison"><div><h3>Vorher</h3><p><s>{example.before}</s></p></div><div><h3>Nachher</h3><p>{example.after}</p></div></div><p className="first-look-reason">{example.reason}</p></details>)}</div>
      <Link className="studio-button studio-button-secondary first-look-contact" href="#look-website">Ersteinschätzung anfragen</Link>
    </section>
  </StudioShell>;
}
