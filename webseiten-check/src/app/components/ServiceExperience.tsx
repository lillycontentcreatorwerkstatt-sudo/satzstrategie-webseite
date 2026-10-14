"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createServiceInquiry, normalizeServiceWebsite } from "@/lib/service-inquiry";
import "./service-experience.css";

const examples = [
  { context: "Eine Startseite für ein Webstudio", before: "Wir bieten Ihnen innovative Lösungen aus einer Hand für Ihren erfolgreichen digitalen Auftritt.", after: "Wir schreiben, gestalten und entwickeln Ihre Website. Damit aus Interessierten Kunden werden.", beforeNote: "Klingt vertraut. Aber was wird hier eigentlich angeboten?", afterNote: "Drei konkrete Tätigkeiten. Ein verständliches Ziel. Jetzt wissen Leser, worum es geht." },
  { context: "Eine Leistungsbeschreibung", before: "Im Rahmen einer umfassenden Analyse erfolgt die Identifikation von Optimierungspotenzialen Ihres bestehenden Internetauftritts.", after: "Wir prüfen Ihre Website und zeigen Ihnen, welche Änderungen zuerst sinnvoll sind.", beforeNote: "Viele Hauptwörter. Wer etwas tut und was Sie davon haben, bleibt abstrakt.", afterNote: "Menschen handeln. Verben tragen den Satz. Und die Prüfung bekommt ein greifbares Ergebnis." },
  { context: "Der Einstieg in ein Gespräch", before: "Für weiterführende Informationen zu unserem Leistungsportfolio stehen wir Ihnen selbstverständlich jederzeit gerne zur Verfügung.", after: "Schreiben Sie uns, was Sie vorhaben. Wir besprechen den nächsten Schritt.", beforeNote: "Höflich formuliert. Nur der Anlass, tatsächlich zu schreiben, fehlt.", afterNote: "Eine einfache Einladung mit einer konkreten Erwartung an das erste Gespräch." },
  { context: "Eine fehlende Angabe im Formular", before: "Die Übermittlung konnte aufgrund unvollständiger Pflichtfeldangaben nicht erfolgreich durchgeführt werden.", after: "Bitte ergänzen Sie Ihre E-Mail-Adresse. Dann können wir Ihnen antworten.", beforeNote: "Der Fehler wird gemeldet. Die Lösung müssen Nutzer selbst suchen.", afterNote: "Das fehlende Feld ist benannt. Der nächste Schritt und sein Sinn sind sofort klar." },
];
type Intent = "website" | "text";

