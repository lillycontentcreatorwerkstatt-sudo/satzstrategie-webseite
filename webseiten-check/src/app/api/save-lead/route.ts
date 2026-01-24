import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, url, keywords, score } = await request.json();

    const googleSheetUrl = process.env.GOOGLE_SHEET_URL;
    
    if (!googleSheetUrl) {
      console.error("GOOGLE_SHEET_URL nicht konfiguriert");
      return NextResponse.json({ success: true });
    }

    await fetch(googleSheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, url, keywords, score }),
    });

    console.log("NEUER LEAD (Google Sheet):", email, url, keywords, score);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    return NextResponse.json({ success: true });
  }
}
