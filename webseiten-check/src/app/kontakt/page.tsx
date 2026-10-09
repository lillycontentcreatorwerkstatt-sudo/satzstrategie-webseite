import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import StudioShell from "../components/StudioShell";
import ContactLetter from "../components/ContactLetter";
import CopyEmail from "../components/CopyEmail";
import Arrow from "../components/Arrow";
export const metadata = pageMetadata("/kontakt", "Kontakt mit Lilly | Satzstrategie", "Neue Texte, eine neue Webseite oder ein zweiter Blick? Schreiben Sie Lilly von Ihrem Vorhaben. Direkter Kontakt per E-Mail.");
export default function KontaktPage() {
  return <StudioShell active="/kontakt"><section className="contact-layout"><div className="contact-intro"><h1>Ein guter<br />Anfang.</h1><p>Ein Link. Ein paar Zeilen.<br />Erzählen Sie mir von Ihrem Vorhaben.</p><p>Neue Texte? Eine neue Webseite? Oder wissen Sie noch nicht, wo es hakt? Wir klären, was Sie brauchen. Einen Termin vereinbaren wir persönlich.</p><span className="contact-signature">Bis bald,<br /><em>Lilly</em></span><Link className="text-link" href="/analyse">Erst den Textcheck ansehen <Arrow /></Link></div><div><ContactLetter /><div className="direct-email"><p>Oder schreiben Sie direkt:</p><CopyEmail email="lillycontentcreatorwerkstatt@gmail.com" /></div></div></section></StudioShell>;
}
