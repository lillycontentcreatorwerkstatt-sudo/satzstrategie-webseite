import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow } from "@/app/components/StudioShell";

export const metadata: Metadata = {
  title: "Wer wir sind — Satzstrategie",
  description: "Lilly, Copywriterin und Gründerin von Satzstrategie. Neue Texte, klare Empfehlungen und KI-Unterstützung – persönlich verantwortet und branchenoffen.",
};

export default function AboutPage() {
  return (
    <StudioShell active="/wer-wir-sind">
      <section className="studio-hero studio-about-personal">
        <StudioEyebrow number="03">Wer wir sind</StudioEyebrow>
        <div className="studio-personal-grid">
          <div>
            <h1 className="studio-name-title">Ich bin <span>Lilly<span className="studio-name-period">.</span></span></h1>
            <p className="studio-personal-role">Copywriterin. Gründerin von Satzstrategie.</p>
            <p className="studio-lead">Ich möchte verstehen, was Sie anbieten. Und herausfinden, ob Ihre Webseite genau das erzählt.</p>
            <div className="studio-actions"><Link href="/kontakt" className="studio-button">Lernen wir uns kennen <span aria-hidden="true">↗</span></Link></div>
          </div>
          <aside className="studio-thinking-note" aria-label="Mein Blick auf Ihre Webseite">
            <p className="studio-label">Hier schaue ich genauer hin</p>
            <p className="studio-thinking-question">Sie wissen,<br />was Sie können.</p>
            <p className="studio-thinking-turn">Weiß man es auch<br />nach einem Blick auf<br /><span className="studio-mark">Ihre Webseite?</span></p>
            <p className="studio-thinking-caption">Bei dieser Lücke beginnt meine Arbeit.</p>
          </aside>
        </div>
      </section>
      <section className="studio-section studio-working-together" aria-labelledby="working-title">
        <div className="studio-section-intro"><p className="studio-label">Was unser „Wir“ bedeutet</p><h2 id="working-title">Kein anonymes Tool.<br />Ein Gegenüber.</h2></div>
        <dl className="studio-team-lines">
          <div><dt>Lilly <span>Ihre Ansprechpartnerin</span></dt><dd>Mit mir besprechen Sie Ihr Vorhaben. Ich schreibe und überarbeite Ihre Texte, prüfe Empfehlungen und verantworte das Ergebnis.</dd></div>
          <div><dt>KI-Agenten <span>Meine Unterstützung</span></dt><dd>Sie helfen bei Recherche, Entwürfen und ersten Analysen. Ihre Vorschläge sind Arbeitsmaterial – nicht das letzte Wort.</dd></div>
        </dl>
        <p className="studio-open-industry">Ich lege mich nicht auf eine Branche fest. Sondern auf die Frage, wie Ihr Angebot verständlich wird. Für kleine Unternehmen und große Teams.</p>
      </section>
    </StudioShell>
  );
}
