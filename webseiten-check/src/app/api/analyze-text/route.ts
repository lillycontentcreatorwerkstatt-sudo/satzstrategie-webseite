import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rate-limit";

const TEXT_ANALYZE_LIMIT = 10;
const TEXT_ANALYZE_WINDOW_MS = 10 * 60 * 1_000;
const MAX_WORDS = 500;
const MAX_KEYWORDS_LENGTH = 500;
const PLATFORMS = new Set(["LinkedIn", "Instagram", "Landingpage"]);

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(
      request,
      "text-analysis",
      TEXT_ANALYZE_LIMIT,
      TEXT_ANALYZE_WINDOW_MS,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Zu viele Analysen",
          details: "Bitte warte kurz, bevor du einen weiteren Text analysierst.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Ungültige JSON-Anfrage" }, { status: 400 });
    }
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
    }

    const { text, platform, keywords } = payload as Record<string, unknown>;
    if (typeof text !== "string" || typeof platform !== "string" || !PLATFORMS.has(platform)) {
      return NextResponse.json({ error: "Ungültige Eingabe" }, { status: 400 });
    }
    if (keywords !== undefined && typeof keywords !== "string") {
      return NextResponse.json({ error: "Ungültige Keywords" }, { status: 400 });
    }

    const keywordInput = (keywords ?? "") as string;
    if (keywordInput.length > MAX_KEYWORDS_LENGTH) {
      return NextResponse.json(
        { error: "Zu viele Keywords", details: "Bitte kürze die Keyword-Eingabe auf maximal 500 Zeichen." },
        { status: 400 },
      );
    }

    const normalizedText = text.trim();
    const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
    if (wordCount < 20 || wordCount > MAX_WORDS) {
      return NextResponse.json(
        {
          error: wordCount < 20 ? "Text zu kurz" : "Text zu lang",
          details: wordCount < 20
            ? "Bitte gib mindestens 20 Wörter ein, damit eine aussagekräftige Analyse möglich ist."
            : "Bitte kürze den Text auf maximal 500 Wörter.",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API-Key fehlt.",
          details:
            "OPENAI_API_KEY ist nicht gesetzt. Lokal: .env.local anlegen. Vercel: Project Settings → Environment Variables.",
        },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });

    const keywordList = keywordInput
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);

    const platformContext = 
      platform === "LinkedIn"
        ? `LinkedIn-Post: 
           - Hook in den ersten 2 Zeilen essentiell (wird sonst abgeschnitten)
           - Persönliche Perspektive und Meinung gefragt
           - Kurze Absätze für Mobile-Lesbarkeit
           - Professionell aber nicht steif
           - Call-to-Action oder Frage am Ende für Engagement`
        : platform === "Instagram"
        ? `Instagram-Caption:
           - Emotionaler, persönlicher Einstieg
           - Scannable: kurze Absätze, ggf. Emojis als Struktur
           - Authentischer, nahbarer Ton
           - Story-Element oder persönliche Erfahrung
           - CTA für Interaktion (Frage, Aufforderung)`
        : `Landingpage-Text:
           - Klarer Nutzen in der Headline (Was hat der Leser davon?)
           - Benefit-orientiert statt Feature-orientiert
           - Konkrete Zahlen/Ergebnisse wenn möglich
           - Einwände vorwegnehmen
           - Eindeutiger Call-to-Action`;

    const systemPrompt = `Du bist ein erfahrener Copywriting-Experte mit Spezialisierung auf deutschsprachige Texte. Deine Aufgabe ist es, Texte auf KI-typische Schwächen und Copywriting-Fehler zu analysieren.

## KI-ERKENNUNGSMERKMALE (prüfe auf):
- Überverwendung von Füllwörtern: "natürlich", "selbstverständlich", "zweifellos", "grundsätzlich"
- Zu gleichmäßiger Satzrhythmus (ähnliche Satzlängen hintereinander)
- Generische Superlative ohne Substanz: "erstklassig", "herausragend", "einzigartig", "innovativ"
- Passive Konstruktionen wo Aktiv stärker wäre
- Aufzählungen mit zu perfekter Parallelstruktur
- Fehlende Ecken und Kanten – Text klingt "zu glatt", zu perfekt
- Abstrakte Aussagen statt konkreter Beispiele oder Zahlen
- Floskeln: "In der heutigen Zeit", "Es ist kein Geheimnis", "Nicht zuletzt", "Im Bereich"
- Fehlende persönliche Stimme, Meinung oder Haltung
- Übermäßig ausgewogene Formulierungen ohne klare Position

## PLATTFORM-KONTEXT:
${platformContext}

## KEYWORD-KONTEXT:
${keywordList.length > 0 ? `Der Text sollte folgende Themen/Keywords abdecken: ${keywordList.join(", ")}` : "Keine spezifischen Keywords vorgegeben."}

## AUSGABEFORMAT
Antworte AUSSCHLIESSLICH mit validem JSON in genau dieser Struktur:

{
  "kiScore": <Zahl 1-10, wobei 10 = stark KI-typisch/roboterhaft, 1 = sehr menschlich>,
  "kiScoreBegruendung": "<1 Satz: Was macht den Text KI-typisch oder menschlich?>",
  "hauptproblem": "<Knackige Beschreibung des größten Problems in 1-2 Sätzen>",
  "analyseCards": [
    {
      "problemTitel": "<Kurzer Titel, max 4 Wörter>",
      "problemBeschreibung": "<Was genau ist das Problem? 2-3 Sätze, konkret auf den Text bezogen>",
      "vorher": "<EXAKTES Zitat aus dem eingesendeten Text, max 20 Wörter>",
      "nachher": "<Deine verbesserte Version, ähnliche Länge>",
      "warumBesser": "<1 Satz: Was macht die Änderung aus?>"
    },
    {
      "problemTitel": "<Titel>",
      "problemBeschreibung": "<Beschreibung>",
      "vorher": "<Zitat>",
      "nachher": "<Verbesserung>",
      "warumBesser": "<Erklärung>"
    },
    {
      "problemTitel": "<Titel>",
      "problemBeschreibung": "<Beschreibung>",
      "vorher": "<Zitat>",
      "nachher": "<Verbesserung>",
      "warumBesser": "<Erklärung>"
    }
  ],
  "plattformPassung": "<Wie gut passt der Text zur Plattform ${platform}? 1-2 Sätze.>",
  "teaserWeitereProbleme": "<1 Satz der andeutet, dass es noch mehr zu verbessern gibt, ohne Details>"
}

## WICHTIGE REGELN:
1. Die "vorher"-Zitate MÜSSEN EXAKT aus dem eingesendeten Text stammen – keine Paraphrasen!
2. Die "nachher"-Versionen müssen sofort umsetzbar sein, gleicher Inhalt nur besser formuliert
3. Halte die Verbesserungen im gleichen Stil, nur besser – nicht komplett umschreiben
4. GENAU 3 analyseCards, auch wenn du mehr Probleme siehst
5. Wenn der Text bereits gut ist (kiScore unter 3), gib trotzdem 3 Feinschliff-Tipps
6. Sei KONKRET – beziehe dich immer auf den tatsächlichen Text
7. Deutscher Text, Du-Ansprache, professionell aber auf Augenhöhe`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Analysiere folgenden ${platform}-Text:\n\n---\n${normalizedText.slice(0, 8_000)}\n---`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message?.content ?? "{}");
    
    // Validierung und Defaults
    const kiScore = Math.min(10, Math.max(1, Number(result.kiScore) || 5));
    const analyseCards = Array.isArray(result.analyseCards) ? result.analyseCards.slice(0, 3) : [];
    
    // Score umrechnen: kiScore 1-10 → displayScore 100-0 (niedriger KI-Score = besserer Text)
    const displayScore = Math.round(((10 - kiScore) / 9) * 100);

    return NextResponse.json({
      // Neue Premium-Felder
      kiScore,
      kiScoreBegruendung: result.kiScoreBegruendung || "",
      hauptproblem: result.hauptproblem || "",
      analyseCards: analyseCards.map((card: {
        problemTitel?: string;
        problemBeschreibung?: string;
        vorher?: string;
        nachher?: string;
        warumBesser?: string;
      }) => ({
        problemTitel: card.problemTitel || "Verbesserungspotenzial",
        problemBeschreibung: card.problemBeschreibung || "",
        vorher: card.vorher || "",
        nachher: card.nachher || "",
        warumBesser: card.warumBesser || "",
      })),
      plattformPassung: result.plattformPassung || "",
      teaserWeitereProbleme: result.teaserWeitereProbleme || "",
      
      // Kompatibilität mit bestehendem Frontend (falls nötig)
      totalScore: displayScore,
      categories: [
        {
          name: "KI-Erkennungs-Score",
          score: displayScore,
          feedback: result.kiScoreBegruendung || "",
        },
      ],
      platform,
    });
  } catch (error) {
    console.error("analyze-text error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Fehler bei der Text-Analyse.", details: msg },
      { status: 500 }
    );
  }
}
