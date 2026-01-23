import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function POST(request: Request) {
  try {
    const { url, keywords } = await request.json();
    const keywordList = keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
    const keywordsString = keywordList.join('", "'); 

    let targetUrl = url.startsWith("http") ? url : `https://${url}`;
    let browser;

    // Browser-Weiche
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      console.log("🚀 SERVER-MODUS (Vercel)");
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
    await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });

    const screenshot = `data:image/jpeg;base64,${await page.screenshot({ encoding: "base64" })}`;
    const html = await page.content();
    const $ = cheerio.load(html);
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);
    const title = $("title").text();
    const metaDesc = $('meta[name="description"]').attr("content") || "";

    await browser.close();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Prüfe Keywords ["${keywordsString}"]. JSON: { "keywordResults": [{"keyword": "x", "isPresent": true}], "clarityFeedback": "x", "designScore": 50, "designFeedback": "x", "techScore": 50, "techFeedback": "x" }` },
        { role: "user", content: [{ type: "text", text: `Title: ${title}\nDesc: ${metaDesc}\nText: ${bodyText}` }, { type: "image_url", image_url: { url: screenshot } }] }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    // Score Berechnung vereinfacht
    const found = (result.keywordResults || []).filter((k: any) => k.isPresent).length;
    const clarityScore = keywordList.length > 0 ? Math.round((found / keywordList.length) * 100) : 0;

    return NextResponse.json({
        categories: [
            { name: "Klarheit & Hook", score: clarityScore, feedback: result.clarityFeedback },
            { name: "Design & Accessibility", score: result.designScore || 0, feedback: result.designFeedback },
            { name: "Google & KI-Sichtbarkeit", score: result.techScore || 0, feedback: result.techFeedback }
        ],
        totalScore: Math.round((clarityScore + (result.designScore||0) + (result.techScore||0)) / 3)
    });

  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json({ error: "Fehler." }, { status: 500 });
  }
}