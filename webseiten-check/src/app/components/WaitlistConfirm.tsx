"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { INQUIRY_EMAIL } from "@/lib/inquiry";
const subscribe = () => () => {};

// Der Link steht hinter „#“ und erreicht so nie die Server-Protokolle.
// Bestätigt wird erst per Knopf, weil Virenscanner in Mailprogrammen Links von allein öffnen.
export default function WaitlistConfirm() {
  const hasLink = useSyncExternalStore(subscribe, () => window.location.hash.length > 1, () => true);
  const [state, setState] = useState<"ready" | "sending" | "done" | "expired" | "failed">("ready");
  async function confirm() {
    setState("sending");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ step: "confirm", token: window.location.hash.slice(1) }) });
      if (response.status === 400) return setState("expired");
      if (!response.ok) throw new Error(String(response.status));
      history.replaceState(null, "", window.location.pathname);
      setState("done");
    } catch {
      setState("failed");
    }
  }
  if (state === "done") return <div className="diy-confirm" role="status">
    <h1>Bestätigt.</h1>
    <p className="hand">Wir sagen Bescheid, wenn es losgeht.</p>
    <Link className="studio-button" href="/">Zur Startseite</Link>
  </div>;
  if (!hasLink || state === "expired") return <div className="diy-confirm" role="status">
    <h1>Dieser Link passt leider nicht.</h1>
    <p>Er ist abgelaufen oder unvollständig. Tragen Sie sich bitte einfach noch einmal ein.</p>
    <Link className="studio-button" href="/selbst-machen">Zur Warteliste</Link>
  </div>;
  return <div className="diy-confirm">
    <h1>Fast geschafft.</h1>
    <p>Ein Klick noch, dann stehen Sie auf der Warteliste für „Selbst machen“. Wir schreiben Ihnen einmal, wenn es losgeht.</p>
    <button className="studio-button" type="button" onClick={confirm} disabled={state === "sending"}>{state === "sending" ? "Wird bestätigt …" : "Adresse bestätigen"}</button>
    {state === "failed" && <p className="contact-status" role="status">Das hat leider nicht geklappt. Versuchen Sie es bitte gleich noch einmal oder schreiben Sie uns an {INQUIRY_EMAIL}.</p>}
  </div>;
}
