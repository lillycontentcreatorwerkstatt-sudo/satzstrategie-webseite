"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { INQUIRY_EMAIL, normalizeInquiryEmail, normalizeInquiryWebsite } from "@/lib/inquiry";
const subscribe = () => () => {};

export default function ContactLetter({ firstLook = false }: { firstLook?: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const sentDialog = useRef<HTMLDialogElement>(null);
  const sentTitle = useId();
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  // Der Dank steht erst nach dem Senden im Dokument, damit Suchmaschinen ihn nicht als Seiteninhalt lesen.
  const [sent, setSent] = useState(false);
  useEffect(() => { if (sent) sentDialog.current?.showModal(); }, [sent]);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  function readForm() {
    if (!form.current) return null;
    const data = new FormData(form.current);
    const website = String(data.get("website") || "");
    const message = String(data.get("message") || "");
    const email = String(data.get("email") || "");
    const websiteInput = form.current.elements.namedItem("website") as HTMLInputElement;
    websiteInput.setCustomValidity(firstLook && !normalizeInquiryWebsite(website) ? "Bitte geben Sie eine Webadresse wie beispiel.de ein." : "");
    const messageInput = form.current.elements.namedItem("message") as HTMLTextAreaElement;
    messageInput.setCustomValidity(message.trim().length < 10 ? "Bitte beschreiben Sie Ihr Anliegen mit mindestens zehn Zeichen." : "");
    const emailInput = form.current.elements.namedItem("email") as HTMLInputElement;
    emailInput.setCustomValidity(normalizeInquiryEmail(email) ? "" : "Bitte geben Sie Ihre E\u2011Mail-Adresse ein, zum Beispiel name@beispiel.de.");
    if (!form.current.reportValidity()) return null;
    return { kind: firstLook ? "first-look" : "contact", website, message, email, name: String(data.get("name") || ""), company: String(data.get("company") || ""), startedAt: startedAt.current };
  }
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = readForm();
    if (!payload) return;
    setSending(true);
    setStatus("Ihre Anfrage wird gesendet …");
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(String(response.status));
      form.current?.reset();
      setStatus("");
      setSent(true);
    } catch {
      setStatus(`Das hat leider nicht geklappt. Schreiben Sie uns bitte direkt an ${INQUIRY_EMAIL}.`);
    } finally {
      setSending(false);
    }
  }
  return <form ref={form} className="contact-letter" aria-label={firstLook ? "Kostenlose Ersteinschätzung anfragen" : "Projekt bei Lilly und Piet anfragen"} onSubmit={send} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
    <div className="letter-address">An: Satzstrategie</div>
    <p className="letter-greeting">Hallo Lilly und Piet,</p>
    {firstLook && <p className="letter-purpose">ich wünsche mir eine kostenlose Ersteinschätzung zu meiner Webseite.</p>}
    <fieldset disabled={!ready || sending} className="letter-fields">
      {firstLook && <div className="studio-field"><label htmlFor="inquiry-website">Meine Webadresse</label><input id="inquiry-website" name="website" type="text" inputMode="url" autoComplete="url" autoCapitalize="none" required maxLength={500} placeholder="ihre-webseite.de" onInput={event => event.currentTarget.setCustomValidity("")} /></div>}
      <div className="studio-field"><label htmlFor="inquiry-message">{firstLook ? "Das soll meine Webseite erreichen:" : "darüber möchte ich sprechen:"}</label><textarea id="inquiry-message" name="message" required minLength={10} maxLength={firstLook ? 500 : 3000} rows={4} onInput={event => event.currentTarget.setCustomValidity("")} placeholder={firstLook ? "Zum Beispiel: Mein\u00A0Angebot verständlich erklären und passende Anfragen bekommen." : "Mein Angebot, meine Idee oder die Stelle, an der es hakt …"} /></div>
      {!firstLook && <div className="studio-field"><label htmlFor="inquiry-website">Meine Webadresse <span>(optional)</span></label><input id="inquiry-website" name="website" type="text" inputMode="url" autoComplete="url" maxLength={2048} placeholder="ihre-webseite.de" /></div>}
      <div className="studio-field"><label htmlFor="inquiry-email">Ihre E&#8209;Mail-Adresse <span>(für unsere Antwort)</span></label><input id="inquiry-email" name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={254} placeholder="name@beispiel.de" onInput={event => event.currentTarget.setCustomValidity("")} /></div>
      <div className="studio-field"><label htmlFor="inquiry-name">Viele Grüße von <span>(optional)</span></label><input id="inquiry-name" name="name" autoComplete="name" maxLength={120} placeholder="Ihr Name" /></div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}><label htmlFor="inquiry-company">Firma</label><input id="inquiry-company" name="company" tabIndex={-1} autoComplete="off" /></div>
      {firstLook && <p className="small-note">Ein bis zwei konkrete Hinweise per E&#8209;Mail, keine vollständige Prüfung.</p>}
      <button className="studio-button" type="submit">{sending ? "Wird gesendet …" : "Anfrage senden"}</button>
      <p className="studio-form-note">Ihre Anfrage geht direkt an uns. Auf&nbsp;der Webseite wird nichts gespeichert. Mehr&nbsp;dazu im <Link href="/datenschutz">Datenschutz</Link>.</p>
    </fieldset>
    <p className="contact-status" role="status">{status}</p>
    <dialog ref={sentDialog} className="sent-dialog" aria-labelledby={sentTitle} onClose={() => setSent(false)} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
      {sent && <div className="sent-sheet">
        <h2 id={sentTitle}>Danke!<span>Ihre Anfrage ist bei uns angekommen.</span></h2>
        <p>{firstLook ? "Ihre Ersteinschätzung erhalten Sie werktags innerhalb von 24 Stunden per E\u2011Mail." : "Wir melden uns per E\u2011Mail bei Ihnen."}</p>
        <span className="sent-signature">Lilly und Piet</span>
        <button className="studio-button" type="button" onClick={() => sentDialog.current?.close()}>Schließen</button>
      </div>}
    </dialog>
    <noscript><p>Schreiben Sie Ihr Anliegen direkt an <a href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a>. Für&nbsp;den ausfüllbaren Brief benötigen Sie JavaScript.</p></noscript>
  </form>;
}
