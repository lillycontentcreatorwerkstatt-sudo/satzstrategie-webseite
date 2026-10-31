"use client";
import { useEffect, useRef, useState } from "react";

// 5-Sekunden-Test: erst die unklare Startseite einer erfundenen Tischlerei, dann eine Frage, dann dieselbe Seite neu geordnet.
// Beide Fassungen enthalten dieselben Angaben. Alles läuft im Browser, nichts wird gesendet.
export type DiyPath = "bestehend" | "neu";
type Phase = "start" | "first" | "ask" | "second" | "result";
const SECONDS = 5;

const ANSWERS = [
  { value: "moebel", label: "Möbel verkaufen", reply: "Das stimmt nicht ganz, die Tischlerei baut Einbauschränke und Küchen nach Maß. Auf der Seite steht das allerdings nur ganz unten in sehr kleiner Schrift." },
  { value: "mass", label: "Einbauschränke und Küchen nach Maß", reply: "Richtig, allerdings steht das nur ganz unten in sehr kleiner Schrift, und viele Besucher übersehen es." },
  { value: "holz", label: "Holz und Baustoffe liefern", reply: "Das stimmt nicht ganz, die Tischlerei baut Einbauschränke und Küchen nach Maß. Auf der Seite steht das allerdings nur ganz unten in sehr kleiner Schrift." },
  { value: "unklar", label: "Kann ich nicht erkennen", reply: "So geht es vielen Besuchern, denn das Angebot steht nur ganz unten in sehr kleiner Schrift." },
];

const PROMPTS: Record<DiyPath, string> = {
  bestehend: "Ich habe eine Webseite für [Ihr Angebot].\nIch habe meine Startseite jemandem fünf Sekunden lang gezeigt. Die Antworten waren: [Antworten].\nEigentlich möchte ich zeigen: [was Sie anbieten, für wen, wo].\n\nBitte vergleiche beides und schlage mir eine Überschrift mit einem Satz darunter vor, die das in fünf Sekunden klarmacht. Schreib in einfachen Worten. Erfinde keine Zahlen oder Versprechen. Frag nach, wenn dir etwas fehlt.",
  neu: "Ich plane eine Webseite für [Ihr Angebot].\nBesucher sollen in fünf Sekunden wissen: [Ihre Notizen].\n\nBitte schlage mir drei Überschriften mit je einem Satz darunter vor. Schreib in einfachen Worten. Erfinde keine Zahlen oder Versprechen. Frag nach, wenn dir etwas fehlt.",
};

function FirstVersion() {
  return <div className="mock mock-bad" role="img" aria-label="Beispiel: Startseite der Tischlerei Brandt, erste Fassung. Großes Holzbild mit „Holz. Leidenschaft. Seit 1987.“ und „Ihr kompetenter Partner für individuelle Lösungen rund ums Wohnen.“ Ganz unten klein: Einbauschränke und Küchen nach Maß, Kassel und Umgebung, kostenloses Aufmaß vor Ort.">
    <div className="mock-bar"><span className="mock-logo">BRANDT</span><span className="mock-menu"><span>Home</span><span>Über uns</span><span>Referenzen</span><span>Blog</span><span>Kontakt</span></span></div>
    <div className="mock-wood"><p className="mock-claim">Holz. Leiden&shy;schaft. Seit 1987.</p><p className="mock-sub">Ihr kompetenter Partner für individuelle Lösungen rund ums Wohnen.</p><span className="mock-more">Mehr erfahren</span></div>
    <p className="mock-foot">Tischlerei Brandt · Einbauschränke und Küchen nach Maß · Kassel und Umgebung · Kostenloses Aufmaß vor Ort</p>
  </div>;
}
function SecondVersion() {
  return <div className="mock mock-good" role="img" aria-label="Beispiel: Startseite der Tischlerei Brandt, zweite Fassung. Überschrift „Einbauschränke und Küchen nach Maß“, darunter „In Kassel und Umgebung. Wir messen kostenlos bei Ihnen vor Ort aus.“ und der Knopf „Aufmaß-Termin anfragen“.">
    <div className="mock-bar"><span className="mock-logo">TISCHLEREI BRANDT</span><span className="mock-menu"><span>Leistungen</span><span>Kontakt</span></span></div>
    <div className="mock-body"><p className="mock-h1">Einbauschränke und Küchen nach Maß</p><p>In Kassel und Umgebung. Wir messen kostenlos bei Ihnen vor Ort aus.</p><span className="mock-btn">Aufmaß-Termin anfragen</span></div>
    <div className="mock-wood" />
    <p className="mock-foot">Tischlerei Brandt · seit 1987</p>
  </div>;
}

