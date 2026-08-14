import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const LEAD_LIMIT = 10;
const LEAD_WINDOW_MS = 10 * 60 * 1_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, "save-lead", LEAD_LIMIT, LEAD_WINDOW_MS);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen", details: "Bitte versuche es in einigen Minuten erneut." },
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

    const { email, url, keywords, score } = payload as Record<string, unknown>;
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }
    if (typeof url !== "string" || url.length > 2_048) {
      return NextResponse.json({ error: "Ungültige Webadresse" }, { status: 400 });
    }
    if (keywords !== undefined && (typeof keywords !== "string" || keywords.length > 500)) {
      return NextResponse.json({ error: "Ungültige Keywords" }, { status: 400 });
    }
    if (score !== undefined && (typeof score !== "number" || !Number.isFinite(score))) {
      return NextResponse.json({ error: "Ungültiger Score" }, { status: 400 });
    }

    const googleSheetUrl = process.env.GOOGLE_SHEET_URL?.trim();
    
    if (!googleSheetUrl) {
      console.error("GOOGLE_SHEET_URL ist nicht konfiguriert.");
      return NextResponse.json(
        { error: "Speicherung nicht verfügbar", details: "Bitte versuche es später erneut." },
        { status: 503 },
      );
    }

    const response = await fetch(googleSheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        url,
        keywords: typeof keywords === "string" ? keywords : "",
        score,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Lead-Ziel antwortet mit Status ${response.status}.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Speichern des Leads:", error);
    return NextResponse.json(
      { error: "Speicherung fehlgeschlagen", details: "Bitte versuche es später erneut." },
      { status: 502 },
    );
  }
}
