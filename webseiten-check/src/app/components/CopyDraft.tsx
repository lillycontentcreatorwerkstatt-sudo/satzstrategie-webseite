"use client";
import { useId, useState } from "react";

export default function CopyDraft({ text, getText }: { text?: string; getText?: () => string | null }) {
  const id = useId();
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState("");
  async function copy() {
    const draft = getText ? getText() : text;
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      setFallback("");
      setStatus("Anfrage kopiert. Sie können sie in eine neue E-Mail einfügen und selbst versenden.");
    } catch {
      setFallback(draft);
      setStatus("Automatisches Kopieren ist hier nicht möglich. Markieren und kopieren Sie die Anfrage im Feld unten.");
    }
  }
  return <div className="copy-draft">
    <button className="studio-button studio-button-secondary" type="button" onClick={copy}>Anfrage kopieren</button>
    <p role="status">{status}</p>
    {fallback && <div className="studio-field"><label htmlFor={id}>Ihre Anfrage zum Kopieren</label><textarea id={id} readOnly rows={8} value={fallback} onFocus={event => event.currentTarget.select()} /></div>}
  </div>;
}
