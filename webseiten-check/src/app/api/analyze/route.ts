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
    
    Deine Aufgabe: Prüfe, ob ein Besucher diese Angebote auf der Webseite auch tatsächlich findet und versteht.
    
    Prüfe für JEDES Keyword einzeln:
    - Wird es klar kommuniziert (in Headline, Hero, prominent sichtbar)?
    - Wird es nur versteckt erwähnt (im Fließtext, schwer zu finden)?
    - Oder fehlt es komplett?
    
    Antworte als JSON mit genau dieser Struktur:
    {
      "keywordResults": [{"keyword": "x", "isPresent": true}],
      "clarityFeedback": "Gehe auf JEDES eingegebene Keyword einzeln ein:\n• [Keyword]: [✓ Stark / ◐ Schwach / ✗ Fehlt] – [Wo gefunden oder warum es fehlt, 1 Satz]\n\nNach der Liste: 1-2 Sätze Fazit, was ein Besucher als Erstes versteht und was untergeht.",
      "designScore": 50,
      "designFeedback": "Deutsche Bewertung zu Design und Barrierefreiheit (2–3 Sätze).",
      "techScore": 50,
      "techFeedback": "Deutsche Bewertung zu Google- und KI-Sichtbarkeit (2–3 Sätze).",
      "accessibilityWarning": true oder false (true wenn designScore unter 80)
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
    
    return NextResponse.json({
      categories: [
        { name: "Klarheit & Hook", score: clarityScore, feedback: result.clarityFeedback },
        { name: "Design & Accessibility", score: result.designScore || 0, feedback: result.designFeedback },
        { name: "Google & KI-Sichtbarkeit", score: result.techScore || 0, feedback: result.techFeedback }
      ],
      totalScore: Math.round((clarityScore + (result.designScore || 0) + (result.techScore || 0)) / 3),
      accessibilityWarning: result.accessibilityWarning || (result.designScore < 80)
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
