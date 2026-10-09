"use client";
import { useState, type FormEvent } from "react";
import Arrow from "./Arrow";
import { createContactMail } from "@/lib/contact-mail";
export default function ContactLetter() {
  const [message, setMessage] = useState("");
  function openMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.location.href = createContactMail({ name: String(data.get("name") || ""), message: String(data.get("message") || ""), website: String(data.get("website") || "") });
    setMessage("Der E-Mail-Entwurf wird geöffnet. Senden Sie ihn anschließend in Ihrem E-Mail-Programm. Falls sich nichts öffnet, können Sie die Adresse unten kopieren.");
  }
  return <form className="contact-letter" onSubmit={openMail}>
    <div className="letter-address"><span>An Lilly,<br />Satzstrategie</span><span className="letter-stamp" aria-hidden="true">s.</span></div>
    <p className="letter-greeting">Hallo Lilly,</p>
    <div className="studio-field"><label htmlFor="contact-message">darüber würde ich gern sprechen:</label><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={4} placeholder="Mein Angebot, meine Idee oder die Stelle, an der es hakt …" /></div>
    <div className="studio-field"><label htmlFor="contact-website">Meine Webseite <span>(optional)</span></label><input id="contact-website" name="website" type="text" inputMode="url" autoComplete="url" maxLength={2048} placeholder="ihre-webseite.de" /></div>
    <div className="studio-field"><label htmlFor="contact-name">Viele Grüße von</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Ihr Name" /></div>
    <button className="studio-button" type="submit">E-Mail-Entwurf öffnen <Arrow /></button>
    <p className="studio-form-note">Öffnet Ihr E-Mail-Programm. Die Eingaben werden hier weder gespeichert noch versendet.</p>
    <p className="contact-status" role="status">{message}</p>
  </form>;
}