export default function ServiceExperience({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const [exampleIndex, setExampleIndex] = useState(0);
  const [revised, setRevised] = useState(false);
  const [layout, setLayout] = useState("type");
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("website");
  const [drafts, setDrafts] = useState({ website: "", text: "" });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState({ project: "", website: "" });
  const [preview, setPreview] = useState<ReturnType<typeof createServiceInquiry> | null>(null);
  const [status, setStatus] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const sentence = useRef<HTMLParagraphElement>(null);
  const projectField = useRef<HTMLTextAreaElement>(null);
  const websiteField = useRef<HTMLInputElement>(null);
  const previewTitle = useRef<HTMLHeadingElement>(null);
  const example = examples[exampleIndex];

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const resize = () => element.style.setProperty("--board-scale", String(Math.min(1, (element.clientWidth - 16) / 780)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = sentence.current?.animate([{ opacity: .35, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" });
    return () => animation?.cancel();
  }, [exampleIndex, revised]);
  useEffect(() => { if (preview) previewTitle.current?.focus(); }, [preview]);

  function chooseIntent(next: Intent) { setIntent(next); setPreview(null); setErrors({ project: "", website: "" }); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = { project: "", website: "" };
    if (!drafts[intent].trim()) nextErrors.project = intent === "website" ? "Beschreiben Sie kurz, was Sie mit Ihrer Website erreichen möchten." : "Nennen Sie kurz die Texte, um die es geht.";
    try { normalizeServiceWebsite(website); } catch { nextErrors.website = "Bitte eine Webadresse wie beispiel.de eingeben oder das optionale Feld leer lassen."; }
    setErrors(nextErrors);
    if (nextErrors.project || nextErrors.website) { (nextErrors.project ? projectField : websiteField).current?.focus(); setStatus("Bitte prüfen Sie die markierten Angaben."); return; }
    setPreview(createServiceInquiry({ intent, project: drafts[intent], website }));
  }
  function fillExample() {
    setPreview(null); setErrors({ project: "", website: "" }); setWebsite("");
    setDrafts(previous => ({ ...previous, [intent]: intent === "website" ? "Ich möchte eine Website für mein kleines Architekturbüro. Besucher sollen meine Projekte kennenlernen und einen Gesprächstermin anfragen können." : "Ich möchte die Texte meiner Startseite prüfen lassen. Sie sollen klarer sagen, was ich anbiete, und mehr nach mir klingen." }));
    setStatus("Ein vorbereitetes Beispiel wurde eingesetzt. Sie können es bearbeiten oder die Anfrage ansehen.");
    requestAnimationFrame(() => projectField.current?.focus());
  }
  const designNote = (layout === "type" ? "Die große Überschrift steht links, das Bild rechts. Der Text soll zuerst auffallen." : "Das Bild füllt den oberen Teil. Die Überschrift liegt darauf. Das Motiv soll zuerst auffallen.") + (open ? " Die geöffneten Ebenen zeigen, wie Hintergrund, Bild und Texte übereinanderliegen." : "");

  return <div className="service-experience">
    <section id="leistungen" className="service-opening" aria-labelledby="services-title">
      <div><Heading id="services-title">Was können wir<br />für Sie <em>bewegen?</em></Heading><p>Ein Satz wird klarer. Eine Seite bekommt Haltung.<br className="desktop-break" /> Eine Idee funktioniert. Probieren Sie es aus.</p><p>Haltung heißt für uns: Wir prüfen jede Formulierung und übernehmen Verantwortung für das, was wir veröffentlichen.</p></div>
      <nav className="intent-links" aria-label="Ihr Anliegen"><a href="#design">Ich brauche eine Website</a><a href="#neue-texte">Ich möchte Texte prüfen lassen</a></nav>
    </section>
    <section id="neue-texte" className="text-section service" aria-labelledby="text-title">
      <div className="section-intro"><h2 id="text-title">Text, der<br /><em>weiterhilft.</em></h2><div><p>Manchmal braucht es einen neuen Text.<br />Manchmal nur den richtigen Eingriff.</p><p className="instruction">Wählen Sie ein Beispiel. Dann wechseln Sie zwischen Entwurf und Überarbeitung.</p></div></div>
      <div className="text-workshop"><div className="example-picker" role="group" aria-label="Textbeispiel wählen">{["Startseite", "Leistung", "Kontakt", "Formular"].map((label, index) => <button key={label} type="button" aria-pressed={exampleIndex === index} onClick={() => { setExampleIndex(index); setRevised(false); }}>{label}</button>)}</div>
        <div className="proof-sheet"><div className="proof-top"><span>{example.context}</span><div className="version-switch" role="group" aria-label="Textversion"><button type="button" aria-pressed={!revised} onClick={() => setRevised(false)}>Entwurf</button><button type="button" aria-pressed={revised} onClick={() => setRevised(true)}>Überarbeitet</button></div></div>
          <div className="sentence-space" data-version={revised ? "after" : "before"} aria-live="polite" aria-atomic="true"><p ref={sentence}>{revised ? example.after : example.before}</p></div>
          <div className="proof-foot"><p>{revised ? example.afterNote : example.beforeNote}</p><button className="text-action" type="button" onClick={() => setRevised(value => !value)}>{revised ? "Entwurf noch einmal lesen" : "Diesen Satz überarbeiten"}</button></div>
        </div><div className="example-caption"><span>Vier vorbereitete Beispiele. So machen wir Textarbeit sichtbar.</span><a href="#anfrage-demo" onClick={() => chooseIntent("text")}>Über Ihre Texte sprechen</a></div>
      </div>
    </section>
    <section id="design" className="design-section service" aria-labelledby="design-title">
      <div className="section-intro"><h2 id="design-title">Design mit<br /><em>einer Idee.</em></h2><div><p>Was fällt zuerst auf?<br />Was gehört zusammen? Wohin geht es weiter?</p><p className="instruction">Wechseln Sie zwischen Text und Bild als Blickfang. Öffnen Sie die Ebenen, um den Aufbau zu sehen.</p></div></div>
      <div className="design-workshop"><div className="design-controls"><div role="group" aria-label="Aufbau wählen" className="layout-switch"><button type="button" aria-pressed={layout === "type"} onClick={() => setLayout("type")}>Aussage zuerst</button><button type="button" aria-pressed={layout === "image"} onClick={() => setLayout("image")}>Motiv zuerst</button></div><button className="depth-button" type="button" aria-pressed={open} onClick={() => setOpen(value => !value)}>{open ? "Zusammensetzen" : "Ebenen öffnen"}</button></div>
        <div ref={stage} className="stage" data-layout={layout} data-open={open} role="img" aria-label={`Gestaltungsbeispiel: ${layout === "type" ? "Aussage" : "Motiv"} zuerst, Ebenen ${open ? "geöffnet" : "zusammengesetzt"}. Raum für gute Ideen.`}>
          <div className="artboard-scale" aria-hidden="true"><div className="artboard"><div className="sheet-base" /><div className="sheet-image"><Image src="/images/papierarchitektur.webp" alt="" fill sizes="(max-width: 760px) 80vw, 600px" /></div><div className="sheet-type"><span>Raum für</span><span>gute Ideen.</span></div><div className="sheet-detail"><span>Ein klarer Gedanke.<br />Ein eigener Auftritt.</span><span className="mini-action">Lassen Sie uns reden</span></div><div className="sheet-accent"><span>Form.<br />Mit Haltung.</span></div></div></div>
        </div><div className="design-caption"><p aria-live="polite">{designNote}</p><p>Ein Gestaltungsbeispiel, zwei Blickrichtungen.</p></div>
      </div><a className="section-link" href="#anfrage-demo" onClick={() => chooseIntent("website")}>Über Ihre Website sprechen</a>
    </section>
    <section id="entwicklung" className="code-section service" aria-labelledby="code-title">
      <div className="section-intro"><h2 id="code-title">Code, der<br /><em>mitdenkt.</em></h2><div><p>Ein Formular kann einfach nur Felder zeigen.<br />Oder auf Ihr Anliegen eingehen.</p><p className="instruction">Hier funktioniert es bereits: Wählen Sie Ihr Vorhaben und stellen Sie eine Anfrage zusammen.</p></div></div>
      <div id="anfrage-demo" className="enquiry-layout"><div className="enquiry-aside"><h3>Womit fangen<br />wir an?</h3><p>Ihre Auswahl bestimmt die nächste Frage. Daraus entsteht eine E-Mail, die Sie selbst versenden.</p><button className="text-action" type="button" onClick={fillExample}>Mit einem Beispiel ausprobieren</button><details className="source-disclosure"><summary>Was der Code hier tut</summary><p>Er passt die Frage an Ihre Auswahl an, erhält Ihre Eingaben beim Wechsel und prüft fehlende Angaben. Erst danach erstellt er einen E-Mail-Entwurf. Es wird nichts automatisch versendet.</p></details></div>
        <div className="enquiry-paper"><form onSubmit={submit} noValidate hidden={!!preview}>
          <fieldset><legend>Was haben Sie vor?</legend><div className="intent-choice"><label><input type="radio" name="intent" value="website" checked={intent === "website"} onChange={() => chooseIntent("website")} /><span>Eine Website bauen</span></label><label><input type="radio" name="intent" value="text" checked={intent === "text"} onChange={() => chooseIntent("text")} /><span>Texte prüfen lassen</span></label></div></fieldset>
          <div className="field"><label htmlFor="service-project">{intent === "website" ? "Was soll Ihre Website für Sie tun?" : "Welche Texte möchten Sie prüfen lassen?"} <span>(Pflichtfeld)</span></label><textarea ref={projectField} id="service-project" rows={3} required value={drafts[intent]} onChange={event => { setDrafts(previous => ({ ...previous, [intent]: event.target.value })); setErrors(previous => ({ ...previous, project: "" })); }} placeholder={intent === "website" ? "Zum Beispiel: Meine Arbeit zeigen und Anfragen ermöglichen." : "Zum Beispiel: Die Startseite verständlicher und persönlicher machen."} aria-invalid={!!errors.project} aria-describedby={errors.project ? "project-error" : undefined} />{errors.project && <p id="project-error" className="field-error">{errors.project}</p>}</div>
          <div className="field"><label htmlFor="service-website">Ihre Webadresse <span>(optional)</span></label><input ref={websiteField} id="service-website" type="text" inputMode="url" autoComplete="url" placeholder="beispiel.de" value={website} onChange={event => { setWebsite(event.target.value); setErrors(previous => ({ ...previous, website: "" })); }} aria-invalid={!!errors.website} aria-describedby={errors.website ? "website-error" : undefined} />{errors.website && <p id="website-error" className="field-error">{errors.website}</p>}</div>
          <button className="button" type="submit">Anfrage ansehen</button><p className="privacy-note">Bis hier bleibt alles in Ihrem Browser. Es wird nichts versendet oder gespeichert.</p><p className="sr-only" role="status">{status}</p>
        </form>{preview && <div className="enquiry-preview"><h3 tabIndex={-1} ref={previewTitle}>So beginnt<br />unser Gespräch.</h3><p className="preview-subject">{preview.subject}</p><div className="preview-body">{preview.body}</div><a className="button" href={preview.href}>Im E-Mail-Programm öffnen</a><button className="text-action edit-enquiry" type="button" onClick={() => { setPreview(null); requestAnimationFrame(() => projectField.current?.focus()); }}>Angaben ändern</button><p className="privacy-note">Ihr E-Mail-Programm öffnet einen Entwurf an Lilly. Sie prüfen ihn und senden ihn selbst ab.</p></div>}</div>
      </div>
      <noscript><p>Für die interaktiven Beispiele benötigen Sie JavaScript. <a href="/kontakt">Sie erreichen Lilly auf der Kontaktseite.</a></p></noscript>
    </section>
  </div>;
}
