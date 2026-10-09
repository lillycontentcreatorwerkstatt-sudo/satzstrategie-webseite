import { NextResponse } from "next/server";
import OpenAI from "openai";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import { checkRateLimit } from "@/lib/rate-limit";
import { enablePublicNetworkOnly, parseAndValidatePublicUrl, PublicUrlError } from "@/lib/public-url";
import { extractPageEvidence, TEXT_REVIEW_PROMPT, validateTextReport } from "@/lib/analysis-evidence";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let browser;
  try {
    const limit = checkRateLimit(request, "website-analysis", 5, 10 * 60 * 1_000);
    if (!limit.allowed) return NextResponse.json(
      { error: "Zu viele Analysen", details: "Bitte warten Sie einige Minuten vor dem nächsten Textcheck." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
    let payload: unknown;
    try { payload = await request.json(); }
    catch { return NextResponse.json({ error: "Ungültige JSON-Anfrage" }, { status: 400 }); }
    if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
    const { url, keywords = "" } = payload as Record<string, unknown>;
    if (typeof url !== "string" || typeof keywords !== "string" || keywords.length > 500) {
      return NextResponse.json({ error: "Bitte geben Sie eine Webadresse und höchstens 500 Zeichen zum Angebot ein." }, { status: 400 });
    }
    const targetUrl = await parseAndValidatePublicUrl(url);
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ error: "Der Textcheck ist gerade nicht verfügbar." }, { status: 503 });
    const openai = new OpenAI({ apiKey, timeout: 25_000, maxRetries: 0 });

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      chromium.setGraphicsMode = false;
      const packUrl = process.env.CHROMIUM_REMOTE_EXEC_PATH || "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(packUrl),
        headless: true,
        timeout: 15_000,
      });
    } else {
      browser = await puppeteer.launch({ headless: true, timeout: 15_000, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    }
    const page = await browser.newPage();
    await enablePublicNetworkOnly(page);
    await page.setViewport({ width: 1280, height: 1200 });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    const navigation = await page.goto(targetUrl.toString(), { waitUntil: "networkidle0", timeout: 20_000 });
    if (!navigation?.ok()) return NextResponse.json({ error: "Die Seite konnte nicht gelesen werden. Bitte prüfen Sie die Webadresse." }, { status: 422 });
    const checkedUrl = page.url();
    const evidence = extractPageEvidence(await page.content());
    if (evidence.body.length < 80) return NextResponse.json({ error: "Auf dieser Seite konnten wir zu wenig Text lesen. Nutzen Sie bitte den Textcheck zum Einfügen Ihrer Texte." }, { status: 422 });
    await browser.close();
    browser = undefined;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: TEXT_REVIEW_PROMPT },
        { role: "user", content: JSON.stringify({ angebot: keywords, prueftext: evidence.source }) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });
    const report = validateTextReport(JSON.parse(response.choices[0]?.message.content || "{}"), evidence.source, keywords);
    return NextResponse.json({ ...report, checkedUrl, pageTitle: evidence.title });
  } catch (error) {
    if (error instanceof PublicUrlError) return NextResponse.json({ error: "Webadresse nicht erlaubt", details: error.message }, { status: 400 });
    console.error("Website textcheck failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Der Textcheck konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder nehmen Sie direkt Kontakt auf." }, { status: 502 });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
