import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow, StudioNext } from "@/app/components/StudioShell";
import CopyProof from "@/app/components/CopyProof";

export const metadata: Metadata = {
  title: "Copywriting & Beratung — Satzstrategie",
  description: "Klarheit für Ihr Angebot. Copywriting für Ihre Webseite. Satzstrategie verbindet Text, Analyse und Beratung – branchenübergreifend.",
};

export default function BeratungPage() {
  return (
    <StudioShell active="/beratung">
      <section className="studio-hero studio-copy-intro">
        <StudioEyebrow number="02">Copywriting & Beratung</StudioEyebrow>
        <div className="studio-copy-columns">
          <div>
            <h1 className="studio-title">Ihr Können.<br />In <span className="studio-mark">klaren Worten.</span></h1>
            <p className="studio-lead">Sie wissen, was Ihr Unternehmen kann. Wir finden die Worte dafür – für Ihre Webseite, Ihre Leistungen und den nächsten Klick.</p>
            <div className="studio-actions"><Link className="studio-button" href="/kontakt">Über Ihre Texte sprechen <span aria-hidden="true">↗</span></Link></div>
            <nav className="studio-offer-links" aria-label="Unsere Leistungen">
              <a href="#neue-texte">Webseitentexte <span aria-hidden="true">↓</span></a>
              <a href="#texte-ueberarbeiten">Textüberarbeitung <span aria-hidden="true">↓</span></a>
              <a href="#webseitenberatung">Webseitenberatung <span aria-hidden="true">↓</span></a>
            </nav>
          </div>
          <CopyProof />
        </div>
      </section>
      <section className="studio-section" id="leistungen">
        <div className="studio-section-intro"><p className="studio-label">Text. Überarbeitung. Beratung.</p><h2>Wo setzen wir an?</h2></div>
        <ol className="studio-services">
          <li id="neue-texte"><span className="studio-label">01</span><h3>Neue Webseitentexte.</h3><p>Aus Ihrer Botschaft werden fertige Texte für Startseite, Leistungen oder Landingpage – in einem Ton, der zu Ihnen passt.</p></li>
          <li id="texte-ueberarbeiten"><span className="studio-label">02</span><h3>Bestehende Texte verbessern.</h3><p>Sie erhalten überarbeitete Texte mit klarerem Nutzen und einer nachvollziehbaren Begründung für die Änderungen.</p></li>
          <li id="webseitenberatung"><span className="studio-label">03</span><h3>Den Auftritt hinterfragen.</h3><p>Was soll Ihre Webseite verkaufen – und was vermittelt sie tatsächlich? Sie erhalten priorisierte Empfehlungen zu Text und Struktur. Ihr bestehendes Webdesignteam kann damit weiterarbeiten.</p></li>
        </ol>
      </section>
      <p className="studio-scope-note">Für kleine Unternehmen und große Teams. Ohne Branchenfestlegung. Eine Beratung setzt keinen Webseiten-Neubau voraus.</p>
      <StudioNext href="/kontakt" label="Gemeinsam den Umfang klären">Über Ihr Projekt sprechen.</StudioNext>
    </StudioShell>
  );
}