export default function FiveSecondTest({ path }: { path: DiyPath }) {
  const [phase, setPhase] = useState<Phase>("start");
  const [timed, setTimed] = useState(true);
  const [left, setLeft] = useState(SECONDS * 1000);
  const [answer, setAnswer] = useState("");
  const [copied, setCopied] = useState("");
  const moved = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const askRef = useRef<HTMLLegendElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const viewing = phase === "first" || phase === "second";

  // Die Seite läuft fünf Sekunden, danach geht es von selbst weiter.
  useEffect(() => {
    if (!viewing || !timed) return;
    const end = Date.now() + SECONDS * 1000;
    const timer = setInterval(() => {
      const rest = Math.max(0, end - Date.now());
      setLeft(rest);
      if (!rest) { clearInterval(timer); setPhase(phase === "first" ? "ask" : "result"); }
    }, 100);
    return () => clearInterval(timer);
  }, [viewing, timed, phase]);

  // Nach jedem Wechsel landen Blick und Tastaturfokus beim neuen Abschnitt.
  useEffect(() => {
    if (!moved.current) return;
    if (viewing) { stageRef.current?.scrollIntoView({ block: "start" }); if (!timed) doneRef.current?.focus({ preventScroll: true }); return; }
    const target = phase === "ask" ? askRef.current : phase === "result" ? resultRef.current : titleRef.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [phase, viewing, timed]);

  function show(next: Phase, withTimer: boolean) {
    moved.current = true;
    setTimed(withTimer);
    setLeft(SECONDS * 1000);
    setPhase(next);
  }
  function restart() {
    moved.current = true;
    setAnswer("");
    setCopied("");
    setPhase("start");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(PROMPTS[path]);
      setCopied("Der Auftrag ist kopiert und kann in die KI eingefügt werden.");
    } catch {
      const selection = window.getSelection();
      if (promptRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(promptRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setCopied("Bitte kopieren Sie den markierten Text.");
    }
  }
  const reply = ANSWERS.find(item => item.value === answer)?.reply;

  return <section className="diy-block" aria-labelledby="diy-test-title">
    <div className="diy-test">
      <div className="diy-block-head">
        <p className="diy-kicker">Zum Ausprobieren</p>
        <h2 id="diy-test-title" ref={titleRef} tabIndex={-1}>Was sieht ein Kunde in fünf&nbsp;Sekunden?</h2>
        <p>Sie&nbsp;sehen gleich fünf Sekunden lang die Startseite einer Tischlerei, wie ein Kunde sie zum ersten Mal sieht. Danach&nbsp;stellen wir Ihnen eine Frage&nbsp;dazu.</p>
      </div>

      <div>
        {phase === "start" && <div className="diy-test-start">
          <button className="studio-button" type="button" onClick={() => show("first", true)}>Test starten</button>
          <button className="diy-link" type="button" onClick={() => show("first", false)}>Ohne Zeitbegrenzung ansehen</button>
        </div>}

        {viewing && <div className="diy-stage" ref={stageRef}>
          {timed && <div className="diy-timer" aria-hidden="true"><span className="diy-timer-num">{Math.ceil(left / 1000)}</span><span className="diy-timer-bar"><i style={{ transform: `scaleX(${left / (SECONDS * 1000)})` }} /></span></div>}
          <p className="visually-hidden" role="status">{timed ? "Fünf Sekunden laufen." : ""}</p>
          {phase === "first" ? <FirstVersion /> : <SecondVersion />}
          {!timed && <button ref={doneRef} className="studio-button studio-button-secondary" type="button" onClick={() => setPhase(phase === "first" ? "ask" : "result")}>Fertig angesehen</button>}
        </div>}

        {phase === "ask" && <div className="diy-step">
          <fieldset className="diy-choices">
            <legend ref={askRef} tabIndex={-1}>Was bietet die Tischlerei&nbsp;an?</legend>
            {ANSWERS.map(item => <label key={item.value}><input type="radio" name="diy-answer" value={item.value} checked={answer === item.value} onChange={() => setAnswer(item.value)} /><span>{item.label}</span></label>)}
          </fieldset>
          <p className="diy-feedback" role="status">{reply}</p>
          <div className="diy-row">
            {reply && <button className="studio-button" type="button" onClick={() => show("second", true)}>Dieselbe Seite neu geordnet ansehen</button>}
            <button className="diy-link" type="button" onClick={() => show("first", true)}>Noch einmal ansehen</button>
            <button className="diy-link" type="button" onClick={() => show("first", false)}>Ohne Zeitbegrenzung ansehen</button>
          </div>
        </div>}

        {phase === "result" && <div className="diy-step">
          <h3 ref={resultRef} tabIndex={-1}>Beide Seiten enthalten dieselben&nbsp;Angaben.</h3>
          <p>Geändert&nbsp;haben sich nur der Text und die Reihenfolge, und darauf kommt es&nbsp;an:</p>
          <ol className="diy-reasons">
            <li>Die&nbsp;Überschrift nennt das Angebot, statt eine Stimmung zu&nbsp;beschreiben.</li>
            <li>Ort&nbsp;und Leistung stehen ganz oben und sind sofort zu&nbsp;sehen.</li>
            <li>Ein&nbsp;deutlicher Knopf zeigt, wie man einen Termin&nbsp;anfragt.</li>
          </ol>
          <div className="diy-compare">
            <figure><figcaption>Erste Fassung</figcaption><FirstVersion /></figure>
            <figure><figcaption>Zweite Fassung</figcaption><SecondVersion /></figure>
          </div>

          <div className="diy-yours">
            <h3>Probieren Sie es mit Ihrer eigenen&nbsp;Seite</h3>
            {path === "bestehend" ? <div>
              <p>Zeigen&nbsp;Sie Ihre Startseite fünf Sekunden lang jemandem, der Ihr Angebot nicht kennt, und fragen Sie ihn&nbsp;danach:</p>
              <ul><li>Was bieten wir&nbsp;an?</li><li>Für wen?</li><li>Was würden Sie als Nächstes&nbsp;tun?</li></ul>
              <p>Schreiben&nbsp;Sie die Antworten auf, ohne etwas zu erklären oder zu&nbsp;korrigieren.</p>
            </div> : <div>
              <p>Schreiben&nbsp;Sie auf, was ein Besucher in fünf Sekunden über Sie wissen&nbsp;soll:</p>
              <ul><li>Was bieten Sie&nbsp;an?</li><li>Für wen und&nbsp;wo?</li><li>Was kann er als Nächstes&nbsp;tun?</li></ul>
            </div>}
            <p>Mit&nbsp;Ihren Notizen kann Ihnen anschließend eine KI weiterhelfen. Kopieren&nbsp;Sie dazu den folgenden Auftrag, füllen Sie die Klammern aus und fügen Sie ihn in eine KI Ihrer Wahl&nbsp;ein.</p>
            <p ref={promptRef} className="diy-prompt">{PROMPTS[path]}</p>
            <button className="studio-button studio-button-secondary" type="button" onClick={copy}>Auftrag kopieren</button>
            <p className="diy-status" role="status">{copied}</p>
            <p className="diy-small">Prüfen&nbsp;Sie den Vorschlag der KI anschließend in Ruhe und übernehmen Sie nur, was stimmt und was Sie auch einem Kunden so sagen&nbsp;würden.</p>
          </div>
          <button className="diy-link" type="button" onClick={restart}>Test neu starten</button>
        </div>}
      </div>
    </div>
  </section>;
}
