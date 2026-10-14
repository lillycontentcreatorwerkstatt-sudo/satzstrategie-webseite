import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import StudioShell from "../components/StudioShell";
import ServiceExperience from "../components/ServiceExperience";
export const metadata = pageMetadata("/beratung", "Text, Design & Entwicklung | Satzstrategie", "Webseitentexte, UX/UI-Design, Entwicklung und persönliche Webseitenberatung. Vom einzelnen Satz bis zum neuen Auftritt: verständlich, gut lesbar und einfach zu bedienen.");
export default function BeratungPage() {
  return <StudioShell active="/beratung" flowFooter>
    <section className="services-overview section-space" aria-labelledby="services-overview-title">
      <h1 id="services-overview-title">Was wir für<br />Sie tun.</h1>
      <dl className="services-list">
        <div><dt><a href="#neue-texte">Texte schreiben und prüfen</a></dt><dd>Wir schreiben Ihre Webseitentexte oder überarbeiten vorhandene Texte: damit Ihr Angebot verständlich wird und nach Ihnen klingt.</dd></div>
        <div><dt><a href="#design">Webseiten gestalten</a></dt><dd>Wir gestalten Seiten, die zu Ihrem Angebot passen. Schrift, Bilder und Anordnung helfen Besuchern, sich zurechtzufinden.</dd></div>
        <div><dt><a href="#entwicklung">Webseiten entwickeln</a></dt><dd>Wir setzen die Gestaltung technisch um – für Handy und Computer, mit verständlichen Formularen und klaren nächsten Schritten.</dd></div>
        <div><dt><a href="#webseitenberatung">Bestehende Webseiten prüfen</a></dt><dd>Wir sehen uns Texte, Orientierung und technische Grundlagen an. Sie erfahren, was Sie zuerst verbessern sollten.</dd></div>
      </dl>
    </section>
    <ServiceExperience />
    <section className="access-detail section-space" id="barrierefreiheit"><h2>Zugang<br />gehört dazu.</h2><div className="chapter-body"><p className="large-copy">Gut lesen. Sich zurechtfinden. Die Seite auch ohne Maus bedienen.</p><p>Wir achten auf Kontraste, verständliche Beschriftungen und eine sinnvolle Reihenfolge. Farbe allein trägt keine Information. Links bleiben erkennbar, Formulare bekommen sichtbare Hinweise. Wer am Gerät weniger Bewegung eingestellt hat, bekommt die Beispiele ohne Animationen angezeigt.</p><p>Wir sehen uns Ihre Webseite an und besprechen mit Ihnen, was geprüft und verbessert werden sollte.</p></div></section>
    <section className="advice-chapter section-space" id="webseitenberatung"><p className="advice-mark" aria-hidden="true">?</p><div><h2>Manchmal braucht es<br />einen zweiten Blick.</h2><p>Sie haben bereits eine Webseite? Wir prüfen die Texte, die Orientierung auf der Seite und die technischen Grundlagen. Sie erfahren, welche Änderungen zuerst sinnvoll sind. Unsere Empfehlungen können Sie auch an Ihr Webdesignteam weitergeben.</p><div className="service-action"><Link className="studio-button service-cta" href="/erster-blick">Einen ersten Blick anfragen</Link><p className="small-note">Auf Wunsch eine kostenlose kurze Ersteinschätzung per E-Mail. Eine ausführliche Beratung vereinbaren wir separat.</p></div></div></section>
    <section className="services-close section-space no-print"><div><h2>Wo setzen wir an?</h2><p>Einzelner Satz oder neuer Auftritt.</p></div><Link className="studio-button service-cta" href="/kontakt">Lilly kontaktieren</Link></section>
  </StudioShell>;
}
