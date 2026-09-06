"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import StudioShell, { StudioEyebrow, StudioNext } from "./StudioShell";

interface AnalyseCard {
  problemTitel: string;
  problemBeschreibung: string;
  vorher: string;
  nachher: string;
  warumBesser: string;
}

interface AccessibilityCheck {
  criterion: string;
  status: "gut" | "grenzwertig" | "mangelhaft";
  detail: string;
}

interface AnalysisResult {
  websiteScore: number;
  scoreBegruendung: string;
  hauptproblem: string;
  analyseCards: AnalyseCard[];
  keywordCheck: string;
  teaserWeitereProbleme: string;
  accessibilityChecks: AccessibilityCheck[];
  accessibilityScore: number;
  accessibilityWarning: boolean;
  totalScore: number;
}

function scoreLabel(score: number) {
  if (score >= 80) return "Eine gute Grundlage";
  if (score >= 60) return "Mit Ansatzpunkten zur Verbesserung";
  if (score >= 40) return "Hier lohnt sich ein genauerer Blick";
  return "Die Botschaft braucht mehr Klarheit";
}

export default function AnalysisExperience({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "email-gate" | "results">("input");
  const [email, setEmail] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

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
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), keywords: keywords.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.status >= 500
          ? "Die Analyse ist gerade nicht verfügbar. Bitte versuchen Sie es später noch einmal oder nehmen Sie direkt Kontakt auf."
          : data.details || data.error || "Diese Webseite konnte nicht geprüft werden.");
      }
      if (!Array.isArray(data.analyseCards) || !Number.isFinite(data.websiteScore)) {
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
        body: JSON.stringify({ email: email.trim(), url: url.trim(), keywords: keywords.trim(), score: result?.totalScore }),
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
              <StudioEyebrow number="01">Webseitenanalyse</StudioEyebrow>
              <h1 className="studio-title">Was kommt<br /><span className="studio-mark">wirklich an?</span></h1>
              <p className="studio-lead">Konkrete Textvorschläge und erste Hinweise auf mögliche Barrieren. KI-gestützt, als kurzer erster Blick.</p>
            </div>
            <form className="studio-check-sheet studio-check-entry" onSubmit={handleAnalyze} aria-busy={loading} aria-label="Webseitenanalyse starten">
              <div className="studio-fields">
                <div className="studio-field">
                  <label htmlFor="analysis-url"><span className="studio-field-number" aria-hidden="true">01</span>Ihre Webadresse</label>
                  <input id="analysis-url" name="url" type="text" inputMode="url" autoComplete="url" required placeholder="https://ihre-webseite.de" value={url} onChange={e => setUrl(e.target.value)} disabled={loading} />
                </div>
                <div className="studio-field">
                  <label htmlFor="analysis-offer"><span className="studio-field-number" aria-hidden="true">02</span>Ihr Angebot</label>
                  <textarea id="analysis-offer" name="offer" required maxLength={500} placeholder="z. B. Webseitentexte, Textberatung" value={keywords} onChange={e => setKeywords(e.target.value)} disabled={loading} aria-describedby="analysis-offer-hint" />
                  <small id="analysis-offer-hint">Ihre Leistungen in Stichworten, mit Kommas getrennt.</small>
                </div>
              </div>
              <button type="submit" className="studio-button" disabled={loading}>{loading ? "Ihre Webseite wird gelesen …" : "Webseite prüfen"}<span aria-hidden="true">↗</span></button>
              <p className="studio-form-note">KI-gestützte Ersteinschätzung · meist in etwa 30 Sekunden.<br />Das Ergebnis sehen Sie nach Eingabe Ihrer E-Mail. Kein Newsletter. <Link href="/datenschutz">Datenschutz</Link></p>
              {loading && <p className="studio-loading" role="status">Texte und Seitenstruktur werden ausgewertet.</p>}
              {error && <p role="alert" className="studio-error">{error}</p>}
            </form>
          </section>
          <details className="studio-disclosure">
            <summary>Was wird geprüft – und was nicht?</summary>
            <div>
              <p>Die Analyse prüft, wie deutlich Ihr Angebot im Text vorkommt, schlägt bessere Formulierungen vor und liefert erste Hinweise auf mögliche Barrieren.</p>
              <p>Sie misst keine Google-Rankings oder Empfehlungen durch KI-Systeme und ersetzt keine vollständige Prüfung der Barrierefreiheit.</p>
            </div>
          </details>
          <p className="studio-check-followup">Sie möchten direkt mit uns sprechen? <Link href="/kontakt">Gespräch anfragen ↗</Link></p>
        </>
      )}

      {step === "email-gate" && result && (
        <section className="studio-gate">
          <StudioEyebrow number="01">Ihre Ersteinschätzung</StudioEyebrow>
          <h1 ref={headingRef} tabIndex={-1}>Gelesen.<br /><em>Und eingeordnet.</em></h1>
          <p>Für {url} liegen {result.analyseCards.length} Textvorschläge vor. Mit Ihrer E-Mail-Adresse können Sie die Auswertung hier ansehen.</p>
          <form className="studio-check-sheet" onSubmit={handleUnlockResults} aria-busy={unlocking}>
            <div className="studio-field"><label htmlFor="analysis-email">Ihre E-Mail-Adresse</label><input id="analysis-email" type="email" autoComplete="email" required placeholder="sie@unternehmen.de" value={email} onChange={e => setEmail(e.target.value)} disabled={unlocking} /></div>
            <button type="submit" className="studio-button" disabled={unlocking}>{unlocking ? "Wird geöffnet …" : "Auswertung ansehen"}<span aria-hidden="true">↗</span></button>
            <p className="studio-form-note">Kein Newsletter. Informationen zur Verarbeitung finden Sie im <Link href="/datenschutz">Datenschutz</Link>.</p>
            {error && <p role="alert" className="studio-error">{error}</p>}
          </form>
          <div className="studio-actions"><button className="studio-plain-button" type="button" onClick={handleReset}>Andere Webseite prüfen</button></div>
        </section>
      )}

      {step === "results" && result && (
        <>
          <article className="studio-report" id="analysis-results">
            <StudioEyebrow number="01">Ihr Korrekturblatt</StudioEyebrow>
            <h1 ref={headingRef} tabIndex={-1}>Ein Blick von außen.<br /><em>Konkrete nächste Sätze.</em></h1>
            <p className="studio-report-url">{url}</p>
            <p className="studio-form-note">Ihr Angebot: {keywords}</p>
            <div className="studio-report-actions no-print"><button type="button" className="studio-plain-button" onClick={() => window.print()}>Drucken / als PDF speichern ↗</button><button type="button" className="studio-plain-button" onClick={handleReset}>Andere Webseite prüfen</button></div>

            <section className="studio-report-summary" aria-label="Zusammenfassung">
              <div className="studio-score"><strong>{result.websiteScore}</strong><span> / 100</span><p>{scoreLabel(result.websiteScore)}</p><span className="studio-form-note">KI-Einschätzung · kein gemessener Verkaufserfolg</span></div>
              <div><h2>Das fällt zuerst auf.</h2><p>{result.hauptproblem}</p><p>{result.scoreBegruendung}</p></div>
            </section>

            <section aria-label="Konkrete Textvorschläge">
              <h2>{result.analyseCards.length} Ansatzpunkte für Ihre Texte.</h2>
              <div className="studio-corrections">{result.analyseCards.map((card, index) => (
                <article key={index} className="studio-correction">
                  <p className="studio-label">Korrektur {String(index + 1).padStart(2, "0")}</p>
                  <h3>{card.problemTitel}</h3><p>{card.problemBeschreibung}</p>
                  <div className="studio-comparison">
                    <div><p className="studio-label">Auf Ihrer Webseite</p><blockquote>„{card.vorher}“</blockquote></div>
                    <div><p className="studio-label">Ein möglicher neuer Satz</p><blockquote>„{card.nachher}“</blockquote></div>
                  </div>
                  <p><strong>Der Gedanke dahinter:</strong> {card.warumBesser}</p>
                </article>
              ))}</div>
            </section>

            {result.keywordCheck && <section className="studio-report-section"><h2>Ihr Angebot im Text.</h2><p className="studio-keyword-result">{result.keywordCheck}</p></section>}
            {!!result.accessibilityChecks?.length && (
              <section className="studio-report-section">
                <h2>Erste Hinweise zur Zugänglichkeit.</h2>
                <ul className="studio-accessibility">{result.accessibilityChecks.map((check, index) => <li key={index}><strong>{check.criterion}<span className={"studio-status-" + check.status}>{check.status}</span></strong><p>{check.detail}</p></li>)}</ul>
                <p className="studio-form-note">Automatisch erkannte Hinweise. Eine vollständige Beurteilung braucht zusätzliche technische und manuelle Tests.</p>
              </section>
            )}
            {result.teaserWeitereProbleme && <p className="studio-margin-note">{result.teaserWeitereProbleme}</p>}
            <p className="studio-form-note">KI-gestützte Ersteinschätzung von Satzstrategie. Prüfen Sie vorgeschlagene Aussagen vor der Verwendung auf sachliche Richtigkeit.</p>
          </article>
          <StudioNext href="/kontakt" label="Die Auswertung persönlich besprechen">Was ändern wir zuerst?</StudioNext>
        </>
      )}
    </StudioShell>
  );
}
