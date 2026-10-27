import Link from "next/link";
import StudioShell from "../components/StudioShell";
import FirstLookLetter from "../components/FirstLookLetter";
import CopyEmail from "../components/CopyEmail";
import { pageMetadata } from "@/lib/site-metadata";
import { INQUIRY_EMAIL } from "@/lib/inquiry";
import "../clear-journey.css";
export const metadata = pageMetadata("/erster-blick", "Webseite prüfen lassen: kostenlose Ersteinschätzung | Satzstrategie", "Lilly und Piet sehen sich Ihre Webseite persönlich an. Sie erhalten ein bis zwei konkrete Hinweise kostenlos per E-Mail, keine automatische Auswertung.");
export default function FirstLookPage() {
  return <StudioShell active="/erster-blick" flowFooter><section className="contact-layout first-look-simple"><div className="contact-intro"><h1>Ihre Webseite,<br /><span>unser erster<br />Eindruck.</span></h1><p>Wir schauen uns Ihre Seite persönlich an. Sie bekommen ein bis zwei konkrete Hinweise kostenlos per E-Mail. Ihre Ersteinschätzung erhalten Sie werktags innerhalb von 24 Stunden.</p><p>Schicken Sie uns Ihre Webadresse und sagen Sie, was die Seite erreichen soll. Das ist eine erste Einschätzung, keine vollständige Prüfung.</p><p>Wenn Sie eine andere Art der Rückmeldung wünschen, schreiben Sie es einfach dazu.</p><a className="first-look-mobile-link" href="#inquiry-website">Webadresse eintragen</a><span className="contact-signature">Bis bald,<br /><em>Lilly und Piet</em></span></div><div><FirstLookLetter /><div className="direct-email"><p>Lieber direkt schreiben?</p><CopyEmail email={INQUIRY_EMAIL} /></div></div></section><div className="quiet-next"><p>Sie planen bereits einen konkreten Auftrag?</p><Link href="/kontakt">Ihr Projekt anfragen</Link></div></StudioShell>;
}
