import Image from "next/image";
import Link from "next/link";
import StudioShell from "./components/StudioShell";
import PaperExample from "./components/PaperExample";
import { ProofCaret, ProofStrike } from "./components/Proof";
import "./clear-journey.css";
import { pageMetadata, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site-metadata";
export const metadata = pageMetadata("/", SITE_TITLE, SITE_DESCRIPTION);
export default function Home() {
  return <StudioShell active="/" flowFooter>
    <div className="home-opening">
    <section className="paper-hero" aria-labelledby="home-title">
      <div className="hero-art"><Image src="/images/papierarchitektur.webp" alt="" fill preload sizes="(max-width: 760px) 82vw, 50vw" /></div>
      {/* Die Floskel wird gestrichen, die Aussage eingefügt: einmal beim Laden, sonst ruhig. */}
      <div className="hero-head">
        <p className="hero-draft"><span className="hero-draft-text"><del>Qualität, die überzeugt.</del><ProofStrike /></span><span className="hand">zu allgemein. Was genau?</span></p>
        <h1 id="home-title" className="hero-title"><ProofCaret /><span className="hero-title-words"><span>Endlich </span><span>gesehen </span><span>werden.</span></span></h1>
      </div>
      <div className="hero-bottom"><p className="hero-promise">Sie können viel. Nur sieht es keiner.<br />Das ändern wir.</p><div className="hero-actions"><Link className="studio-button hero-action" href="/kontakt">Projekt anfragen</Link><Link className="hero-example-link" href="/beispiele">Beispiele ansehen</Link><span className="hand hero-note">Ja. Das ist es. – P.</span></div><p>Texte <strong>schreiben und prüfen.</strong><br />Webseiten <strong>gestalten und entwickeln.</strong></p></div>
    </section>
    <section className="discipline-band" aria-label="Text, Design und Technik"><Link href="/leistungen#texte">Text</Link><Link href="/leistungen#gestaltung">Design</Link><Link href="/leistungen#entwicklung">Technik</Link></section>
    </div>
    <section className="home-offer section-space" id="leistungen" aria-labelledby="offer-title">
      <h2 id="offer-title">Was brauchen Sie?</h2>
      <div className="offer-lines">
        <article id="neue-texte"><h3>Die richtigen Worte</h3><p>Neue Texte für Ihre Webseite. Oder vorhandene Texte, die verständlicher werden und nach Ihnen klingen.</p><Link href="/leistungen#texte">Texte schreiben und prüfen lassen</Link></article>
        <article id="design"><h3>Eine eigene Webseite</h3><p>Vom ersten Inhalt über die Gestaltung bis zur fertigen Seite. Für Handy und Computer, mit klaren Wegen zum Kontakt.</p><Link href="/leistungen#gestaltung">Gestaltung und Entwicklung ansehen</Link></article>
      </div>
    </section>
    <PaperExample />
    <section className="home-people section-space with-margin"><h2>Lilly und Piet</h2><div><p className="large-copy">Sie sprechen mit den Menschen, die an Ihrer Webseite arbeiten.</p><p>Lilly schreibt, gestaltet und entwickelt. Piet liest mit, hinterfragt und schaut noch einmal hin.</p><Link href="/wer-wir-sind">Lilly und Piet kennenlernen</Link></div><p className="hand margin-note">gegengelesen.<br />– P.</p></section>
    <section className="home-contact section-space"><div><h2>Was haben<br />Sie vor?</h2><p>Ein neuer Auftritt, ein Text oder eine Stelle, an der Sie nicht weiterkommen. Schreiben Sie uns.</p><Link className="studio-button" href="/kontakt">Projekt anfragen</Link></div><aside><h3>Schon eine Webseite?</h3><p>Sie möchten erst wissen, wo es hakt? Wir geben Ihnen ein bis zwei konkrete Hinweise kostenlos per E-Mail.</p><Link className="studio-button studio-button-secondary" href="/erster-blick">Kostenlose Ersteinschätzung anfragen</Link><p className="hand margin-note">Antwort werktags in 24&nbsp;Stunden. –&nbsp;L.&nbsp;&amp;&nbsp;P.</p></aside></section>
  </StudioShell>;
}
