import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow } from "@/app/components/StudioShell";

export const metadata: Metadata = {
  title: "Gespräch anfragen — Satzstrategie",
  description: "Erzählen Sie von Ihrem Vorhaben. Fragen Sie ein Gespräch zu Copywriting, Ihrer Webseite oder einer persönlichen Analyse an.",
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
            <h1 className="studio-title">Der erste Satz<br />muss nicht<br /><span className="studio-mark">perfekt sein.</span></h1>
            <p className="studio-lead">„Mit unserer Webseite stimmt etwas nicht.“<br />Das reicht schon als Anfang.</p>
          </div>
          <div className="studio-message-sheet">
            <div className="studio-message-to"><span>An</span><strong>Lilly</strong><span>Persönlich. Nicht an einen Bot.</span></div>
            <p className="studio-message-prompt">Worum geht es<br />bei Ihnen?</p>
            <p>Ein neuer Text, ein zweiter Blick oder erst einmal eine Frage. Schreiben Sie mir.</p>
            <a href={mailto} className="studio-button">Lilly schreiben <span aria-hidden="true">↗</span></a>
            <p className="studio-form-note">Öffnet Ihr E-Mail-Programm. Einen Gesprächstermin vereinbaren wir persönlich.</p>
            <a className="studio-email-address" href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
        <details className="studio-disclosure studio-contact-help">
          <summary>Was kann ich in die Nachricht schreiben?</summary>
          <div><p>Ihr Angebot, Ihre Webseite und wobei Sie Hilfe brauchen. Ein paar Stichworte reichen – ein fertiges Briefing ist nicht nötig.</p></div>
        </details>
        <Link href="/analyse" className="studio-text-link">Lieber zuerst die Webseite prüfen? ↗</Link>
      </section>
    </StudioShell>
  );
}
