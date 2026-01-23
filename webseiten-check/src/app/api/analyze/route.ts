import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";
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

    // 2. BROWSER STARTEN
    let browser;
    
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      console.log("🚀 SERVER-MODUS");
      
      // Wir zwingen TypeScript mit "as any", ruhig zu sein
      chromium.setGraphicsMode = false;
      
      browser = await puppeteerCore.launch({
        args: (chromium as any).args,
        defaultViewport: (chromium as any).defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: (chromium as any).headless,
      });
      
    } else {
      console.log("💻 LOKALER MODUS");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1200 });
    
    // Timeout auf 20 Sekunden für mehr Puffer
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });

    const screenshotBuffer = await page.screenshot({ encoding: "base64" });
    const screenshot = `data:image/jpeg;base64,${screenshotBuffer}`;

    const html = await page.content();
    const $ = cheerio.load(html);
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
          content: `Du bist ein Keyword-Checker. Keywords: ["${keywordsString}"].
          Prüfe Klarheit (Keywords da?), Design (0-100), Technik (0-100).
          JSON: {
            "keywordResults": [{ "keyword": "X", "isPresent": boolean }],
            "clarityFeedback": "Text",
            "designScore": number, "designFeedback": "Text",
            "techScore": number, "techFeedback": "Text"
          }`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Title: ${title}\nDesc: ${metaDesc}\nText: ${bodyText}` },
            { type: "image_url", image_url: { url: screenshot } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Score Berechnung
    let clarityScore = 0;
    if (result.keywordResults && Array.isArray(result.keywordResults)) {
        const foundCount = result.keywordResults.filter((k: any) => k.isPresent === true).length;
        if (totalKeywordsCount > 0) {
            clarityScore = Math.round((foundCount / totalKeywordsCount) * 100);
        }
    }

    return NextResponse.json({
        categories: [
            { name: "Klarheit & Hook", score: clarityScore, feedback: result.clarityFeedback },
            { name: "Design & Accessibility", score: result.designScore || 0, feedback: result.designFeedback },
            { name: "Google & KI-Sichtbarkeit", score: result.techScore || 0, feedback: result.techFeedback }
        ],
        totalScore: Math.round((clarityScore + (result.designScore || 0) + (result.techScore || 0)) / 3)
    });

  } catch (error) {
    console.error("Analyse-Fehler:", error);
    return NextResponse.json({ error: "Fehler." }, { status: 500 });
  }
}