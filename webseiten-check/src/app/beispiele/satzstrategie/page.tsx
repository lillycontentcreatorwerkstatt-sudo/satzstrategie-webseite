import { pageMetadata } from '@/lib/site-metadata';
import StudioShell, { StudioNext } from '../../components/StudioShell';
import { Comparison, Explanation } from '../work-examples';
import '../referenzen.css';

export const metadata = pageMetadata('/beispiele/satzstrategie', 'Fallstudie: unsere eigene Webseite – Text, Design, Technik | Satzstrategie', 'Wie wir satzstrategie.de geschrieben, gestaltet und gebaut haben: echte frühere Fassungen, die Gründe für jede Änderung und gemessene Werte.');

// Fallstudie in eigener Sache: Jedes Vorher ist eine frühere, veröffentlichte Fassung dieser Seite, jede Zahl ist gemessen.
export default function CaseStudyPage() {
  return <StudioShell active="/beispiele" flowFooter>
    <div className="work-page">
      <header className="work-intro work-intro-light">
        <h1>Fallstudie.</h1>
        <div className="work-intro-copy"><p className="work-lead">Unsere&nbsp;eigene Webseite,<br />Fassung für Fassung.</p><p>Lilly hat diese Webseite geschrieben, gestaltet und gebaut. Piet&nbsp;hat gegengelesen. Jedes&nbsp;Vorher auf dieser Seite war einmal veröffentlicht. Hier&nbsp;steht, was wir geändert haben und warum.</p></div>
        <nav id="beispielauswahl" tabIndex={-1} className="work-index" aria-label="Bereiche der Fallstudie"><a href="#text">Text</a><a href="#design">Design</a><a href="#code">Technik</a><a href="#ergebnis">Ergebnis</a></nav>
      </header>
      <section className="open-case" id="text" aria-labelledby="case-text"><header><h2 id="case-text">Vom&nbsp;Selbstbild<br />zum Versprechen</h2><p>Startseite, Hauptüberschrift</p></header>
        <Comparison before={<p className="example-sentence">„Wörter brauchen Haltung.“</p>} after={<p className="example-sentence">„Endlich gesehen werden.“</p>} />
        <Explanation before="Die Überschrift sagte etwas über uns. Wer&nbsp;die Seite öffnet, sucht aber etwas für sich." change="Die neue Überschrift nennt, was sich für unsere Kunden ändert. Direkt&nbsp;darunter steht, was wir tun." reason="Besucher erkennen in den ersten Sekunden, ob das Angebot zu ihnen passt." />
        <div className="small-comparison"><h3>Auch Überschriften helfen beim Finden.</h3><p><span>Vorher: „Texte&nbsp;schreiben und prüfen“</span><strong>Nachher: „Webseitentexte&nbsp;schreiben und prüfen“</strong></p><p>Das genauere Wort ist das, wonach Menschen suchen. Mehr&nbsp;Text braucht es dafür nicht.</p></div>
        <a className="example-back" href="#beispielauswahl">Zur Übersicht</a>
      </section>
      <section className="open-case open-case-design" id="design" aria-labelledby="case-design"><header><h2 id="case-design">Ein Name, den<br />man lesen kann</h2><p>Logo in der Kopfzeile</p></header>
        <Comparison before={<p className="case-logo case-logo-before">satzstrategie<span>]</span></p>} after={<p className="case-logo case-logo-after">satzstrategie<span>]</span></p>} />
        <Explanation before="Der Name stand in Kleinbuchstaben und eng gesetzt. Neben&nbsp;viel Rot fiel er kaum auf." change="Eine Schablonenschrift in Großbuchstaben, mit offenem Abstand zwischen den Buchstaben. Die&nbsp;rote Klammer bleibt." reason="Eng gesetzte Großbuchstaben verschwimmen für Menschen mit Sehbeeinträchtigung. Der&nbsp;Abstand hält jeden Buchstaben erkennbar." />
        <p className="example-limit">Eine grüne Fassung des Namens haben wir ausprobiert und wieder verworfen.</p>
        <a className="example-back" href="#beispielauswahl">Zur Übersicht</a>
      </section>
      <section className="open-case open-case-code" id="code" aria-labelledby="case-code"><header><h2 id="case-code">Das Formular<br />gleich sehen</h2><p>Kontaktseite auf dem Handy</p></header>
        <Comparison before={<ol className="case-order"><li>Überschrift</li><li>Einleitung</li><li>Hinweise zur Anfrage</li><li><strong>Formular</strong></li></ol>} after={<ol className="case-order"><li>Überschrift</li><li>Einleitung</li><li><strong>Formular</strong></li><li>Hinweise zur Anfrage</li></ol>} />
        <Explanation before="Auf dem Handy stand das Formular erst unter mehreren Absätzen." change="Das Formular rückt direkt unter die Einleitung. Am&nbsp;Computer bleibt alles nebeneinander." reason="Wer schreiben möchte, muss nicht erst suchen." />
        <div className="small-comparison"><h3>Und das Intro?</h3><p>Beim ersten Besuch auf dem Handy zeigt die Startseite kurz die Papierskulptur. Ihre&nbsp;roten Klammern werden zu Text, Design und Technik. Ein&nbsp;Tippen beendet das Intro. Wer&nbsp;in den Einstellungen weniger Bewegung gewählt hat, sieht es nicht.</p></div>
        <a className="example-back" href="#beispielauswahl">Zur Übersicht</a>
      </section>
      <section className="open-case" id="ergebnis" aria-labelledby="case-result"><header><h2 id="case-result">Was sich<br />messen lässt</h2><p>Gemessen am 28.&nbsp;Oktober 2026</p></header>
        <dl className="case-figures"><div><dt>13,0 : 1</dt><dd>Kontrast der dunklen Schrift auf dem Papierton. Die&nbsp;WCAG-Richtlinien verlangen mindestens 4,5 : 1.</dd></div><div><dt>4,9 : 1</dt><dd>Kontrast der roten Schrift auf dem Papierton.</dd></div><div><dt>rund 350 kB</dt><dd>Datenmenge der Startseite beim ersten Aufruf, mit Bildern, Schriften und Skripten.</dd></div></dl>
        <p className="example-limit">Die Werte beschreiben die Seite selbst. Besucherzahlen&nbsp;oder Anfragen sind darin nicht enthalten.</p>
        <a className="example-back" href="#beispielauswahl">Zur Übersicht</a>
      </section>
      <StudioNext href="/erster-blick" label="Wir sehen uns Ihre Webseite genauso genau an." actionLabel="Webseite kostenlos prüfen lassen">Und Ihre<br />Webseite?</StudioNext>
    </div>
  </StudioShell>;
}
