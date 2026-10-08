import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow } from "@/app/components/StudioShell";

export const metadata: Metadata = {
  title: "Wer wir sind — Satzstrategie",
  description: "Lilly und Piet haben Satzstrategie gemeinsam ins Leben gerufen. Lilly verantwortet Copywriting und Beratung, Piet bringt den zweiten Blick ein. KI-Agenten unterstützen beide.",
};

export default function AboutPage() {
  return (
    <StudioShell active="/wer-wir-sind">
      <section className="studio-hero studio-about-personal">
        <StudioEyebrow number="03">Wer wir sind</StudioEyebrow>
        <div className="studio-personal-grid">
          <div>
            <h1 className="studio-title"><span className="studio-mark">Lilly</span> &amp; <span className="studio-mark">Piet</span><span className="studio-name-period">.</span></h1>
            <p className="studio-personal-role">Zwei Menschen. Viele KI-Agenten.</p>
            <p className="studio-lead">Satzstrategie haben wir gemeinsam ins Leben gerufen – mit unterschiedlichen Stärken und einem gemeinsamen Blick für das, was Ihre Webseite sagen soll.</p>
            <div className="studio-actions"><Link href="/kontakt" className="studio-button">Lernen wir uns kennen <span aria-hidden="true">↗</span></Link></div>
          </div>
          <aside className="studio-thinking-note" aria-label="Unser Blick auf Ihre Webseite">
            <p className="studio-label">Hier schauen wir genauer hin</p>
            <p className="studio-thinking-question">Sie wissen,<br />was Sie können.</p>
            <p className="studio-thinking-turn">Weiß man es auch<br />nach einem Blick auf<br /><span className="studio-mark">Ihre Webseite?</span></p>
            <p className="studio-thinking-caption">Bei dieser Lücke beginnt unsere Arbeit.</p>
          </aside>
        </div>
      </section>
      <section className="studio-section studio-working-together" aria-labelledby="working-title">
        <div className="studio-section-intro"><p className="studio-label">Wer was einbringt</p><h2 id="working-title">Zwei Perspektiven.<br />Persönlich verantwortlich.</h2></div>
        <dl className="studio-team-lines">
          <div><dt>Lilly <span>Worte und Strategie</span></dt><dd>Ihre Ansprechpartnerin für Copywriting und Beratung. Sie schreibt, überarbeitet und bringt Ihre Botschaft auf den Punkt.</dd></div>
          <div><dt>Piet <span>Der zweite Blick · Inhaber</span></dt><dd>Er arbeitet im Hintergrund, hinterfragt Entwürfe und prüft mit seinem Gespür, ob das Ergebnis überzeugt.</dd></div>
          <div><dt>Unsere KI-Agenten <span>Vielseitige Unterstützung</span></dt><dd>Sie helfen bei Recherche, Analysen und Entwürfen. Die Entscheidungen und die Verantwortung bleiben bei uns Menschen.</dd></div>
        </dl>
        <p className="studio-open-industry">Wir legen uns nicht auf eine Branche fest. Sondern auf die Frage, wie Ihr Angebot verständlich wird. Für kleine Unternehmen und große Teams.</p>
      </section>
    </StudioShell>
  );
}
