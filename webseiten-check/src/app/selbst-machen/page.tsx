import StudioShell from "../components/StudioShell";
import WaitlistForm from "../components/WaitlistForm";
import { pageMetadata } from "@/lib/site-metadata";
import "./selbst-machen.css";
export const metadata = pageMetadata("/selbst-machen", "Webseite selbst bauen lernen | Satzstrategie", "Ihre Webseite selbst bauen, mit Claude und Schritt für Schritt: von der ersten Zeile bis zur Seite, die bei Google gefunden wird. Start am 16. November 2026.");

// Geplante Schritte, noch gesperrt. Reihenfolge und Inhalt können sich bis zum Start ändern.
const steps = [
  ["Briefing", "Wer, was, für wen"],
  ["Texte", "Aus Floskeln werden Aussagen"],
  ["Aufbau", "Zuerst für das Handy"],
  ["Farben und Schrift", "Gut lesbar für alle"],
  ["Bauen mit Claude", "Und prüfen, was die KI schreibt"],
  ["Bilder und Tempo", "Schnell auch unterwegs"],
  ["Pflichtseiten", "Impressum, Datenschutz, Cookies"],
  ["Veröffentlichen", "Domain und Hosting"],
  ["Gefunden werden", "Google, Bing, Unternehmensprofil"],
  ["Pflegen und messen", "Damit die Seite lebt"],
];

export default function SelbstMachenPage() {
  return <StudioShell active="/selbst-machen" flowFooter><div className="diy-layout">
    <section className="diy-hero" aria-labelledby="diy-title">
      <div className="diy-sign"><span className="diy-stripes" aria-hidden="true" /><p>Hier wird gebaut</p><span className="diy-stripes" aria-hidden="true" /></div>
      <h1 id="diy-title">Ihre Webseite selbst&nbsp;bauen.</h1>
      <p className="diy-lead">Mit Claude, Schritt für Schritt. Von&nbsp;der ersten Zeile bis zur Seite, die bei Google gefunden wird. Für&nbsp;Handy und Computer, mit allem, was dazugehört.</p>
      <p className="diy-date">Start: <strong>16. November 2026</strong><span className="hand">Wenn wir schneller sind, umso besser.</span></p>
      <WaitlistForm />
    </section>
    <section className="diy-map" aria-labelledby="diy-map-title">
      <h2 id="diy-map-title">Ihr Weg zur fertigen Webseite</h2>
      <p>Geplant sind zehn Schritte. Jeder&nbsp;schaltet den nächsten frei.</p>
      <ol>{steps.map(([title, detail]) => <li key={title}><span><strong>{title}</strong>{detail}</span><svg className="diy-lock" viewBox="0 0 16 18" aria-hidden="true"><rect x="2" y="8" width="12" height="9" rx="1.5" /><path d="M5 8V5.5a3 3 0 0 1 6 0V8" /></svg><span className="visually-hidden">noch gesperrt</span></li>)}</ol>
    </section>
  </div></StudioShell>;
}
