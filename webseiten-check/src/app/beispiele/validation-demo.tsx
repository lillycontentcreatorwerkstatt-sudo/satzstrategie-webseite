'use client';
import { useId, useRef, useState, type FormEvent } from 'react';
function ErrorMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d="M12 3 22 21H2Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M12 9v5m0 3v1" stroke="currentColor" strokeWidth="2" /></svg>;
}

export default function ValidationForm() {
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
    <div id={`${id}-result`} className={`work-feedback${invalid ? ' work-error' : ''}`} role="status">{invalid ? <><ErrorMark /><span>Bitte geben Sie die Postleitzahl mit fünf Ziffern ein.</span></> : checked ? 'Das Format stimmt. Das\u00A0Formular prüft nur fünf Ziffern, keine Zustelladresse.' : 'Probieren Sie „123“ und danach „04109“. Die\u00A0übrigen Eingaben bleiben erhalten.'}</div>
    <button className="work-solid" type="submit">Postleitzahl prüfen</button>
  </form>;
}

