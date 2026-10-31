"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { createClaudePrompt, markFloskeln, type Segment } from "@/lib/floskeln";
import WaitlistForm from "./WaitlistForm";

// Kostprobe Schritt 2 „Texte“: erkennen, wählen, selbst schreiben, mit Claude weitermachen.
// Alles läuft im Browser, keine Eingabe wird gesendet.
const WORDS: (string | { word: string; floskel: boolean })[] = [
  { word: "Wir", floskel: false }, " ", { word: "bieten", floskel: false }, " ", { word: "Ihnen", floskel: false }, " ",
  { word: "maßgeschneiderte", floskel: true }, " ", { word: "Lösungen", floskel: true }, " ", { word: "mit", floskel: false }, " ",
  { word: "höchstem", floskel: true }, " ", { word: "Qualitätsanspruch", floskel: true }, " – ", { word: "kompetent", floskel: true }, ", ",
  { word: "zuverlässig", floskel: true }, " ", { word: "und", floskel: false }, " ", { word: "kundenorientiert", floskel: true }, ".",
];
const FLOSKEL_COUNT = WORDS.filter(item => typeof item !== "string" && item.floskel).length;

const CHOICES = [
  { text: "„Wir sind Ihr erfahrener und zuverlässiger Partner für alle Malerarbeiten.“", right: false, reason: "Nicht ganz. Noch immer Floskeln: „erfahren“, „zuverlässig“ und „Partner“ schreibt jeder Betrieb. Was Sie konkret tun, erfährt niemand." },
  { text: "„Wir streichen Wohnungen in Bremen. Die Möbel decken wir ab, nach einer Woche ist alles fertig.“", right: true, reason: "Genau. Die Fassung nennt Leistung, Ort und einen Vorteil, den Kundinnen und Kunden prüfen können." },
  { text: "„Farbe ist unsere Leidenschaft – seit über 20 Jahren!“", right: false, reason: "Nicht ganz. Klingt sympathisch, sagt aber nichts über die Leistung. Und eine Jahreszahl hilft nur, wenn sie stimmt und belegt ist." },
];

