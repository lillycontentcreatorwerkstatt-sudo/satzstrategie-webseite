import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow } from "@/app/components/StudioShell";
import CopyEmail from "@/app/components/CopyEmail";

export const metadata: Metadata = {
  title: "Gespräch anfragen — Satzstrategie",
  description: "Sprechen Sie mit Lilly über Ihre Texte, Ihr Webdesign oder die technische Umsetzung. Direkter Kontakt per E-Mail, Termin nach Vereinbarung.",
};

const email = "lillycontentcreatorwerkstatt@gmail.com";
const mailto = `mailto:${email}?subject=${encodeURIComponent("Gespräch mit Satzstrategie")}&body=${encodeURIComponent("Hallo Satzstrategie,\n\nich würde gerne über mein Vorhaben sprechen.\n\nMein Angebot:\nMeine Webseite (falls vorhanden):\nDabei wünsche ich mir Unterstützung:\n\nViele Grüße")}`;

export default function ContactPage() {
  return (
    <StudioShell active="/kontakt">
      <section className="studio-hero studio-contact studio-contact-personal">
        <StudioEyebrow number="04">Gespräch anfragen</StudioEyebrow>
        <div className="studio-contact-compose">
          <div>
            <h1 className="studio-title">Was haben<br /><span className="studio-mark">Sie vor?</span></h1>
            <p className="studio-lead">Neue Texte? Eine neue Webseite?<br />Oder wissen Sie noch nicht, wo es hakt?</p>
            <div className="studio-contact-direct">
              <a href={mailto} className="studio-button">Lilly schreiben <span aria-hidden="true">↗</span></a>
              <p className="studio-form-note">Öffnet Ihr E-Mail-Programm. Einen Termin vereinbaren wir persönlich.</p>
              <CopyEmail email={email} />
            </div>
          </div>
          <div className="studio-message-sheet">
            <div className="studio-message-to"><span>An</span><strong>Lilly</strong><span>Persönlich. Nicht an einen Bot.</span></div>
            <p className="studio-message-prompt">Ein Link.<br />Ein paar Zeilen.</p>
            <p>Was bieten Sie an? Was möchten Sie ändern? Schicken Sie mir Ihre Webadresse, falls es schon eine gibt. Wir klären, was Sie brauchen.</p>
          </div>
        </div>
        <Link href="/analyse" className="studio-text-link">Erst den KI-Textcheck ausprobieren? ↗</Link>
      </section>
    </StudioShell>
  );
}
