"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import FiveSecondTest, { type DiyPath } from "./FiveSecondTest";
import WaitlistForm from "./WaitlistForm";

// „Selbst machen“: Wer schon eine Webseite hat, sieht andere Schritte, Fragen und KI-Aufträge als jemand, der neu anfängt.
// „neu“ ersetzt den Text, wenn jemand neu anfängt; „only“ zeigt einen Schritt nur auf einem Weg.
type Step = { title: ReactNode; text: ReactNode; neu?: ReactNode; only?: DiyPath };
const STEPS: Step[] = [
  { title: "Bestandsaufnahme", text: <>Sie&nbsp;klären, womit Ihre Seite gebaut ist und wer die Zugänge hat, und legen eine Sicherung&nbsp;an.</>, only: "bestehend" },
  { title: "Angebot und Kunden", text: <>Sie&nbsp;finden heraus, was Ihre Kunden suchen und ob Ihre Seite es ihnen&nbsp;zeigt.</>, neu: <>Sie&nbsp;legen fest, wen Ihre Seite ansprechen soll und was diese Menschen dort tun&nbsp;sollen.</> },
  { title: <>Texte, die man&nbsp;versteht</>, text: <>Sie&nbsp;schreiben so über Ihr Angebot, wie Ihre Kunden darüber&nbsp;sprechen.</> },
  { title: <>Aufbau und&nbsp;Wegweiser</>, text: <>Sie&nbsp;ordnen Ihre Inhalte so, dass sich Besucher auch auf dem Handy sofort&nbsp;zurechtfinden.</> },
  { title: "Gestaltung", text: <>Sie&nbsp;wählen Farben und Schriften, die zu Ihnen passen und für alle gut lesbar&nbsp;sind.</> },
  { title: "Umsetzen mit KI", text: <>Sie&nbsp;bereiten Änderungen mit der KI vor und bauen sie sauber&nbsp;ein.</>, neu: <>Sie&nbsp;lernen, der KI Aufträge zu geben, aus denen Schritt für Schritt Ihre Seite&nbsp;entsteht.</> },
  { title: <>Prüfen, was die KI nicht&nbsp;kann</>, text: <>Sie&nbsp;lernen, woran Sie Fehler der KI erkennen und was Sie besser selbst&nbsp;entscheiden.</> },
  { title: "Veröffentlichen", text: <>Sie&nbsp;bringen die überarbeitete Seite sicher&nbsp;online.</>, neu: <>Sie&nbsp;erfahren, was Domain, GitHub und Vercel sind, und bringen Ihre Seite samt Impressum und Datenschutzerklärung ins&nbsp;Netz.</> },
  { title: "Gefunden werden", text: <>Sie&nbsp;sorgen dafür, dass Google und Bing Ihre Seite finden, und richten Ihr Unternehmensprofil&nbsp;ein.</> },
  { title: "Pflegen", text: <>Sie&nbsp;halten Ihre Seite mit wenig Aufwand auf dem neuesten&nbsp;Stand.</> },
];

const QUESTIONS: Record<DiyPath, { title: ReactNode; text: ReactNode; test?: boolean }[]> = {
  bestehend: [
    { title: <>Kennen Sie die Webseiten Ihrer&nbsp;Mitbewerber?</>, text: <>Ihre&nbsp;Kunden schauen sich meist mehrere Anbieter an, bevor sie sich&nbsp;entscheiden.</> },
    { title: <>Erkennt man in fünf Sekunden, was Sie&nbsp;anbieten?</>, text: <>Viele&nbsp;Besucher entscheiden sehr schnell, ob sie&nbsp;bleiben.</>, test: true },
    { title: <>Passen Farben und Schrift zu&nbsp;Ihnen?</>, text: <>Die&nbsp;Gestaltung sollte zu Ihrem Angebot passen und den Text gut lesbar&nbsp;machen.</> },
    { title: <>Haben Sie Ihre Seite schon auf dem Handy&nbsp;angesehen?</>, text: <>Viele&nbsp;Besucher kommen über das Handy, und dort sieht vieles anders aus als am&nbsp;Computer.</> },
  ],
  neu: [
    { title: <>Wer soll Ihre Seite&nbsp;besuchen?</>, text: <>Von&nbsp;der Antwort hängt ab, was auf Ihre Seite gehört und was&nbsp;nicht.</> },
    { title: <>Was soll man in fünf Sekunden über Sie&nbsp;wissen?</>, text: <>Viele&nbsp;Besucher entscheiden sehr schnell, ob sie&nbsp;bleiben.</>, test: true },
    { title: <>Haben Sie schon eine Adresse für Ihre&nbsp;Seite?</>, text: <>Diese&nbsp;Adresse heißt Domain, und im Paket erfahren Sie, wie Sie eine passende&nbsp;finden.</> },
    { title: <>Wer kümmert sich um die Seite, wenn sie fertig&nbsp;ist?</>, text: <>Eine&nbsp;Webseite braucht auch später ab und zu Pflege, und das lässt sich gut&nbsp;einplanen.</> },
  ],
};

