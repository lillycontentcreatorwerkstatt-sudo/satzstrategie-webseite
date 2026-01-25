"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Platform = "LinkedIn" | "Instagram" | "Landingpage";

interface AnalyseCard {
  problemTitel: string;
  problemBeschreibung: string;
  vorher: string;
  nachher: string;
  warumBesser: string;
}

interface AnalysisResult {
  kiScore: number;
  kiScoreBegruendung: string;
  hauptproblem: string;
  analyseCards: AnalyseCard[];
  plattformPassung: string;
  teaserWeitereProbleme: string;
  totalScore: number;
  platform: string;
}

const PLATFORMS: Platform[] = ["LinkedIn", "Instagram", "Landingpage"];
const MAX_WORDS = 500;

function countWords(s: string): number {
  return s
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function getKiScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score <= 3) return { label: "Sehr menschlich", color: "text-green-700", bg: "bg-green-100" };
  if (score <= 5) return { label: "Leicht KI-typisch", color: "text-yellow-700", bg: "bg-yellow-100" };
  if (score <= 7) return { label: "Deutlich KI-typisch", color: "text-orange-700", bg: "bg-orange-100" };
  return { label: "Stark KI-generiert", color: "text-red-700", bg: "bg-red-100" };
}

export default function TextCheckPage() {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform>("Landingpage");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const [step, setStep] = useState<"input" | "email-gate" | "results">("input");
  const [email, setEmail] = useState("");

  const wordCount = countWords(text);
  const overLimit = wordCount > MAX_WORDS;
  const canSubmit = !loading && text.trim().length > 0 && !overLimit;

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), platform, keywords }),
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
          url: `${platform} (Text-Check)`,
          keywords,
          score: result?.totalScore,
        }),
      });
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }

    setStep("results");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleReset = () => {
    setResult(null);
    setText("");
    setPlatform("Landingpage");
    setKeywords("");
    setEmail("");
    setError("");
    setStep("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const kiLabel = result ? getKiScoreLabel(result.kiScore) : null;

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-16 no-print">
          <div className="font-bold text-xl tracking-tight">Satzstrategie Text-Check</div>
        </header>

        {/* STEP 1: INPUT */}
        {step === "input" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mt-12"
          >
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight text-slate-900">
              Klingt dein Text nach ChatGPT?
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Finde heraus, wie KI-typisch dein Text wirkt – und wie du ihn menschlicher machst.
              Kostenlose Analyse mit konkreten Verbesserungsvorschlägen.
            </p>

            <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200">
              <div className="flex flex-col gap-4">
                <textarea
                  placeholder="Füge hier deinen Text ein (LinkedIn-Post, Instagram-Caption, Landingpage-Text) …"
                  className="w-full min-h-[160px] bg-slate-50 border border-slate-300 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition text-lg resize-y"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex justify-between items-center text-sm">
                  <span className={overLimit ? "text-red-600 font-medium" : "text-slate-500"}>
                    {wordCount} / {MAX_WORDS} Wörter
                  </span>
                  {overLimit && (
                    <span className="text-red-600 font-medium">Bitte auf max. 500 Wörter kürzen.</span>
                  )}
                </div>

                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition text-lg appearance-none cursor-pointer"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Optional: Worum geht's? (z.B. Coaching, SaaS, Beratung)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition text-lg"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />

                <button
                  onClick={handleAnalyze}
                  disabled={!canSubmit}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg px-8 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-lg shadow-blue-700/20"
                >
                  {loading ? "Analysiere... (ca. 15–30s)" : "Text analysieren"}
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
              Wir haben deinen <strong>{platform}</strong>-Text analysiert und{" "}
              <strong>3 konkrete Verbesserungen</strong> gefunden. Wohin dürfen wir den Report senden?
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pb-20">
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

            <div
              id="analysis-results"
              className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Text-Analyse</h2>
                <p className="text-xl text-slate-500">Kanal: {platform}</p>
                {keywords && <p className="text-sm text-slate-400 mt-2">Thema: {keywords}</p>}
              </div>

              {/* KI-Score Display */}
              <div className="flex justify-center mb-12">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${kiLabel?.bg}`}>
                    <span className="text-5xl font-black text-slate-800">{result.kiScore}</span>
                    <span className="text-2xl text-slate-400">/10</span>
                  </div>
                  <p className={`mt-3 text-lg font-bold ${kiLabel?.color}`}>{kiLabel?.label}</p>
                  <p className="mt-2 text-slate-600 max-w-md mx-auto">{result.kiScoreBegruendung}</p>
                </div>
              </div>

              {/* Hauptproblem */}
              <div className="bg-slate-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
                <h3 className="font-bold text-lg text-slate-800 mb-2">🎯 Das Hauptproblem</h3>
                <p className="text-slate-700 text-lg">{result.hauptproblem}</p>
              </div>

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

              {/* Teaser für weitere Probleme */}
              {result.teaserWeitereProbleme && (
                <div className="mt-10 text-center">
                  <p className="text-slate-500 italic">{result.teaserWeitereProbleme}</p>
                </div>
              )}

              {/* CTA Section */}
              <div className="mt-16">
                {result.kiScore >= 6 ? (
                  <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-6 leading-tight">
                      🤖 Dein Text schreit &ldquo;KI-generiert&rdquo;
                    </h3>
                    <p className="text-red-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Mit einem KI-Score von {result.kiScore}/10 erkennen Leser sofort, dass hier ChatGPT am Werk war.
                      Das kostet Vertrauen und Conversions. Lass uns deinen Text <strong>menschlich machen</strong>.
                    </p>
                    <div className="flex justify-center">
                      <a
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        ✍️ Text-Makeover anfragen
                      </a>
                    </div>
                  </div>
                ) : result.kiScore >= 4 ? (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-orange-700 mb-6 leading-tight">
                      ⚡ Fast gut – aber da geht noch mehr
                    </h3>
                    <p className="text-orange-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Dein Text ist okay, aber ein paar Stellen verraten noch die KI-Herkunft.
                      Mit den richtigen Tweaks wird er <strong>ununterscheidbar von menschlichem Copywriting</strong>.
                    </p>
                    <div className="flex justify-center">
                      <a
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        🚀 Feinschliff-Session buchen
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10 text-center shadow-xl">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-6 leading-tight">
                      ✅ Stark! Dein Text klingt menschlich.
                    </h3>
                    <p className="text-green-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                      Mit einem KI-Score von nur {result.kiScore}/10 hast du einen authentischen Ton getroffen.
                      Willst du jetzt lernen, wie du <strong>jeden Text so hinbekommst</strong>?
                    </p>
                    <div className="flex justify-center">
                      <a
                        href="https://calendly.com/DEIN-LINK"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                      >
                        🎓 Copywriting-Strategie besprechen
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Satzstrategie CTA */}
              <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-center">
                <p className="text-slate-300 text-lg mb-4">
                  Du willst Texte, die verkaufen <em>und</em> menschlich klingen?
                </p>
                <p className="text-white text-xl font-bold">
                  Bei Satzstrategie verbinden wir KI-Power mit echtem Copywriting-Handwerk.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-slate-100 text-center text-slate-500 text-sm font-medium">
              <p>Analyse vom {new Date().toLocaleDateString("de-DE")} | Erstellt mit Satzstrategie KI</p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}