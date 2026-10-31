"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { INQUIRY_EMAIL, normalizeInquiryEmail } from "@/lib/inquiry";
const subscribe = () => () => {};

// Warteliste für „Selbst machen“ mit Double-Opt-in: Zuerst geht nur ein Bestätigungslink an die Adresse, gespeichert wird nichts.
export default function WaitlistForm() {
  const form = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const startedAt = useRef(0);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => { if (sentTo) dialog.current?.showModal(); }, [sentTo]);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.current) return;
    const data = new FormData(form.current);
    const email = String(data.get("email") || "");
    const emailInput = form.current.elements.namedItem("email") as HTMLInputElement;
    emailInput.setCustomValidity(normalizeInquiryEmail(email) ? "" : "Bitte geben Sie Ihre E‑Mail-Adresse ein, zum Beispiel name@beispiel.de.");
    if (!form.current.reportValidity()) return;
    setSending(true);
    setStatus("Wird gesendet …");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: "request", email, company: String(data.get("company") || ""), startedAt: startedAt.current }) });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("");
      setSentTo(email.trim());
    } catch {
      setStatus(`Das hat leider nicht geklappt. Schreiben Sie uns bitte direkt an ${INQUIRY_EMAIL}.`);
    } finally {
      setSending(false);
    }
  }
  if (sentTo) return <>
    <p className="waitlist-thanks" role="status"><span className="hand">Fast geschafft! Bitte bestätigen Sie Ihre E‑Mail-Adresse.</span></p>
    <dialog ref={dialog} className="waitlist-dialog" aria-labelledby="waitlist-dialog-title">
      <h2 id="waitlist-dialog-title">Fast geschafft!</h2>
      <p>Wir haben Ihnen eine E‑Mail an <strong>{sentTo}</strong> geschickt. Bitte klicken Sie auf den Link darin, damit wir wissen, dass die Adresse wirklich Ihnen gehört.</p>
      <p className="waitlist-dialog-note">Keine E‑Mail da? Schauen Sie bitte auch im Spam-Ordner nach.</p>
      <form method="dialog"><button className="studio-button" autoFocus>Verstanden</button></form>
    </dialog>
  </>;
  return <form ref={form} className="waitlist" aria-label="Warteliste für Selbst machen" onSubmit={send} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
    <fieldset disabled={!ready || sending}>
      <label htmlFor="waitlist-email">Sagen Sie mir Bescheid, wenn es losgeht</label>
      <div className="waitlist-row">
        <input id="waitlist-email" name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={254} placeholder="name@beispiel.de" onInput={event => event.currentTarget.setCustomValidity("")} />
        <button className="studio-button" type="submit">{sending ? "Wird gesendet …" : "Bescheid geben"}</button>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}><label htmlFor="waitlist-company">Firma</label><input id="waitlist-company" name="company" tabIndex={-1} autoComplete="off" /></div>
      <p className="studio-form-note">Sie&nbsp;bekommen zuerst eine E‑Mail mit einem Bestätigungslink. Danach&nbsp;schreiben wir Ihnen einmal, wenn es losgeht, und löschen die Adresse. Mehr&nbsp;dazu im <Link href="/datenschutz">Datenschutz</Link>.</p>
    </fieldset>
    <p className="contact-status" role="status">{status}</p>
  </form>;
}