export default function DiyGuide() {
  const [path, setPath] = useState<DiyPath>("bestehend");
  const steps = STEPS.filter(step => !step.only || step.only === path);

  return <>
    <section className="diy-hero diy-start" aria-labelledby="diy-title">
      <div className="diy-intro">
        <div className="diy-sign" role="img" aria-label="Baustelle. Fertigstellung bis 16.11.2026">
          <span className="diy-stripes" aria-hidden="true" /><strong aria-hidden="true">Baustelle</strong><span className="diy-stripes" aria-hidden="true" />
          <span className="diy-sign-date" aria-hidden="true">Fertigstellung bis<b>16.11.2026</b></span>
        </div>
        <h1 id="diy-title">Ihre Webseite selbst gestalten und&nbsp;bauen.</h1>
        <p className="diy-lead">Wir&nbsp;zeigen Ihnen Schritt für Schritt, wie Sie mit einer KI Ihre bestehende Webseite verbessern oder eine neue&nbsp;aufbauen.</p>
        <fieldset className="diy-paths">
          <legend>Wo stehen Sie&nbsp;gerade?</legend>
          <label className="diy-path"><input type="radio" name="diy-path" value="bestehend" checked={path === "bestehend"} onChange={() => setPath("bestehend")} /><strong>Ich habe schon eine&nbsp;Webseite</strong><span>Sie&nbsp;lernen, Ihre Seite mit KI gründlich zu prüfen und so zu überarbeiten, dass Ihre Kunden schnell finden, was sie&nbsp;suchen.</span></label>
          <label className="diy-path"><input type="radio" name="diy-path" value="neu" checked={path === "neu"} onChange={() => setPath("neu")} /><strong>Ich fange neu&nbsp;an</strong><span>Sie&nbsp;gehen den ganzen Weg von der ersten Idee bis zur fertigen Seite im Netz, auch wenn Sie so etwas noch nie gemacht&nbsp;haben.</span></label>
        </fieldset>
      </div>

      <aside className="diy-contents" aria-labelledby="diy-contents-title">
        <h2 id="diy-contents-title">Das steckt&nbsp;drin</h2>
        <p>{path === "bestehend" ? <>Sie&nbsp;beginnen bei dem Thema, das Ihre Webseite gerade am meisten&nbsp;braucht.</> : <>Die&nbsp;Reihenfolge ist ein Vorschlag, Sie können auch an anderer Stelle&nbsp;beginnen.</>}</p>
        <ol>{steps.map((step, index) => <li key={index}>
          <span className="diy-num" aria-hidden="true">{path === "bestehend" ? index : index + 1}</span>
          <b>{step.title}</b>
          <span>{path === "neu" && step.neu ? step.neu : step.text}</span>
        </li>)}</ol>
      </aside>
    </section>

    <section className="diy-block" aria-labelledby="diy-questions-title">
      <div className="diy-block-head">
        <p className="diy-kicker">Ehrlich gefragt</p>
        <h2 id="diy-questions-title">{path === "bestehend" ? <>Vier Fragen an Ihre&nbsp;Webseite.</> : <>Vier Fragen vor dem&nbsp;Start.</>}</h2>
      </div>
      <ul className="diy-questions">{QUESTIONS[path].map((item, index) => <li key={index}>
        <h3>{item.title}</h3><p>{item.text}</p>{item.test && <a href="#diy-test-title">Zum Test</a>}
      </li>)}</ul>
      <p className="diy-reassure"><span className="hand">Auf all diese Fragen finden Sie im Paket <span className="diy-nowrap">eine Antwort.</span></span></p>
    </section>

    <FiveSecondTest path={path} />

    <section className="diy-block" aria-labelledby="diy-finish-title">
      <div className="diy-block-head">
        <p className="diy-kicker">Ihre Wahl</p>
        <h2 id="diy-finish-title">Wie möchten Sie&nbsp;weitermachen?</h2>
      </div>
      <div className="diy-finish">
        <div className="diy-card">
          <h3>Selbst umsetzen</h3>
          <p>Im&nbsp;Paket finden Sie Anleitungen mit Beispielen und vorbereiteten KI-Aufträgen, die wir regelmäßig auf den neuesten Stand&nbsp;bringen.</p>
          <p className="diy-date">Das&nbsp;Paket startet am 16.&nbsp;November&nbsp;2026.</p>
          <WaitlistForm />
        </div>
        <div className="diy-card">
          <h3>Satzstrategie beauftragen</h3>
          <p>Wenn&nbsp;Sie Ihre Webseite lieber nicht selbst bauen möchten, übernehmen wir das für Sie oder begleiten Sie persönlich&nbsp;dabei.</p>
          <Link className="studio-button" href="/kontakt">Zur Kontaktseite</Link>
          <p className="diy-small">Für&nbsp;eine bestehende Webseite bietet sich als Anfang unsere kostenlose <Link href="/erster-blick">Ersteinschätzung</Link>&nbsp;an.</p>
        </div>
      </div>
    </section>
  </>;
}
