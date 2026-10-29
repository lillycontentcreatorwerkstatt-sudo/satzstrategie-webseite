import type { Metadata } from "next";
import Link from "next/link";
import StudioShell from "./components/StudioShell";
export const metadata: Metadata = { title: "Seite nicht gefunden | Satzstrategie", robots: { index: false, follow: true } };
export default function NotFound() {
  return <StudioShell active="" flowFooter><section className="not-found"><h1>Hier fehlt<br />eine Seite.</h1><p>Die Adresse stimmt nicht oder der Inhalt ist umgezogen. Hier&nbsp;kommen Sie weiter:</p><nav className="recovery-links" aria-label="Weiterführende Seiten"><Link href="/leistungen">Leistungen</Link><Link href="/beispiele">Arbeitsproben</Link><Link href="/erster-blick">Kostenlose Ersteinschätzung</Link><Link href="/kontakt">Kontakt</Link></nav><Link className="studio-button" href="/">Zur Startseite</Link></section></StudioShell>;
}