export default function FloskelLesson() {
  const [struck, setStruck] = useState<number[]>([]);
  const [hint, setHint] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [sentence, setSentence] = useState("");
  const [checked, setChecked] = useState<Segment[] | null>(null);
  const [copied, setCopied] = useState("");
  const promptRef = useRef<HTMLParagraphElement>(null);
  const found = struck.length;
  const done = found === FLOSKEL_COUNT;
  const marked = checked?.filter(segment => segment.floskel).length ?? 0;
  const prompt = createClaudePrompt(sentence);

  function tap(index: number, word: string, floskel: boolean) {
    if (!floskel) return setHint(`„${word}“ darf bleiben. Das ist Satzbau, keine Floskel.`);
    if (struck.includes(index)) return;
    setStruck([...struck, index]);
    setHint("");
  }
  function solve() {
    setStruck(WORDS.flatMap((item, index) => typeof item !== "string" && item.floskel ? [index] : []));
    setHint("");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied("Kopiert. Jetzt bei Claude einfügen.");
    } catch {
      const selection = window.getSelection();
      if (promptRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(promptRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setCopied("Bitte den markierten Text kopieren.");
    }
  }

  return <div className="lesson">
    <header className="lesson-head">
      <p className="lesson-kicker">Kostprobe · Schritt 2 von 10</p>
      <h1>Aus Floskeln werden Aussagen.</h1>
      <p>Wer auf Ihre Seite kommt, will schnell wissen: Passt das zu mir? Floskeln beantworten diese Frage nicht. In&nbsp;vier kurzen Schritten sehen Sie, woran man sie erkennt und wie Sie sie ersetzen. Ohne&nbsp;Anmeldung, etwa fünf Minuten.</p>
    </header>

    <section className="lesson-step" aria-labelledby="lesson-1">
      <h2 id="lesson-1"><span aria-hidden="true">1</span>Erkennen</h2>
      <p className="lesson-task">Tippen Sie alle Wörter an, die auf jeder beliebigen Webseite stehen könnten.</p>
      <p className="floskel-sentence">{WORDS.map((item, index) => typeof item === "string" ? item : <button key={index} type="button" className="floskel-word" aria-pressed={struck.includes(index)} onClick={() => tap(index, item.word, item.floskel)}>{item.word}</button>)}</p>
      <p className="lesson-status" role="status">{done ? `Alle ${FLOSKEL_COUNT} gefunden.` : `${found} von ${FLOSKEL_COUNT} Floskel-Wörtern gefunden.`} {hint}</p>
      {done ? <div className="lesson-result">
        <p className="hand">Übrig bleibt: „Wir bieten Ihnen&nbsp;…“</p>
        <p>Diese Wörter könnten bei einer Steuerberaterin stehen, im Autohaus oder beim Bäcker. Weil&nbsp;sie überall passen, sagen sie über Sie nichts. Eine&nbsp;Aussage passt nur zu Ihnen: was Sie tun, für wen und mit welchem Ergebnis.</p>
      </div> : <button type="button" className="lesson-link" onClick={solve}>Lösung zeigen</button>}
    </section>

    <section className="lesson-step" aria-labelledby="lesson-2">
      <h2 id="lesson-2"><span aria-hidden="true">2</span>Wählen</h2>
      <fieldset className="lesson-choices">
        <legend className="lesson-task">Ein Malerbetrieb schreibt: „Wir sind Ihr kompetenter Partner rund um Farbe.“ Welche Fassung sagt am meisten?</legend>
        {CHOICES.map((item, index) => <label key={index} className={choice === index ? (item.right ? "is-right" : "is-wrong") : undefined}>
          <input type="radio" name="lesson-choice" checked={choice === index} onChange={() => setChoice(index)} />
          <span>{item.text}</span>
        </label>)}
      </fieldset>
      <p className="lesson-status" role="status">{choice !== null && CHOICES[choice].reason}</p>
    </section>

    <section className="lesson-step" aria-labelledby="lesson-3">
      <h2 id="lesson-3"><span aria-hidden="true">3</span>Selbst schreiben</h2>
      <p className="lesson-task">Schreiben Sie einen Satz über Ihr eigenes Angebot. Er&nbsp;sollte drei Fragen beantworten:</p>
      <ul className="lesson-questions"><li>Was genau bieten Sie an?</li><li>Für wen?</li><li>Mit welchem Ergebnis?</li></ul>
      <label className="visually-hidden" htmlFor="lesson-sentence">Ihr Satz</label>
      <textarea id="lesson-sentence" className="lesson-input" rows={3} maxLength={300} value={sentence} placeholder="Wir …" onChange={event => { setSentence(event.target.value); setChecked(null); }} />
      <button type="button" className="studio-button lesson-button" onClick={() => setChecked(markFloskeln(sentence))} disabled={!sentence.trim()}>Satz prüfen</button>
      <div role="status">{checked && <div className="lesson-result">
        <p className="lesson-checked">{checked.map((segment, index) => segment.floskel ? <mark key={index}>{segment.text}</mark> : segment.text)}</p>
        <p>{marked ? `${marked === 1 ? "Eine typische Floskel" : `${marked} typische Floskeln`} markiert. Ersetzen Sie sie durch etwas, das man prüfen kann: eine Leistung, einen Ort, eine Zahl, ein Ergebnis.` : "Keine typische Floskel gefunden. Jetzt die Gegenprobe: Beantwortet Ihr Satz die drei Fragen oben?"}</p>
      </div>}</div>
      <p className="lesson-note">Die Prüfung kennt nur eine Liste typischer Floskeln. Ihr&nbsp;Satz bleibt in Ihrem Browser und wird nicht gesendet.</p>
    </section>

    <section className="lesson-step" aria-labelledby="lesson-4">
      <h2 id="lesson-4"><span aria-hidden="true">4</span>Mit Claude weitermachen</h2>
      <p className="lesson-task">Kopieren Sie diesen Auftrag, ergänzen Sie die Klammern und fügen Sie ihn bei Claude ein.</p>
      <p ref={promptRef} className="lesson-prompt">{prompt}</p>
      <button type="button" className="studio-button studio-button-secondary lesson-button" onClick={copy}>Auftrag kopieren</button>
      <p className="lesson-status" role="status">{copied}</p>
      <p>Danach das Wichtigste: Lesen Sie, was Claude schreibt. Stimmt&nbsp;jede Aussage? Würden Sie sie einem Kunden so sagen? Wie&nbsp;Sie KI-Texte prüfen, zeigt Schritt&nbsp;5.</p>
    </section>

    <section className="lesson-step lesson-end" aria-labelledby="lesson-end">
      <h2 id="lesson-end">Das war Schritt&nbsp;2 von&nbsp;10.</h2>
      <p>So ist der ganze Kurs geplant: kurz erklärt, direkt ausprobiert und mit Claude umgesetzt. Start&nbsp;ist am 16.&nbsp;November&nbsp;2026.</p>
      <WaitlistForm />
      <Link className="lesson-link" href="/selbst-machen">Alle zehn Schritte ansehen</Link>
    </section>
  </div>;
}
