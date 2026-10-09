import { NextResponse } from "next/server";
import { analysisReleaseGuard } from "@/lib/analysis-release";
import OpenAI from "openai";
import { checkRateLimit } from "@/lib/rate-limit";
import { TEXT_REVIEW_PROMPT, validateTextReport } from "@/lib/analysis-evidence";

export async function POST(request: Request) {
  const unavailable = analysisReleaseGuard();
  if (unavailable) return unavailable;
  const limit = checkRateLimit(request, "text-analysis", 10, 10 * 60 * 1_000);
  if (!limit.allowed) return NextResponse.json({ error: "Bitte warten Sie einige Minuten vor dem nächsten Textcheck." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  let payload: unknown;
  try { payload = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige JSON-Anfrage" }, { status: 400 }); }
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  const { text, platform, keywords = "" } = payload as Record<string, unknown>;
  if (typeof text !== "string" || typeof keywords !== "string" || keywords.length > 500 || typeof platform !== "string" || !["LinkedIn", "Instagram", "Landingpage"].includes(platform)) {
    return NextResponse.json({ error: "Bitte prüfen Sie Ihre Eingaben." }, { status: 400 });
  }
  const count = text.trim().split(/\s+/).filter(Boolean).length;
  if (count < 20 || count > 500 || text.length > 12_000) return NextResponse.json({ error: "Bitte geben Sie zwischen 20 und 500 Wörtern ein (höchstens 12.000 Zeichen)." }, { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return NextResponse.json({ error: "Der Textcheck ist gerade nicht verfügbar." }, { status: 503 });
  try {
    const openai = new OpenAI({ apiKey, timeout: 25_000, maxRetries: 0 });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: TEXT_REVIEW_PROMPT },
        { role: "user", content: JSON.stringify({ plattform: platform, angebot: keywords, prueftext: text }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    return NextResponse.json(validateTextReport(JSON.parse(response.choices[0]?.message.content || "{}"), text, keywords));
  } catch (error) {
    console.error("Pasted textcheck failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Der Textcheck konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut." }, { status: 502 });
  }
}
