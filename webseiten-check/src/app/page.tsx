"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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

function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Sehr gut", color: "text-green-700", bg: "bg-green-100" };
  if (score >= 60) return { label: "Ausbaufähig", color: "text-yellow-700", bg: "bg-yellow-100" };
  if (score >= 40) return { label: "Kritisch", color: "text-orange-700", bg: "bg-orange-100" };
  return { label: "Dringender Handlungsbedarf", color: "text-red-700", bg: "bg-red-100" };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  
  const [step, setStep] = useState<"input" | "email-gate" | "results">("input");
  const [email, setEmail] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keywords }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details || data.error || "Ein Fehler ist aufgetreten";
        throw new Error(errorMsg);
      }

      setResult(data);
      setStep("email-gate");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Bitte eine gültige E-Mail eingeben.");
      return;
    }
  
    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          url, 
          keywords,
          score: result?.totalScore
        }),
      });
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }
    
    setStep("results");
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
    setKeywords("");
    setEmail("");
    setError("");
    setStep("input");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scoreLabel = result ? getScoreLabel(result.websiteScore) : null;

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16 no-print">
          <div className="font-bold text-xl tracking-tight">Satzstrategie Website-Check</div>
          <Link
            href="/text-check"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Text-Check →
          </Link>
        </header>

        {/* STEP 1: INPUT */}
        {step === "input" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mt-12"
          >
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900">
              Verkauft deine Webseite oder vertreibt sie Kunden?
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Kostenlose KI-Analyse in 30 Sekunden. Wir zeigen dir konkret, welche Texte Besucher abschrecken – und wie du sie fixst.
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="https://mein-business.de"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition text-lg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Was verkaufst du? (z.B. Coaching, Apps, Kurse)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition text-lg"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !url || !keywords}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg px-8 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-lg shadow-blue-700/20"
                >
                  {loading ? "Analysiere... (ca. 15-30s)" : "Jetzt analysieren"}
                </button>

                <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-2 font-medium">
                  <span>🔒</span> 
                  Ergebnis im Tausch gegen deine E-Mail (kein Newsletter, nur der Report).
                </p>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: EMAIL GATE */}
        {step === "email-gate" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-20 text-center bg-white p-8 rounded-2xl shadow-2xl border border-slate-100"
          >
            <div className="mb-6 bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
              ✓
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Analyse fertig!</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Wir haben <strong>3 konkrete Verbesserungen</strong> für <strong>{url}</strong> gefunden. Wohin dürfen wir den Report senden?
            </p>
            
            <form onSubmit={handleUnlockResults} className="flex flex-col gap-4">
              <input 
                type="email" 
                required
                placeholder="deine@email.de"
                className="w-full border border-slate-300 rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-600 outline-none text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg transition shadow-lg text-lg"
              >
                Ergebnis jetzt anzeigen
              </button>
            </form>
            <p className="text-sm text-slate-400 mt-6 font-medium">Deine Daten sind sicher. Kein Spam.</p>
          </motion.div>
        )}

        {/* STEP 3: RESULTS */}
        {step === "results" && result && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-8 pb-20"
          >
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-end mb-8 no-print">
              <button 
                onClick={handlePrintPDF}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition shadow-md font-bold"
              >
                <span>📄</span> Als PDF speichern
              </button>
              <button 
                onClick={handleReset}
                className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                Neu starten
              </button>
            </div>

            <div id="analysis-results" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
                
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Webseiten-Analyse</h2>
                <p className="text-xl text-slate-500 break-all">{url}</p>
                <p className="text-sm text-slate-400 mt-2">Geprüft auf: {keywords}</p>
              </div>

              {/* Score Display */}
              <div className="flex justify-center mb-12">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${scoreLabel?.bg}`}>
                    <span className="text-5xl font-black text-slate-800">{result.websiteScore}</span>
                    <span className="text-2xl text-slate-400">/100</span>
                  </div>
                  <p className={`mt-3 text-lg font-bold ${scoreLabel?.color}`}>{scoreLabel?.label}</p>
                  <p className="mt-2 text-slate-600 max-w-md mx-auto">{result.scoreBegruendung}</p>
                </div>
              </div>

              {/* Hauptproblem */}
              <div className="bg-slate-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
                <h3 className="font-bold text-lg text-slate-800 mb-2">🎯 Das Hauptproblem</h3>
                <p className="text-slate-700 text-lg">{result.hauptproblem}</p>
              </div>

              {/* Keyword-Check */}
              {result.keywordCheck && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-12">
                  <h3 className="font-bold text-lg text-blue-900 mb-3">🔍 Keyword-Check</h3>
                  <div className="text-blue-800">
                    {result.keywordCheck.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Vorher/Nachher Cards */}
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                3 konkrete Verbesserungen
              </h3>
              
              <div className="space-y-8">
                {result.analyseCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg print:break-inside-avoid"
                  >
                    {/* Card Header */}
                    <div className="bg-slate-800 text-white px-6 py-4">
                      <span className="text-sm font-medium text-slate-400">Problem {i + 1}</span>
                      <h4 className="text-xl font-bold">{card.problemTitel}</h4>
                    </div>
                    
                    {/* Problem Description */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                      <p className="text-slate-700">{card.problemBeschreibung}</p>
                    </div>

                    {/* Vorher/Nachher Grid */}
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                      {/* Vorher */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">VORHER</span>
                        </div>
                        <p className="text-slate-600 italic leading-relaxed">&ldquo;{card.vorher}&rdquo;</p>
                      </div>
                      
                      {/* Nachher */}
                      <div className="p-6 bg-green-50/50">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">NACHHER</span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">&ldquo;{card.nachher}&rdquo;</p>
                      </div>
                    </div>

                    {/* Warum besser */}
                    <div className="px-6 py-4 bg-blue-50 border-t border-slate-200">
                      <p className="text-blue-800 text-sm">
                        <span className="font-bold">💡 Warum besser:</span> {card.warumBesser}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Teaser */}
              {result.teaserWeitereProbleme && (
                <div className="mt-10 text-center">
                  <p className="text-slate-500 italic">{result.teaserWeitereProbleme}</p>
                </div>
              )}

              {/* Accessibility Checks */}
              {result.accessibilityChecks && result.accessibilityChecks.length > 0 && (
                <div className="mt-12">
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <span>♿</span> Barrierefreiheit (WCAG-Kriterien)
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.accessibilityChecks.map((check, index) => {
                        const statusConfig = {
                          "gut": { icon: "✓", color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
                          "grenzwertig": { icon: "◐", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
                          "mangelhaft": { icon: "✗", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" }
                        };
                        const config = statusConfig[check.status] || statusConfig["mangelhaft"];
                        
                        return (
                          <div 
                            key={index} 
                            className={`p-4 rounded-xl ${config.bg} border ${config.border} flex items-start gap-3`}
                          >
                            <span className={`${config.color} font-bold text-xl`}>{config.icon}</span>
                            <div>
                              <span className="font-semibold text-slate-800 block">{check.criterion}</span>
                              <p className="text-sm text-slate-600 mt-1">{check.detail}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* BFSG Warning */}
              {result.accessibilityWarning && (
                <div className="mt-8 bg-yellow-50 border-l-8 border-yellow-500 p-6 rounded-r-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⚖️</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-900">
                        Achtung: Rechtliches Risiko bei Barrierefreiheit
                      </h3>
                      <p className="text-yellow-800 mt-2 text-md leading-relaxed">
                        Dein Accessibility-Score liegt bei <strong>{result.accessibilityScore}/100</strong>.
                        <br/>
                        <strong>Wichtig:</strong> Ab Juni 2025 tritt das Barrierefreiheitsstärkungsgesetz (BFSG) in Kraft. 
                        Webseiten müssen für alle Menschen zugänglich sein, sonst drohen Abmahnungen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="mt-16">
                {result.websiteScore < 50 ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-6 leading-tight">
                      🚨 Hier besteht dringender Handlungsbedarf!
                    </h3>
                    <p className="text-red-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Dein Score liegt bei {result.websiteScore}/100. Das bedeutet, dass du aktuell 
                      wahrscheinlich <strong>jeden Tag bares Geld verlierst</strong>, weil Besucher deine Botschaft nicht verstehen.
                    </p>
                    <div className="flex justify-center">
                      <a 
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        🆘 Kostenloses Notfall-Gespräch buchen
                      </a>
                    </div>
                  </div>
                ) : result.websiteScore < 80 ? (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-orange-700 mb-6 leading-tight">
                      ⚠️ Da ist noch viel Luft nach oben.
                    </h3>
                    <p className="text-orange-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Dein Ergebnis ({result.websiteScore}/100) ist solide, aber du lässt <strong>massives Potenzial liegen</strong>. 
                      Mit den richtigen Handgriffen machen wir aus Besuchern echte Kunden.
                    </p>
                    <div className="flex justify-center">
                      <a 
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        🚀 Potenzial-Analyse buchen
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-6 leading-tight">
                      ✅ Stark! Deine Seite überzeugt.
                    </h3>
                    <p className="text-green-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Mit {result.websiteScore}/100 spielst du in der Champions League. 
                      Jetzt geht es ums <strong>Dominieren</strong> – willst du wissen wie?
                    </p>
                    <div className="flex justify-center">
                      <a 
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        🏆 Strategie-Gespräch für Marktführer
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Satzstrategie CTA */}
              <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-center">
                <p className="text-slate-300 text-lg mb-4">
                  Du willst eine Webseite, die verkauft <em>und</em> professionell aussieht?
                </p>
                <p className="text-white text-xl font-bold">
                  Bei Satzstrategie verbinden wir KI-Power mit echtem Copywriting-Handwerk.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t-2 border-slate-100 text-center text-slate-500 text-sm font-medium">
                <p>Analyse vom {new Date().toLocaleDateString("de-DE")} | Erstellt mit Satzstrategie KI</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}