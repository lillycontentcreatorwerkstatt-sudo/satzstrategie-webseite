"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const addressRef = useRef<HTMLSpanElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setMessage("E-Mail-Adresse kopiert.");
    } catch {
      const selection = window.getSelection();
      if (addressRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(addressRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setMessage("Bitte die markierte Adresse kopieren.");
    }
  }
  return <div className="studio-copy-email"><span ref={addressRef}>{email}</span><button type="button" onClick={copy}>Adresse kopieren</button><span role="status">{message}</span></div>;
}
