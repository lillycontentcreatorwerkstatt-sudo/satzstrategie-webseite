import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";

// Wir brauchen verschiedene Pakete für Server (Vercel) und Lokal
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { url, keywords } = await request.json();
    
    // 1. Keywords vorbereiten
    const keywordList = keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
    const totalKeywordsCount = keywordList.length;
    const keywordsString = keywordList.join('", "'); 

    // URL Validierung
    let targetUrl = url;
    if (!url.startsWith("http")) {
      targetUrl = `https://${url}`;
    }

    // 2. BROWSER STARTEN (Die Weiche)
    let browser;
    
    // Prüfen, ob wir auf Vercel sind (Environment Variable)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      // SERVER-MODUS (Sparticuz Chromium)
      chromium.setGraphicsMode = false;
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // LOKALER MODUS (Normales Puppeteer)
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1200 });
    
    // Timeout etwas erhöhen für Sicherheit
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });

    const screenshotBuffer = await page.screenshot({ encoding: "base64" });
    const screenshot = `data:image/jpeg;base64,${screenshotBuffer}`;

    const html = await page.content();
    const $ = cheerio.load(html);
    // Text etwas kürzen, um Token zu sparen
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);
    const title = $("title").text();
    const metaDesc = $('meta[name="description"]').attr("content") || "Keine Beschreibung";

    await browser.close();

    // 3. KI-Analyse
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Du bist ein strenger Keyword-Checker.
          
          User-Keywords: ["${keywordsString}"].
          
          AUFGABE KATEGORIE 1 (KLARHEIT):
          - Gehe die Liste der User-Keywords durch.
          - Prüfe für JEDES einzelne Keyword: Kommt es im Text vor? (Ja/Nein).
          - Strikte Regel: Nur exakte Treffer oder direkte Synonyme (Singular/Plural) zählen.
          
          AUFGABE KATEGORIE 2 & 3:
          - Bewerte Design und Technik objektiv (0-100).

          GIB GENAU DIESES JSON FORMAT ZURÜCK:
          {
            "keywordResults": [
              { "keyword": "Name des Keywords", "isPresent": boolean }
            ],
            "clarityFeedback": "Kurzes Feedback.",
            "designScore": number,
            "designFeedback": "Kurzes Feedback.",
            "techScore": number,
            "techFeedback": "Kurzes Feedback."
          }`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Title: ${title}\nDescription: ${metaDesc}\n\nWebseiten-Text: ${bodyText}` },
            { type: "image_url", image_url: { url: screenshot } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // 4. Score Berechnung
    let clarityScore = 0;
    if (result.keywordResults && Array.isArray(result.keywordResults)) {
        const foundCount = result.keywordResults.filter((k: any) => k.isPresent === true).length;
        if (totalKeywordsCount > 0) {
            clarityScore = Math.round((foundCount / totalKeywordsCount) * 100);
        }
    }

    const finalResult = {
        categories: [
            { name: "Klarheit & Hook", score: clarityScore, feedback: result.clarityFeedback },
            { name: "Design & Accessibility", score: result.designScore || 0, feedback: result.designFeedback },
            { name: "Google & KI-Sichtbarkeit", score: result.techScore || 0, feedback: result.techFeedback }
        ],
        totalScore: 0
    };

    let sumScore = 0;
    finalResult.categories.forEach((cat: any) => { sumScore += cat.score; });
    finalResult.totalScore = Math.round(sumScore / 3);

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error("Analyse-Fehler:", error);
    return NextResponse.json({ error: "Fehler bei der Analyse." }, { status: 500 });
  }
}