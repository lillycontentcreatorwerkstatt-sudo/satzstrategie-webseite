import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

interface KeywordResult {
  keyword: string;
  isPresent: boolean;
}

export async function POST(request: Request) {
  let browser;
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "OpenAI API-Key fehlt.",
          details: "OPENAI_API_KEY ist nicht gesetzt. Lokal: .env.local anlegen. Vercel: Project Settings → Environment Variables.",
        },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });

    const { url, keywords } = await request.json();
    const keywordList = keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
    const keywordsString = keywordList.join('", "'); 

    const targetUrl = url.startsWith("http") ? url : `https://${url}`;

    // Browser-Weiche
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      console.log("🚀 SERVER-MODUS (Vercel)");
      
      // chromium-min: Brotli-Dateien fehlen lokal → Pack von URL laden
      const packUrl = process.env.CHROMIUM_REMOTE_EXEC_PATH ||
        "https://github.com/Sparticuz/chromium/releases/download/v143.0.4/chromium-v143.0.4-pack.x64.tar";
      // Chromium types are incomplete, using any for compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chromiumConfig = chromium as any;
      chromiumConfig.setGraphicsMode = false;
      
      const executablePath = await chromium.executablePath(packUrl);
      console.log("Chromium executable path:", executablePath);
      
      // Timeout für Chromium-Start (15 Sekunden)
      const launchPromise = puppeteerCore.launch({
        args: chromiumConfig.args,
        defaultViewport: chromiumConfig.defaultViewport,
        executablePath: executablePath,
        headless: chromiumConfig.headless,
      });
      
      browser = await Promise.race([
        launchPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Chromium start timeout after 15s")), 15000)
        ) as Promise<never>
      ]);
    } else {
      console.log("💻 LOKALER MODUS");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1200 });
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });

    const screenshot = `data:image/jpeg;base64,${await page.screenshot({ encoding: "base64" })}`;
    const html = await page.content();
    const $ = cheerio.load(html);
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);
    const title = $("title").text();
    const metaDesc = $('meta[name="description"]').attr("content") || "";

    await browser.close();
    browser = null;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `Du bist ein deutschsprachiger Webseiten-Analyst. Antworte ausschließlich auf Deutsch.
    
    Der Nutzer hat diese Keywords eingegeben, die seine Angebote/Leistungen beschreiben: ["${keywordsString}"]
    
    AUFGABE 1 - KEYWORD-CHECK:
    Prüfe für JEDES Keyword einzeln:
    - Wird es klar kommuniziert (in Headline, Hero, prominent sichtbar)?
    - Wird es nur versteckt erwähnt (im Fließtext, schwer zu finden)?
    - Oder fehlt es komplett?
    
    AUFGABE 2 - BARRIEREFREIHEIT (WCAG-Kriterien):
    Prüfe diese konkreten Kriterien anhand von Screenshot und HTML:
    
    Visuell (Screenshot):
    - Kontrast: Ist Text auf allen Hintergründen gut lesbar? (WCAG: mind. 4.5:1)
    - Schriftgröße: Ist Fließtext groß genug? (WCAG: mind. 16px empfohlen)
    - Klickflächen: Sind Buttons/Links groß genug? (WCAG: mind. 44x44px)
    - Farbabhängigkeit: Werden Infos nur durch Farbe vermittelt?
    
    Technisch (HTML):
    - Alt-Texte: Haben Bilder Beschreibungen?
    - Überschriften: Gibt es eine logische H1→H2→H3 Struktur?
    
    Antworte als JSON mit genau dieser Struktur:
    {
      "keywordResults": [{"keyword": "x", "isPresent": true}],
      "clarityFeedback": "Gehe auf JEDES Keyword einzeln ein:\n• [Keyword]: [✓ Stark / ◐ Schwach / ✗ Fehlt] – [Begründung, 1 Satz]\n\nFazit: 1-2 Sätze was ein Besucher versteht und was untergeht.",
      "accessibilityChecks": [
        {"criterion": "Kontrast", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"},
        {"criterion": "Schriftgröße", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"},
        {"criterion": "Klickflächen", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"},
        {"criterion": "Farbabhängigkeit", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"},
        {"criterion": "Alt-Texte", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"},
        {"criterion": "Überschriften-Struktur", "status": "gut/grenzwertig/mangelhaft", "detail": "Kurze Begründung"}
      ],
      "designScore": 50,
      "designFeedback": "2-3 Sätze Gesamteindruck zu Design und Lesbarkeit.",
      "techScore": 50,
      "techFeedback": "2-3 Sätze zu Google- und KI-Sichtbarkeit."
    }`
        },
        { 
          role: "user", 
          content: [
            { type: "text", text: `Title: ${title}\nDesc: ${metaDesc}\nText: ${bodyText}` }, 
            { type: "image_url", image_url: { url: screenshot } }
          ] 
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    const found = ((result.keywordResults as KeywordResult[]) || []).filter((k) => k.isPresent).length;
    const clarityScore = keywordList.length > 0 ? Math.round((found / keywordList.length) * 100) : 0;
    
    // Accessibility-Score aus den Checks berechnen
    const accessibilityChecks = result.accessibilityChecks || [];
    const accessibilityPoints = accessibilityChecks.reduce((sum: number, check: {status: string}) => {
      if (check.status === "gut") return sum + 100;
      if (check.status === "grenzwertig") return sum + 50;
      return sum; // mangelhaft = 0
    }, 0);
    const accessibilityScore = accessibilityChecks.length > 0 
      ? Math.round(accessibilityPoints / accessibilityChecks.length) 
      : result.designScore || 0;
    
    // Prüfen ob kritische Mängel vorliegen
    const hasCriticalIssues = accessibilityChecks.some(
      (check: {status: string}) => check.status === "mangelhaft"
    );
    
    return NextResponse.json({
      categories: [
        { name: "Klarheit & Hook", score: clarityScore, feedback: result.clarityFeedback },
        { name: "Design & Accessibility", score: accessibilityScore, feedback: result.designFeedback },
        { name: "Google & KI-Sichtbarkeit", score: result.techScore || 0, feedback: result.techFeedback }
      ],
      totalScore: Math.round((clarityScore + accessibilityScore + (result.techScore || 0)) / 3),
      accessibilityChecks: accessibilityChecks,
      accessibilityWarning: hasCriticalIssues || accessibilityScore < 70
    });

  } catch (error) {
    // Browser sicher schließen bei Fehler
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
    
    console.error("CRITICAL ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { message: errorMessage, stack: errorStack });
    
    // Zeige auch in Production Details an, damit wir das Problem debuggen können
    return NextResponse.json({ 
      error: "Fehler bei der Analyse.", 
      details: errorMessage,
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined
    }, { status: 500 });
  }
}
