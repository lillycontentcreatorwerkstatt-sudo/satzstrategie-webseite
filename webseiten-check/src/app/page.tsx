"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnalysisResult {
  categories: Array<{ name: string; score: number; feedback: string }>;
  totalScore: number;
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
        throw new Error(data.error || "Ein Fehler ist aufgetreten");
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

    // HIER IST DER UNTERSCHIED: Wir schicken die Daten wirklich los!
    try {
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url, keywords }),
      });
      console.log("E-Mail erfolgreich an Server gesendet!"); 
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }
    
    // Weiter zum Ergebnis
    setStep("results");
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // --- DIE NEUE, UNKAPUTTBARE PDF FUNKTION ---
  const handlePrintPDF = () => {
    // Öffnet den Druck-Dialog. Der Nutzer wählt dort "Als PDF speichern".
    // Dank unseres CSS werden die Buttons dabei automatisch ausgeblendet.
    window.print();
  };

  // --- DER NEUE RESET ---
  const handleReset = () => {
    // Wir setzen alles hart zurück
    setResult(null);
    setUrl("");
    setKeywords("");
    setEmail("");
    setError("");
    setStep("input");
    // Scrollen nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16 no-print">
          <div className="font-bold text-xl tracking-tight">Satzstrategie Check</div>
        </header>

        {/* --- SCHRITT 1: EINGABE --- */}
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
              Kostenlose KI-Analyse in 30 Sekunden. Wir prüfen Design, Botschaft und Google-Sichtbarkeit.
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
                  Ergebnis im Tausch gegen deine E-Mail (Kein Newsletter, nur der Report).
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

        {/* --- SCHRITT 2: EMAIL GATE --- */}
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
              Wir haben die Ergebnisse für <strong>{url}</strong>. Wohin dürfen wir den Report senden?
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

        {/* --- SCHRITT 3: ERGEBNISSE --- */}
        {step === "results" && result && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-8 pb-20"
          >
            {/* BUTTONS (Werden dank 'no-print' Klasse beim Drucken ausgeblendet!) */}
            <div className="flex flex-wrap gap-4 justify-end mb-8 no-print">
                    <button 
                        onClick={handlePrintPDF}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition shadow-md font-bold"
                    >
                        <span>📄</span> Als PDF speichern / Drucken
                    </button>
                    <button 
                        onClick={handleReset}
                        className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                    >
                        Neu starten
                    </button>
            </div>

            {/* DIESER BEREICH KOMMT INS PDF */}
            <div id="analysis-results" className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0">
                
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Webseiten-Analyse</h2>
                  <p className="text-xl text-slate-500 break-all">{url}</p>
                  <p className="text-sm text-slate-400 mt-2">Geprüft auf: {keywords}</p>
                </div>

                {/* Score Circle */}
                <div className="flex justify-center mb-16">
                <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="2"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={result.totalScore >= 80 ? "#16a34a" : result.totalScore >= 50 ? "#ca8a04" : "#dc2626"}
                        strokeWidth="3"
                        strokeDasharray={`${result.totalScore}, 100`}
                        strokeLinecap="round"
                        className="animate-[spin_1.5s_ease-out_reverse]"
                    />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                    <span className={`text-6xl font-black ${result.totalScore >= 80 ? "text-green-600" : result.totalScore >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                      {result.totalScore}
                    </span>
                    <span className="text-sm text-slate-400 uppercase tracking-wider font-bold mt-1">Gesamt-Score</span>
                    </div>
                </div>
                </div>

                {/* Feedback Karten */}
                <div className="grid md:grid-cols-3 gap-8">
                {result.categories.map((cat: { name: string; score: number; feedback: string }, i: number) => (
                    <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.5 }}
                    className="p-8 rounded-2xl border-2 border-slate-100 bg-slate-50/80 flex flex-col h-full print:break-inside-avoid"
                    >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={`font-bold text-xl ${
                            cat.name.includes("Klarheit") ? "text-blue-900" :
                            cat.name.includes("Design") ? "text-purple-900" :
                            "text-teal-900"
                        }`}>{cat.name}</h3>
                        
                        <span className={`font-black text-3xl ${
                           cat.score >= 80 ? "text-green-600" : cat.score >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {cat.score}
                        </span>
                    </div>
                    
                    <div className="text-slate-700 leading-relaxed font-medium flex-grow text-sm">
                        {cat.feedback.split('\n').map((line: string, index: number) => (
                          <p key={index} className={line.startsWith('-') ? "mb-2 pl-4 border-l-4 border-blue-200" : "mb-4"}>
                            {line}
                          </p>
                        ))}
                    </div>
                    </motion.div>
                ))}
                
                {/* --- BEGINN DER NEUEN AMPEL-LOGIK (MIT RECHTS-ALARM) --- */}
          <div className="mt-16 max-w-5xl mx-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 font-sans">
            
            {/* ZUSATZ-ALARM: BARRIEREFREIHEIT (BFSG) 
                Prüft, ob Kategorie 2 (Design & Accessibility) unter 70 Punkte hat.
            */}
            {result.categories[1].score <= 70 && (
              <div className="mb-8 bg-yellow-50 border-l-8 border-yellow-500 p-6 rounded-r-xl shadow-sm text-left">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⚖️</div>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-900">
                      Achtung: Rechtliches Risiko bei Barrierefreiheit
                    </h3>
                    <p className="text-yellow-800 mt-2 text-md leading-relaxed">
                      Ihr Score im Bereich <strong>Accessibility (Zugänglichkeit)</strong> ist kritisch ({result.categories[1].score}/100). 
                      <br/>
                      <strong>Wichtig:</strong> Ab Juni 2025 tritt das Barrierefreiheitsstärkungsgesetz (BFSG) in Kraft. 
                      Webseiten müssen für alle Menschen zugänglich sein, sonst drohen Abmahnungen. Hier besteht Handlungsbedarf unabhängig vom Gesamt-Score.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SZENARIO ROT: 0 - 49 PUNKTE */}
            {result.totalScore < 50 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-10 text-center shadow-xl">
                <h3 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-6 leading-tight">
                  🚨 Hier besteht dringender Handlungsbedarf!
                </h3>
                <p className="text-red-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                  Ihr Score liegt im kritischen Bereich ({result.totalScore}/100). Das bedeutet, dass Sie aktuell 
                  wahrscheinlich <strong>jeden Tag bares Geld verlieren</strong>, weil Besucher Ihre Botschaft nicht verstehen.
                  Lassen Sie uns das sofort fixen, bevor Sie weiteres Budget verbrennen.
                </p>
                <div className="flex justify-center">
                  <a 
                    href="https://calendly.com/DEIN-LINK"
                    target="_blank"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                  >
                    🆘 Kostenloses Notfall-Gespräch buchen
                  </a>
                </div>
              </div>
            )}

            {/* SZENARIO ORANGE: 50 - 89 PUNKTE */}
            {result.totalScore >= 50 && result.totalScore < 90 && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-10 text-center shadow-xl">
                <h3 className="text-3xl md:text-4xl font-extrabold text-orange-700 mb-6 leading-tight">
                  ⚠️ Da ist noch viel Luft nach oben.
                </h3>
                <p className="text-orange-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                  Ihr Ergebnis ({result.totalScore}/100) ist solide, aber Sie lassen <strong>massives Potenzial liegen</strong>. 
                  Mit den richtigen Handgriffen bei Copywriting & Struktur können wir aus diesen Besuchern echte Kunden machen.
                  Wollen Sie wissen, an welchen Stellschrauben wir drehen müssen, um auf 90+ zu kommen?
                </p>
                <div className="flex justify-center">
                  <a 
                    href="https://calendly.com/DEIN-LINK"
                    target="_blank"
                    className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                  >
                    🚀 Potenzial-Analyse buchen
                  </a>
                </div>
              </div>
            )}

            {/* SZENARIO GRÜN: 90 - 100 PUNKTE */}
            {result.totalScore >= 90 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-10 text-center shadow-xl">
                <h3 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-6 leading-tight">
                  ✅ Exzellente Leistung! Wollen wir skalieren?
                </h3>
                <p className="text-green-900 mb-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                  Wow! Ein Score von {result.totalScore}/100 ist selten. Ihre Seite spielt in der Champions League. 
                  Jetzt geht es nicht mehr ums &quot;Reparieren&quot;, sondern ums <strong>Dominieren</strong>.
                  Wenn Sie wissen wollen, wie Sie mit dieser Basis zum unangefochtenen Marktführer werden:
                </p>
                <div className="flex justify-center">
                  <a 
                    href="https://calendly.com/DEIN-LINK"
                    target="_blank"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-lg md:text-xl font-bold py-4 px-12 rounded-xl shadow-md transform hover:scale-105 transition-all no-underline"
                  >
                    🏆 Strategie-Gespräch für Marktführer
                  </a>
                </div>
              </div>
            )}

          </div>
          {/* --- ENDE DER AMPEL-LOGIK --- */}
          
                </div>

                <div className="mt-16 pt-8 border-t-2 border-slate-100 text-center text-slate-500 text-sm font-medium">
                    <p>Analyse vom {new Date().toLocaleDateString()} | Erstellt mit Satzstrategie KI</p>
                </div>
            </div>

          </motion.div>
        )}

      </div>
    </main>
  );
}
