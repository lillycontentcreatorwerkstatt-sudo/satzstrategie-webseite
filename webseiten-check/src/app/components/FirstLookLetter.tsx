"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import CopyEmail from "./CopyEmail";
import { createFirstLookMail, createFirstLookMessage, INQUIRY_EMAIL, normalizeInquiryWebsite, type FirstLookRequest } from "@/lib/first-look-mail";

const subscribe = () => () => {};

export default function FirstLookLetter() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  function readRequest(): FirstLookRequest | null {
    const form = formRef.current;
    if (!form) return null;
    const websiteInput = form.elements.namedItem("website") as HTMLInputElement;
    const goalInput = form.elements.namedItem("goal") as HTMLTextAreaElement;
    const website = normalizeInquiryWebsite(websiteInput.value);
    websiteInput.setCustomValidity(website ? "" : "Bitte geben Sie eine Webadresse wie beispiel.de ein, ohne Leerzeichen oder Zugangsdaten.");
    goalInput.setCustomValidity(goalInput.value.trim().length >= 10 ? "" : "Beschreiben Sie bitte kurz Ihr Ziel (mindestens 10 Zeichen).");
    if (!form.reportValidity() || !website) return null;
    const data = new FormData(form);
    return { website, goal: String(data.get("goal") || ""), name: String(data.get("name") || ""), wantsFirstLook: data.get("firstLook") === "on" };
  }

  function openDraft() {
    const request = readRequest();
    if (!request) return;
    setStatus("Noch nicht versendet. Ihr E-Mail-Programm wird angefragt. Bitte prüfen und senden Sie dort die Nachricht. Öffnet sich nichts? Nutzen Sie „Anfrage kopieren“.");
    window.location.href = createFirstLookMail(request);
  }

  async function copyRequest() {
    const request = readRequest();
    if (!request) return;
    const message = createFirstLookMessage(request);
    try {
      await navigator.clipboard.writeText(message);
      setFallback("");
      setStatus("Anfrage kopiert. Fügen Sie den Text in eine E-Mail an die Adresse unten ein und senden Sie sie selbst ab.");
    } catch {
      setFallback(message);
      setStatus("Bitte kopieren Sie die Anfrage aus dem Textfeld unten in Ihre E-Mail.");
    }
  }

  return <div className="first-look-compose">
    <form ref={formRef} className="first-look-letter" aria-label="Anfrage an Lilly" onSubmit={event => event.preventDefault()}>
      <fieldset disabled={!ready}>
        <legend className="first-look-greeting">Hallo Lilly,</legend>
        <div className="studio-field">
          <label htmlFor="look-website">das ist meine Webseite:</label>
          <input id="look-website" name="website" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} required maxLength={500} placeholder="ihre-webseite.de" onInput={event => event.currentTarget.setCustomValidity("")} />
        </div>
        <div className="studio-field">
          <label htmlFor="look-goal">Das soll sie erreichen:</label>
          <textarea id="look-goal" name="goal" required minLength={10} maxLength={500} rows={2} placeholder="Zum Beispiel: Unser Angebot erklären und mehr passende Anfragen bringen." onInput={event => event.currentTarget.setCustomValidity("")} />
        </div>
        <div className="studio-field">
          <label htmlFor="look-name">Viele Grüße von <span>(optional)</span></label>
          <input id="look-name" name="name" autoComplete="name" maxLength={100} placeholder="Ihr Name" />
        </div>
        <label className="first-look-choice" htmlFor="look-choice">
          <input id="look-choice" name="firstLook" type="checkbox" aria-describedby="look-scope" />
          <span>Ja, ich wünsche mir eine kostenlose Ersteinschätzung per E-Mail.</span>
        </label>
        <p id="look-scope" className="small-note">Ein bis zwei konkrete Hinweise, keine vollständige Prüfung. Alles Weitere besprechen wir danach.</p>
        <button className="studio-button" type="button" onClick={openDraft}>E-Mail-Entwurf öffnen</button>
        <p className="studio-form-note">Sie senden die E-Mail selbst. Hier wird nichts gespeichert oder automatisch ausgewertet. <Link href="/datenschutz">Datenschutz</Link></p>
        <button className="studio-button studio-button-secondary first-look-copy" type="button" onClick={copyRequest}>Anfrage kopieren</button>
      </fieldset>
      <noscript><p>Bitte schreiben Sie Ihre Webadresse und Ihr Anliegen direkt an <a href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a>. Für den ausfüllbaren Brief benötigen Sie JavaScript.</p></noscript>
      <p className="contact-status" role="status">{status}</p>
      {fallback && <div className="studio-field first-look-fallback"><label htmlFor="look-copy">Ihre Anfrage zum Kopieren</label><textarea id="look-copy" readOnly value={fallback} rows={9} onFocus={event => event.currentTarget.select()} /></div>}
    </form>
    <div className="direct-email"><p>Lieber direkt schreiben?</p><CopyEmail email={INQUIRY_EMAIL} /></div>
  </div>;
}
