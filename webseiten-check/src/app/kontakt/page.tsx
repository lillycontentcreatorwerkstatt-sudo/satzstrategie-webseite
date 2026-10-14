import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import StudioShell from "../components/StudioShell";
import ContactLetter from "../components/ContactLetter";
import CopyEmail from "../components/CopyEmail";
import "../clear-journey.css";
export const metadata = pageMetadata("/kontakt", "Kontakt mit Lilly und Piet | Satzstrategie", "Neue Texte, eine neue Webseite oder eine Ersteinschätzung? Schreiben Sie uns von Ihrem Vorhaben. Direkter Kontakt per E-Mail.");
export default function KontaktPage() {
  return <StudioShell active="/kontakt" flowFooter><section className="contact-layout"><div className="contact-intro"><h1>Ein guter<br />Anfang.</h1><p>Ein paar Zeilen genügen.<br />Erzählen Sie uns von Ihrem Vorhaben.</p><p>Neue Texte? Eine neue Webseite? Oder wissen Sie noch nicht, wo es hakt? Gemeinsam klären wir, was Sie brauchen. Sie bekommen zunächst eine Rückmeldung per E-Mail. Ob wir danach telefonieren, uns per Video oder vor Ort treffen, entscheiden wir gemeinsam.</p><span className="contact-signature">Bis bald,<br /><em>Lilly und Piet</em></span></div><div><ContactLetter /><div className="direct-email"><p>Oder schreiben Sie direkt:</p><CopyEmail email="lillycontentcreatorwerkstatt@gmail.com" /></div><div className="contact-alternative"><Link className="studio-button studio-button-secondary" href="/erster-blick">Eine Ersteinschätzung anfragen</Link></div></div></section></StudioShell>;
}
