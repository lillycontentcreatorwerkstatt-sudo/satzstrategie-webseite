"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import StudioShell, { StudioEyebrow, StudioNext } from "./StudioShell";
import type { TextReport } from "@/lib/analysis-evidence";

type AnalysisResult = TextReport & { checkedUrl?: string };

export default function AnalysisExperience({ initialUrl = "", textMode = false }: { initialUrl?: string; textMode?: boolean }) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("Landingpage");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "email-gate" | "results">("input");
  const [email, setEmail] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subject = textMode ? `${platform} (Textcheck)` : result?.checkedUrl || url;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const suggestionCount = result?.analyseCards.length ?? 0;
  const resetLabel = textMode ? "Anderen Text prüfen" : "Andere Webseite prüfen";

  useEffect(() => {
    if (step !== "input") headingRef.current?.focus();
  }, [step]);

  const handleAnalyze = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(textMode ? "/api/analyze-text" : "/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(textMode ? { text: text.trim(), platform, keywords: keywords.trim() } : { url: url.trim(), keywords: keywords.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.status >= 500
          ? "Die Analyse ist gerade nicht verfügbar. Bitte versuchen Sie es später noch einmal oder nehmen Sie direkt Kontakt auf."
          : data.details || data.error || "Diese Webseite konnte nicht geprüft werden.");
      }
      if (!Array.isArray(data.analyseCards) || typeof data.hauptproblem !== "string") {
        throw new Error("Die Auswertung ist unvollständig. Bitte starten Sie die Analyse erneut.");
      }
      setResult(data);
      setStep("email-gate");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Die Analyse konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockResults = async (event: FormEvent) => {
    event.preventDefault();
    if (unlocking) return;
    setUnlocking(true);
    setError("");
    try {
      const response = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), url: subject.trim(), keywords: keywords.trim() }),
      });
      if (!response.ok) throw new Error("Das Ergebnis konnte noch nicht freigeschaltet werden. Bitte versuchen Sie es erneut.");
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bitte versuchen Sie es erneut.");
    } finally {
      setUnlocking(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
    setText("");
    setKeywords("");
    setEmail("");
    setError("");
    setStep("input");
  };

  return (
    <StudioShell active="/analyse">
      {step === "input" && (
        <>
          <section className="studio-check-layout">
            <div className="studio-check-intro">
              <StudioEyebrow number="01">{textMode ? "Textcheck" : "Webseitenanalyse · Textcheck"}</StudioEyebrow>
              <h1 className="studio-title">Was kommt<br /><span className="studio-mark">wirklich an?</span></h1>
              <p className="studio-lead">Sie sagen, was Sie anbieten. Der KI-Textcheck zeigt, was Ihr Text vermittelt – mit Vorschlägen im direkten Vergleich.</p>
            </div>
            <form className="studio-check-sheet studio-check-entry" onSubmit={handleAnalyze} aria-busy={loading} aria-label="Textcheck starten">
              <div className="studio-fields">
                {textMode ? <>
                  <div className="studio-field"><label htmlFor="analysis-text">Ihr Text</label><textarea id="analysis-text" required maxLength={12000} aria-describedby="analysis-text-hint" value={text} onChange={e => setText(e.target.value)} disabled={loading} placeholder="Fügen Sie hier Ihren Text ein …" /><small id="analysis-text-hint">{wordCount} Wörter · bitte 20 bis 500 Wörter. Keine vertraulichen oder personenbezogenen Angaben.</small></div>
                  <div className="studio-field"><label htmlFor="analysis-platform">Wo erscheint der Text?</label><select id="analysis-platform" value={platform} onChange={e => setPlatform(e.target.value)} disabled={loading}><option>Landingpage</option><option>LinkedIn</option><option>Instagram</option></select></div>
                </> : <div className="studio-field">
                  <label htmlFor="analysis-url"><span className="studio-field-number" aria-hidden="true">01</span>Ihre Webadresse</label>
                  <input id="analysis-url" name="url" type="text" inputMode="url" autoComplete="url" required placeholder="https://ihre-webseite.de" value={url} onChange={e => setUrl(e.target.value)} disabled={loading} />
                </div>}
                <div className="studio-field">
                  <label htmlFor="analysis-offer"><span className="studio-field-number" aria-hidden="true">02</span>Was bieten Sie an?</label>
                  <textarea id="analysis-offer" name="offer" required maxLength={500} placeholder="z. B. Webseitentexte, Textberatung" value={keywords} onChange={e => setKeywords(e.target.value)} disabled={loading} aria-describedby="analysis-offer-hint" />
                  <small id="analysis-offer-hint">Ein paar Stichworte reichen. Mit Kommas oder Zeilenumbrüchen trennen.</small>
                </div>
              </div>
              <button type="submit" className="studio-button" disabled={loading || (textMode && (wordCount < 20 || wordCount > 500))}>{loading ? "Ihre Texte werden gelesen …" : "Textvorschläge erhalten"}<span aria-hidden="true">↗</span></button>
              <p className="studio-form-note">KI-gestützte Ersteinschätzung.<br />Ergebnis nach E-Mail-Eingabe. Kein Newsletter. <Link href="/datenschutz">Datenschutz</Link></p>
              {loading && <p className="studio-loading" role="status">Wir lesen den Text und prüfen mögliche Formulierungen.</p>}
              {error && <p role="alert" className="studio-error">{error}</p>}
            </form>
          </section>
          <details className="studio-disclosure">
            <summary>Was wird geprüft – und was nicht?</summary>
            <div>
              <p>Sie erhalten bis zu drei Formulierungsvorschläge für {textMode ? "den eingefügten Text" : "die eingegebene Seite, nicht für die gesamte Webseite"}. Wenn sich kein belastbarer Vorschlag ergibt, sagen wir das. Originalzitate werden mit dem gelesenen Text abgeglichen.</p>
              <p>Dieser Textcheck misst weder Google-Rankings noch KI-Empfehlungen. Gestaltung, mobile Bedienung und Barrierefreiheit werden dabei nicht geprüft. Vorschläge sind Entwürfe, keine garantierte Verbesserung.</p>
            </div>
          </details>
          <div className="studio-check-followup studio-check-alternatives">{textMode ? <Link href="/analyse">Stattdessen eine Webadresse prüfen ↗</Link> : <Link href="/text-check">Lieber einen Text direkt einfügen? ↗</Link>}<Link href="/kontakt">Direkt ein Gespräch anfragen ↗</Link></div>
        </>
      )}

      {step === "email-gate" && result && (
        <section className="studio-gate">
          <StudioEyebrow number="01">Ihre Ersteinschätzung</StudioEyebrow>
          <h1 ref={headingRef} tabIndex={-1}>Gelesen.<br /><em>Und eingeordnet.</em></h1>
          <p>{suggestionCount ? `Für ${subject} ${suggestionCount === 1 ? "liegt ein Textvorschlag" : `liegen ${suggestionCount} Textvorschläge`} vor.` : `Für ${subject} liegt ein erster Eindruck vor. Es wurden keine ausreichend belegten Textvorschläge gefunden.`} Mit Ihrer E-Mail-Adresse können Sie die Auswertung hier ansehen.</p>
          <form className="studio-check-sheet" onSubmit={handleUnlockResults} aria-busy={unlocking}>
            <div className="studio-field"><label htmlFor="analysis-email">Ihre E-Mail-Adresse</label><input id="analysis-email" type="email" autoComplete="email" required placeholder="sie@unternehmen.de" value={email} onChange={e => setEmail(e.target.value)} disabled={unlocking} /></div>
            <button type="submit" className="studio-button" disabled={unlocking}>{unlocking ? "Wird geöffnet …" : "Auswertung ansehen"}<span aria-hidden="true">↗</span></button>
            <p className="studio-form-note">Kein Newsletter. Informationen zur Verarbeitung finden Sie im <Link href="/datenschutz">Datenschutz</Link>.</p>
            {error && <p role="alert" className="studio-error">{error}</p>}
          </form>
          <div className="studio-actions"><button className="studio-plain-button" type="button" onClick={handleReset}>{resetLabel}</button></div>
        </section>
      )}

      {step === "results" && result && (
        <>
          <article className="studio-report" id="analysis-results">
            <StudioEyebrow number="01">Ihr Korrekturblatt</StudioEyebrow>
            <h1 ref={headingRef} tabIndex={-1}>Ihr <em>Textcheck.</em></h1>
            <p className="studio-report-url">{subject}</p>
            <p className="studio-form-note">Ihr Angebot: {keywords}</p>

            <section className="studio-report-summary" aria-label="Zusammenfassung">
              <div><p className="studio-label">Erster Eindruck</p><h2>Was der Text vermittelt.</h2><p className="studio-form-note">KI-gestützt · keine Gesamtnote</p></div>
              <div><p>{result.hauptproblem}</p></div>
            </section>

            <section aria-label="Konkrete Textvorschläge">
              <h2>{suggestionCount ? `${suggestionCount === 1 ? "Ein Ansatzpunkt" : `${suggestionCount} Ansatzpunkte`} für Ihre Texte.` : "Keine belastbaren Textvorschläge."}</h2>
              {!result.analyseCards.length && <p>Wir zeigen nur Vorschläge mit belegtem Originalzitat. Dass hier keiner erscheint, ist kein Qualitätssiegel für die gesamte Webseite.</p>}
              <div className="studio-corrections">{result.analyseCards.map((card, index) => (
                <article key={index} className="studio-correction">
                  <p className="studio-label">Korrektur {String(index + 1).padStart(2, "0")}</p>
                  <h3>{card.problemTitel}</h3><p>{card.problemBeschreibung}</p>
                  <div className="studio-comparison">
                    <div><p className="studio-label">Im Original</p><blockquote>„{card.vorher}“</blockquote></div>
                    <div><p className="studio-label">Ein möglicher neuer Satz</p><blockquote>„{card.nachher}“</blockquote></div>
                  </div>
                  <p><strong>Der Gedanke dahinter:</strong> {card.warumBesser}</p>
                </article>
              ))}</div>
            </section>

            {result.keywordCheck && <section className="studio-report-section"><h2>Ihre Stichworte im Text.</h2><p className="studio-keyword-result">{result.keywordCheck}</p><p className="studio-form-note">Ein wörtlicher Abgleich, keine Bewertung der Sichtbarkeit. Ein Angebot kann auch mit anderen Worten beschrieben sein.</p></section>}
            <div className="studio-report-actions no-print"><button type="button" className="studio-plain-button" onClick={() => window.print()}>Drucken / als PDF speichern ↗</button><button type="button" className="studio-plain-button" onClick={handleReset}>{resetLabel}</button></div>
            <p className="studio-form-note">Geprüft wurde nur der gelesene Text. Keine Messung von Google-Rankings, KI-Empfehlungen oder Barrierefreiheit.</p>
            <p className="studio-form-note">KI-gestützte Ersteinschätzung von Satzstrategie. Prüfen Sie vorgeschlagene Aussagen vor der Verwendung auf sachliche Richtigkeit.</p>
          </article>
          <StudioNext href="/kontakt" label="Die Auswertung persönlich besprechen">Was ändern wir zuerst?</StudioNext>
        </>
      )}
    </StudioShell>
  );
}
