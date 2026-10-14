'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { workAreas, type DemoKind, type WorkCase } from './cases';

function ErrorMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d="M12 3 22 21H2Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 9v5m0 3v1" stroke="currentColor" strokeWidth="2" /></svg>;
}

function AdaptiveForm({ after }: { after: boolean }) {
  const [intent, setIntent] = useState('web');
  const [answers, setAnswers] = useState({ web: '', text: '' });
  const [status, setStatus] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answers[intent as keyof typeof answers].trim()) {
      setStatus('Bitte beschreiben Sie kurz Ihr Anliegen.');
      field.current?.focus();
    } else setStatus('Das Anliegen ist erfasst. Dieses Beispiel versendet und speichert nichts.');
  }
  return <>
    {!after ? <div className="work-long-form" role="img" aria-label="Formularentwurf mit zwölf Pflichtfeldern: Firma, Vorname, Nachname, E-Mail, Telefon, Straße, Hausnummer, Postleitzahl, Ort, Branche, Budget und Anliegen.">
      {['Firma', 'Vorname', 'Nachname', 'E-Mail', 'Telefon', 'Straße', 'Hausnummer', 'Postleitzahl', 'Ort', 'Branche', 'Budget', 'Anliegen'].map(label => <div key={label} aria-hidden="true"><span>{label} *</span><span className="work-field-line" /></div>)}
      <p>Zwölf Pflichtfelder, unabhängig vom Anliegen.</p>
    </div> : <form onSubmit={submit} noValidate>
      <fieldset><legend>Worum geht es?</legend><div className="work-radio-row">{[['web', 'Neue Webseite'], ['text', 'Texte prüfen']].map(([value, label]) => <label key={value}><input type="radio" name={`${id}-intent`} value={value} checked={intent === value} onChange={() => { setIntent(value); setStatus(''); }} />{label}</label>)}</div></fieldset>
      <label htmlFor={`${id}-answer`}>{intent === 'web' ? 'Was soll Ihre Webseite für Sie tun?' : 'Welche Texte möchten Sie prüfen lassen?'} <span>(Pflichtfeld)</span></label>
      <textarea ref={field} id={`${id}-answer`} value={answers[intent as keyof typeof answers]} onChange={event => { setAnswers({ ...answers, [intent]: event.target.value }); setStatus(''); }} rows={3} required aria-invalid={status === 'Bitte beschreiben Sie kurz Ihr Anliegen.'} aria-describedby={`${id}-status`} />
      <button className="work-solid" type="submit">Eingabe prüfen</button>
      <p id={`${id}-status`} className="work-feedback" role="status">{status || 'Wechseln Sie das Anliegen. Ihre Antworten bleiben beim Zurückwechseln erhalten.'}</p>
    </form>}
  </>;
}

function ValidationForm({ after }: { after: boolean }) {
  const id = useId();
  const [zip, setZip] = useState('123');
  const [name, setName] = useState('');
  const [checked, setChecked] = useState(false);
  const zipField = useRef<HTMLInputElement>(null);
  const invalid = checked && !/^\d{5}$/.test(zip.trim());
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
    if (!/^\d{5}$/.test(zip.trim())) zipField.current?.focus();
  }
  return <form onSubmit={submit} noValidate>
    <label htmlFor={`${id}-name`}>Name <span>(optional, gern ein Beispielname)</span></label>
    <input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} autoComplete="off" />
    <label htmlFor={`${id}-zip`}>Postleitzahl in Deutschland <span>(Pflichtfeld)</span></label>
    <input id={`${id}-zip`} ref={zipField} value={zip} onChange={event => { setZip(event.target.value); setChecked(false); }} inputMode="numeric" autoComplete="off" required aria-invalid={invalid} aria-describedby={`${id}-result`} />
    <div id={`${id}-result`} className={`work-feedback${invalid ? ' work-error' : ''}`} role="status">{invalid ? <>{after && <ErrorMark />}<span>{after ? 'Bitte geben Sie die Postleitzahl mit fünf Ziffern ein.' : 'Eingabe ungültig.'}</span></> : checked ? 'Das Format stimmt. Dieses Beispiel prüft nur fünf Ziffern, keine Zustelladresse.' : 'Probieren Sie „123“ und danach „04109“. Die übrigen Eingaben bleiben erhalten.'}</div>
    <button className="work-solid" type="submit">Postleitzahl prüfen</button>
  </form>;
}

