import type { ReactNode } from 'react';
import ValidationForm from './validation-demo';

function Comparison({ before, after }: { before: ReactNode; after: ReactNode }) {
  return <div className="open-comparison"><div><h3>Vorher</h3>{before}</div><div><h3>Nachher</h3>{after}</div></div>;
}
function Explanation({ before, change, reason }: { before: string; change: string; reason: string }) {
  return <dl className="example-reasons"><div><dt>Ausgangslage</dt><dd>{before}</dd></div><div><dt>Unsere Änderung</dt><dd>{change}</dd></div><div><dt>Warum es besser ist</dt><dd>{reason}</dd></div></dl>;
}
export default function WorkExamples() {
  return <>
    <section className="open-case" id="text" aria-labelledby="example-text"><header><h2 id="example-text">Sagen, was<br />man anbietet.</h2><p>Text · Handwerk · Erfundenes Beispiel</p></header>
      <Comparison before={<p className="example-sentence">„Wir sind ein junges, dynamisches Team mit Leidenschaft für Qualität.“</p>} after={<p className="example-sentence">„Wir renovieren Altbauwohnungen in Leipzig – für Menschen, die dort wohnen bleiben möchten.“</p>} />
      <Explanation before="Ein Selbstbild steht dort, wo Leser eine Leistung erwarten." change="Die Formulierung nennt die Arbeit, den Ort und die Menschen, für die das Angebot gedacht ist." reason="Leser können sofort einordnen, ob der Betrieb zu ihrem Vorhaben passt." />
      <div className="small-comparison"><h3>Auch ein Link braucht eine Aussage.</h3><p><span>Vorher: „Mehr erfahren“</span><strong>Nachher: „Renovierung besprechen“</strong></p><p>Der neue Text nennt das Gespräch und seinen Anlass.</p></div>
    </section>
    <section className="open-case open-case-design" id="design" aria-labelledby="example-design"><header><h2 id="example-design">Das Wichtige<br />zuerst.</h2><p>Gestaltung · Kursangebot · Erfundenes Beispiel</p></header>
      <Comparison before={<div className="course-sheet course-before"><p>Willkommen zu einer Stunde für Bewegung und Ruhe. Unser Abendkurs verbindet sanfte Übungen mit bewusster Atmung. Nehmen Sie sich nach einem vollen Tag Zeit für sich.</p><h4>Yoga am Abend</h4><p>Dienstags, 18–19 Uhr.<br />Im Kursraum vor Ort.<br />15 € pro Termin.</p></div>} after={<div className="course-sheet course-after"><h4>Yoga<br />am Abend.</h4><dl><div><dt>Wann</dt><dd>Dienstags, 18–19 Uhr</dd></div><div><dt>Wo</dt><dd>Im Kursraum vor Ort</dd></div><div><dt>Preis</dt><dd>15 € pro Termin</dd></div></dl><p>Sanfte Übungen und bewusste Atmung zum Ausklang des Tages.</p></div>} />
      <Explanation before="Die Einleitung steht vor den Angaben, die für eine Buchung wichtig sind." change="Kurs, Termin, Ort und Preis rücken nach oben. Die Beschreibung folgt danach." reason="Besucher erkennen auf einen Blick, ob das Angebot in ihren Alltag passt. Auch auf dem Handy." />
    </section>
    <section className="open-case open-case-code" id="code" aria-labelledby="example-code"><header><h2 id="example-code">Ein Fehler.<br />Ein klarer Hinweis.</h2><p>Entwicklung · Onlineshop · Eigene Demonstration</p></header>
      <Comparison before={<div className="error-specimen"><p>Postleitzahl: <strong>123</strong></p><p className="example-error">Eingabe ungültig.</p></div>} after={<div className="error-specimen"><p>Postleitzahl: <strong>123</strong></p><p className="example-error">Bitte geben Sie die Postleitzahl mit fünf Ziffern ein.</p></div>} />
      <Explanation before="Die Fehlermeldung sagt nicht, wie die Eingabe korrigiert werden kann." change="Der Hinweis nennt das Feld und das erwartete Format. Bereits eingegebene Daten bleiben erhalten." reason="Menschen können den Fehler selbst beheben und müssen nicht von vorn beginnen." />
      <details className="optional-demo"><summary>Die Fehlerhilfe selbst ausprobieren</summary><div className="work-demo"><p className="small-note">Nur eine Demonstration. Es wird nichts versendet oder gespeichert.</p><ValidationForm /></div></details>
    </section>
    <section className="open-case" id="zugang" aria-labelledby="example-access"><header><h2 id="example-access">Lesen können.<br />Ohne Rätsel.</h2><p>Lesbarkeit und Bedienung · Für jede Branche</p></header>
      <Comparison before={<figure className="contrast-sample"><svg viewBox="0 0 420 140" aria-hidden="true"><rect width="420" height="140" fill="#fff" /><text x="18" y="55" fill="#aaa" fontSize="25" fontFamily="Georgia,serif">Ihr Termin ist am Dienstag,</text><text x="18" y="95" fill="#aaa" fontSize="25" fontFamily="Georgia,serif">um 10 Uhr.</text></svg><figcaption>Hellgrau auf Weiß. Kontrast: <strong>2,3 : 1</strong>.</figcaption></figure>} after={<figure className="contrast-sample"><svg viewBox="0 0 420 140" aria-hidden="true"><rect width="420" height="140" fill="#fff" /><text x="18" y="55" fill="#11110f" fontSize="25" fontFamily="Georgia,serif">Ihr Termin ist am Dienstag,</text><text x="18" y="95" fill="#11110f" fontSize="25" fontFamily="Georgia,serif">um 10 Uhr.</text></svg><figcaption>Dunkle Schrift auf Weiß. Kontrast: <strong>18,9 : 1</strong>.</figcaption></figure>} />
      <p className="comparison-transcript">Vergleichstext: „Ihr Termin ist am Dienstag, um 10 Uhr.“</p>
      <Explanation before="Hellgraue Schrift hebt sich zu wenig vom weißen Hintergrund ab." change="Die Schrift wird dunkler. Wortlaut und Schriftgröße bleiben gleich." reason="Der Text lässt sich leichter erkennen. Die internationalen WCAG-Richtlinien nennen für normalen Text mindestens 4,5 : 1 Kontrast." />
      <p className="example-limit">Der Vergleich zeigt eine konkrete Farbkombination, keine vollständige Prüfung einer Webseite.</p>
      <div className="small-comparison"><h3>Und ohne Maus?</h3><p>Auf dieser Seite erreichen Sie Links, das Menü und Formularfelder mit der Tab-Taste. Eine sichtbare Umrandung zeigt Ihre Position. Mit Enter öffnen Sie einen Link.</p><a href="/kontakt">Zum Kontakt – auch per Tastatur</a></div>
    </section>
  </>;
}
