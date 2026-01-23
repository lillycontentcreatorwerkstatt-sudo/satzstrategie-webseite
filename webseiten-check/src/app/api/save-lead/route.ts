import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, url, keywords } = await request.json();

    // HINWEIS: Online können wir keine CSV speichern (Serverless).
    // Hier würden wir später eine E-Mail an dich senden oder eine Datenbank nutzen.
    // Für jetzt loggen wir es nur, damit der User keinen Fehler sieht.
    
    console.log("NEUER LEAD (Online):", email, url, keywords);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