function KeyboardDemo({ after }: { after: boolean }) {
  const first = useRef<HTMLButtonElement>(null);
  const [choice, setChoice] = useState('Noch keine Auswahl');
  return <>
    <p className="work-demo-title">Was möchten Sie besprechen?</p>
    {after ? <><button className="work-inline" type="button" onClick={() => first.current?.focus()}>Tastaturtest starten</button><p className="work-small">Der Fokus springt auf „Text“. Mit Tab weitergehen, mit Enter oder Leertaste auswählen. Mit Umschalt + Tab geht es zurück.</p><div className="work-keyboard" role="group" aria-label="Tastaturübung">{['Text', 'Design', 'Code'].map((label, index) => <button ref={index === 0 ? first : undefined} key={label} type="button" aria-pressed={choice === label} onClick={() => setChoice(label)}>{label}</button>)}</div><p className="work-feedback" role="status">{choice === 'Noch keine Auswahl' ? choice : `${choice} ausgewählt. Sie können weitergehen oder eine andere Option wählen.`}</p></> : <><div className="work-keyboard work-keyboard-image" role="img" aria-label="Abbildung dreier Schaltflächen ohne sichtbare Fokusmarkierung. Die aktuelle Tastaturposition ist nicht erkennbar."><span>Text</span><span>Design</span><span>Code</span></div><p className="work-small">Wo steht die Tastatur gerade? In dieser Abbildung ist das nicht zu erkennen. Wechseln Sie zu „Nachher“, um es selbst auszuprobieren.</p></>}
  </>;
}

function ContrastDemo({ after }: { after: boolean }) {
  return <figure className="work-contrast"><svg viewBox="0 0 460 180" aria-hidden="true"><rect width="460" height="180" fill="#ffffff" /><text x="24" y="65" fill={after ? '#11110f' : '#aaaaaa'} fontSize="26" fontFamily="Georgia, serif">Ihr Termin ist am Dienstag,</text><text x="24" y="108" fill={after ? '#11110f' : '#aaaaaa'} fontSize="26" fontFamily="Georgia, serif">um 10 Uhr.</text></svg><figcaption><p>Vergleichstext: „Ihr Termin ist am Dienstag, um 10 Uhr.“</p><p><strong>{after ? '18,9 : 1' : '2,3 : 1'}</strong> Kontrast auf Weiß. {after ? 'Über dem Mindestwert von 4,5 : 1 für normalen Text nach WCAG 2.2 AA.' : 'Unter dem Mindestwert von 4,5 : 1 für normalen Text nach WCAG 2.2 AA.'}</p></figcaption></figure>;
}

