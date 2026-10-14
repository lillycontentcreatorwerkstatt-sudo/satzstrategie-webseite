"use client";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { createContactMail } from "@/lib/contact-mail";
import { createFirstLookMail, INQUIRY_EMAIL, normalizeInquiryWebsite } from "@/lib/first-look-mail";
import CopyDraft from "./CopyDraft";
const subscribe = () => () => {};

export default function ContactLetter({ firstLook = false }: { firstLook?: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  function readMail() {
    if (!form.current) return null;
    const data = new FormData(form.current);
    const website = String(data.get("website") || "");
    const message = String(data.get("message") || "");
    const name = String(data.get("name") || "");
    const websiteInput = form.current.elements.namedItem("website") as HTMLInputElement;
    websiteInput.setCustomValidity(firstLook && !normalizeInquiryWebsite(website) ? "Bitte geben Sie eine Webadresse wie beispiel.de ein." : "");
    const messageInput = form.current.elements.namedItem("message") as HTMLTextAreaElement;
    messageInput.setCustomValidity(message.trim().length < 10 ? "Bitte beschreiben Sie Ihr Anliegen mit mindestens zehn Zeichen." : "");
    if (!form.current.reportValidity()) return null;
    return firstLook ? createFirstLookMail({ website: normalizeInquiryWebsite(website)!, goal: message, name }) : createContactMail({ name, message, website });
  }
  function copyText() {
    const href = readMail();
    if (!href) return null;
    const mail = new URL(href);
    return `An: ${mail.pathname}\nBetreff: ${mail.searchParams.get("subject")}\n\n${mail.searchParams.get("body")}`;
  }
  function openMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = readMail();
    if (!href) return;
    window.location.href = href;
    setStatus("Noch nicht versendet. Prüfen und senden Sie den Entwurf in Ihrem E-Mail-Programm. Öffnet sich nichts? Nutzen Sie „Anfrage kopieren“.");
  }
  return <form ref={form} className="contact-letter" aria-label={firstLook ? "Kostenlose Ersteinschätzung anfragen" : "Projekt bei Lilly und Piet anfragen"} onSubmit={openMail}>
    <div className="letter-address">An Lilly und Piet,<br />Satzstrategie</div>
    <p className="letter-greeting">Hallo Lilly und Piet,</p>
    {firstLook && <p className="letter-purpose">ich wünsche mir eine kostenlose Ersteinschätzung zu meiner Webseite.</p>}
    <fieldset disabled={!ready} className="letter-fields">
      {firstLook && <div className="studio-field"><label htmlFor="inquiry-website">Meine Webadresse</label><input id="inquiry-website" name="website" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" required maxLength={500} placeholder="ihre-webseite.de" onInput={event => event.currentTarget.setCustomValidity("")} /></div>}
      <div className="studio-field"><label htmlFor="inquiry-message">{firstLook ? "Das soll meine Webseite erreichen:" : "darüber möchte ich sprechen:"}</label><textarea id="inquiry-message" name="message" required minLength={10} maxLength={firstLook ? 500 : 3000} rows={4} onInput={event => event.currentTarget.setCustomValidity("")} placeholder={firstLook ? "Zum Beispiel: Mein Angebot verständlich erklären und passende Anfragen bekommen." : "Mein Angebot, meine Idee oder die Stelle, an der es hakt …"} /></div>
      {!firstLook && <div className="studio-field"><label htmlFor="inquiry-website">Meine Webadresse <span>(optional)</span></label><input id="inquiry-website" name="website" type="text" inputMode="url" autoComplete="url" maxLength={2048} placeholder="ihre-webseite.de" /></div>}
      <div className="studio-field"><label htmlFor="inquiry-name">Viele Grüße von <span>(optional)</span></label><input id="inquiry-name" name="name" autoComplete="name" maxLength={120} placeholder="Ihr Name" /></div>
      {firstLook && <p className="small-note">Ein bis zwei konkrete Hinweise per E-Mail, keine vollständige Prüfung.</p>}
      <button className="studio-button" type="submit">E-Mail-Entwurf öffnen</button>
      <p className="studio-form-note">Sie prüfen und senden die E-Mail selbst. Hier werden Ihre Eingaben weder gespeichert noch versendet.</p>
      <CopyDraft getText={copyText} />
    </fieldset>
    <p className="contact-status" role="status">{status}</p>
    <noscript><p>Schreiben Sie Ihr Anliegen direkt an <a href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a>. Für den ausfüllbaren Brief benötigen Sie JavaScript.</p></noscript>
  </form>;
}
