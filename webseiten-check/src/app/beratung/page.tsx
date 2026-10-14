import { pageMetadata } from "@/lib/site-metadata";
import Link from "next/link";
import StudioShell from "../components/StudioShell";
import ServiceExperience from "../components/ServiceExperience";
export const metadata = pageMetadata("/beratung", "Text, Design & Entwicklung | Satzstrategie", "Webseitentexte, UX/UI-Design, Entwicklung und persönliche Webseitenberatung. Vom einzelnen Satz bis zum neuen Auftritt, mit Blick auf Barrierefreiheit.");
export default function BeratungPage() {
  return <StudioShell active="/beratung" flowFooter>
    <ServiceExperience standalone />
    <section className="access-detail section-space" id="barrierefreiheit"><h2>Zugang<br />gehört dazu.</h2><div className="chapter-body"><p className="large-copy">Barrierefreiheit beginnt bei den Entscheidungen, die wir beim Gestalten treffen.</p><p>Wir achten auf Kontraste, verständliche Beschriftungen und eine sinnvolle Reihenfolge. Farbe allein trägt keine Information. Links bleiben erkennbar, Formulare bekommen sichtbare Hinweise und Bewegungen berücksichtigen die Geräteeinstellung.</p><p>Wir sehen uns Ihre Webseite an und besprechen mit Ihnen, was geprüft und verbessert werden sollte.</p></div></section>
    <section className="advice-chapter section-space" id="webseitenberatung"><p className="advice-mark" aria-hidden="true">?</p><div><h2>Manchmal braucht es<br />einen zweiten Blick.</h2><p>Sie haben bereits eine Webseite? Wir prüfen die Texte, die Orientierung auf der Seite und die technischen Grundlagen. Sie erfahren, welche Änderungen zuerst sinnvoll sind. Unsere Empfehlungen können Sie auch an Ihr Webdesignteam weitergeben.</p><div className="service-action"><Link className="studio-button service-cta" href="/erster-blick">Einen ersten Blick anfragen</Link><p className="small-note">Auf Wunsch eine kostenlose kurze Ersteinschätzung per E-Mail. Eine ausführliche Beratung vereinbaren wir separat.</p></div></div></section>
    <section className="services-close section-space no-print"><div><h2>Wo setzen wir an?</h2><p>Einzelner Satz oder neuer Auftritt.</p></div><Link className="studio-button service-cta" href="/kontakt">Lilly kontaktieren</Link></section>
  </StudioShell>;
}