function Demo({ kind, after }: { kind: DemoKind; after: boolean }) {
  const [message, setMessage] = useState('');
  const id = useId();
  if (kind === 'adaptive') return <AdaptiveForm after={after} />;
  if (kind === 'validation') return <ValidationForm after={after} />;
  if (kind === 'keyboard') return <KeyboardDemo after={after} />;
  if (kind === 'contrast') return <ContrastDemo after={after} />;
  if (kind === 'intro') return <div className="work-sentence"><p>{after ? 'Wir renovieren Altbauwohnungen in Leipzig – für Menschen, die dort wohnen bleiben möchten.' : 'Wir sind ein junges, dynamisches Team mit Leidenschaft für Qualität.'}</p><span>Formulierungsbeispiel für einen Handwerksbetrieb.</span></div>;
  if (kind === 'link') return <><p className="work-demo-title">Neue Küche. Alte Wände.</p><p>Sie möchten renovieren, aber nicht alles neu machen?</p><button className="work-solid work-demo-cta" type="button" onClick={() => setMessage('Hier beginnt ein Gespräch über die geplante Renovierung. Im Beispiel wird keine Anfrage versendet.')}>{after ? 'Renovierung besprechen' : 'Mehr erfahren'}</button><p className="work-feedback" role="status">{message || 'Probieren Sie die Schaltfläche aus. Beide Texte führen im Beispiel zum selben nächsten Schritt.'}</p></>;
  if (kind === 'priority') return <><p className="work-demo-title">Ihr Besuch in der Praxis</p><p>Sie möchten einen Termin vereinbaren oder uns erst kennenlernen.</p><div className={`work-action-group${after ? ' work-priority' : ''}`}>{['Termin vereinbaren', 'Leistungen ansehen', 'Team kennenlernen'].map((label, index) => <button type="button" className={after && index > 0 ? 'work-inline' : 'work-solid'} key={label} onClick={() => setMessage(['Hier würde die Terminauswahl beginnen.', 'Hier würden die Leistungen der Praxis stehen.', 'Hier würde sich das Praxisteam vorstellen.'][index])}>{label}</button>)}</div><p className="work-feedback" role="status">{message || 'Ein Gestaltungsbeispiel. Die Schaltflächen zeigen ihren nächsten Schritt innerhalb dieser Demo.'}</p></>;
  if (kind === 'reading') {
    const facts = <div className="work-course-facts"><p className="work-demo-title">Yoga am Abend</p><dl><div><dt>Wann</dt><dd>Dienstags, 18–19 Uhr</dd></div><div><dt>Wo</dt><dd>Im Kursraum vor Ort</dd></div><div><dt>Preis</dt><dd>15 € pro Termin</dd></div></dl></div>;
    const prose = <p>Willkommen zu einer Stunde für Bewegung und Ruhe. Unser Abendkurs verbindet sanfte Übungen mit bewusster Atmung. Nehmen Sie sich nach einem vollen Tag Zeit für sich.</p>;
    return <div className={`work-course${after ? ' work-course-clear' : ''}`}>{after ? <>{facts}{prose}</> : <>{prose}{facts}</>}<p className="work-small">Ein beispielhaftes Kursangebot, keine buchbare Veranstaltung.</p></div>;
  }
  return <><p className="work-demo-title">Ein Link, ohne den Satz davor.</p><div className="work-link-list"><a href={`#${id}-delivery`}>{after ? 'Lieferung und Rückgabe lesen' : 'Hier klicken'}</a></div><p className="work-small">So lässt sich der Unterschied in einer Linkliste nachvollziehen. Der Link führt zur Erklärung darunter.</p><div className="work-delivery" id={`${id}-delivery`} tabIndex={-1}><h4>Lieferung und Rückgabe</h4><p>Ein solcher Bereich erklärt Versandkosten, Lieferzeiten und den Ablauf einer Rückgabe. Der Linktext benennt dieses Ziel bereits vor dem Öffnen.</p></div></>;
}

function CaseArea({ area }: { area: typeof workAreas[number] }) {
  const [current, setCurrent] = useState(0);
  const [after, setAfter] = useState(true);
  const item: WorkCase = area.cases[current];
  return <section id={area.id} className={`work-area work-area-${area.id}`} aria-labelledby={`${area.id}-heading`}>
    <div className="work-area-heading"><h2 id={`${area.id}-heading`}>{area.title}</h2><p>{area.subtitle}</p></div>
    <div className="work-case-picker" role="group" aria-label={`${area.title} Beispiel wählen`}>{area.cases.map((entry, index) => <button key={entry.id} type="button" aria-pressed={current === index} aria-controls={`${area.id}-case`} onClick={() => { setCurrent(index); setAfter(true); }}>{entry.label}</button>)}</div>
    <div id={`${area.id}-case`} className="work-case">
      <div className="work-case-copy"><h3>{item.title}</h3><p className="work-sector">{item.sector} · Eigenes Arbeitsbeispiel</p><dl><div><dt>Ausgangslage</dt><dd>{item.before}</dd></div><div><dt>Eingriff</dt><dd>{item.change}</dd></div><div><dt>Warum es besser ist</dt><dd>{item.reason}</dd></div></dl></div>
      <div className="work-proof"><div className="work-proof-top"><span>Vergleichen &amp; ausprobieren</span><div className="work-version" role="group" aria-label={`${item.title} Ansicht wählen`}><button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Vorher</button><button type="button" aria-pressed={after} onClick={() => setAfter(true)}>Nachher</button></div></div><div className="work-demo" key={item.id} data-version={after ? 'after' : 'before'}><Demo kind={item.id} after={after} /></div></div>
    </div>
  </section>;
}

export default function WorkExamples() {
  return <>{workAreas.map(area => <CaseArea key={area.id} area={area} />)}<noscript><p className="work-noscript">Für die Vergleichsschalter benötigen Sie JavaScript. Die ersten Arbeitsbeispiele und ihre Erklärungen können Sie auch ohne JavaScript lesen.</p></noscript></>;
}
