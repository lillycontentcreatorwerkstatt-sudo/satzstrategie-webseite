import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow, StudioNext } from "@/app/components/StudioShell";

export const metadata: Metadata = {
  title: "Copywriting, Webdesign & Entwicklung — Satzstrategie",
  description: "Webseitentexte, UX/UI-Design, Entwicklung und persönliche Webseitenanalyse. Einzelne Leistungen oder ein neuer Auftritt. Ohne Branchenbindung.",
};

export default function BeratungPage() {
  return (
    <StudioShell active="/beratung">
      <section className="studio-hero studio-copy-intro">
        <StudioEyebrow number="02">Leistungen</StudioEyebrow>
        <div className="studio-copy-columns">
          <div>
            <h1 className="studio-title">Jeder Satz.<br /><span className="studio-mark">Jeder Klick.</span></h1>
            <p className="studio-lead">Wir schreiben, gestalten und entwickeln Webseiten. Oder verbessern die, die Sie schon haben.</p>
            <div className="studio-actions"><Link className="studio-button" href="/kontakt">Ihr Projekt besprechen <span aria-hidden="true">↗</span></Link></div>
            <nav className="studio-offer-links" aria-label="Unsere Leistungen">
              <a href="#neue-texte">Webseitentexte <span aria-hidden="true">↓</span></a>
              <a href="#design">UX/UI-Design <span aria-hidden="true">↓</span></a>
              <a href="#entwicklung">Entwicklung <span aria-hidden="true">↓</span></a>
              <a href="#webseitenberatung">Analyse & Beratung <span aria-hidden="true">↓</span></a>
            </nav>
          </div>
          <aside className="studio-thinking-note" aria-label="Unser Blick auf Ihre Webseite">
            <p className="studio-label">Hier schauen wir genauer hin</p>
            <p className="studio-thinking-question">Sie wissen,<br />was Sie können.</p>
            <p className="studio-thinking-turn">Weiß man es auch<br />nach einem Blick auf<br /><span className="studio-mark">Ihre Webseite?</span></p>
            <p className="studio-thinking-caption">Wir prüfen Text, Bedienung und Code.</p>
          </aside>
        </div>
      </section>
      <section className="studio-section" id="leistungen">
        <div className="studio-section-intro"><p className="studio-label">Einzeln oder zusammen</p><h2>Was fehlt Ihrer Webseite?</h2></div>
        <ol className="studio-services">
          <li id="neue-texte"><span className="studio-label">01</span><h3>Die richtigen Worte.</h3><p>Wir schreiben Ihre Startseite, Leistungsseiten und Landingpages. Oder überarbeiten Ihre Texte: Was bieten Sie an? Für wen? Warum Sie?</p></li>
          <li id="design"><span className="studio-label">02</span><h3>Ein klarer Weg.</h3><p>Wir gestalten Aufbau, Oberflächen und Kontaktwege. Zuerst fürs Smartphone. Mit lesbarer Schrift, klaren Kontrasten und verständlicher Bedienung.</p></li>
          <li id="entwicklung"><span className="studio-label">03</span><h3>Der Code dahinter.</h3><p>Wir setzen die Webseite technisch um. Mit sauberer HTML-Struktur, Metadaten und passenden strukturierten Daten. Damit Suchsysteme erkennen können, wer Sie sind und was Sie anbieten.</p></li>
          <li id="webseitenberatung"><span className="studio-label">04</span><h3>Ein ehrlicher Befund.</h3><p>Was soll Ihre Webseite verkaufen? Was kommt an? Wir prüfen Text, Nutzerführung und technische Grundlagen. Sie erhalten eine Analyse mit konkreten nächsten Schritten – auch zur Übergabe an Ihr Webdesignteam.</p></li>
        </ol>
      </section>
      <p className="studio-scope-note">Ein neuer Text ist kein Auftrag für eine neue Webseite. Sie beauftragen, was Sie brauchen.</p>
      <StudioNext href="/kontakt" label="Text, Design oder Technik?">Wo hakt es bei Ihnen?</StudioNext>
    </StudioShell>
  );
}
