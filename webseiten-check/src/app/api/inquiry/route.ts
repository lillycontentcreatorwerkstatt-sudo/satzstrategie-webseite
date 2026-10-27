import nodemailer from "nodemailer";
import { INQUIRY_EMAIL, parseInquiry } from "@/lib/inquiry";

// Sends the inquiry through the IONOS mailbox to itself; nothing is stored.
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 10_000) return Response.json({ ok: false }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw); } catch { return Response.json({ ok: false }, { status: 400 }); }

  // Spam: a filled hidden field or a form sent within three seconds is answered as success but not sent.
  const startedAt = Number(data.startedAt);
  if (data.company || !Number.isFinite(startedAt) || Date.now() - startedAt < 3000) return Response.json({ ok: true });

  const mail = parseInquiry(data);
  if ("error" in mail) return Response.json({ ok: false, error: mail.error }, { status: 400 });

  const password = process.env.SMTP_PASSWORD;
  if (!password) {
    console.error("inquiry: SMTP_PASSWORD fehlt");
    return Response.json({ ok: false }, { status: 500 });
  }
  const transport = nodemailer.createTransport({
    host: "smtp.ionos.de", port: 465, secure: true,
    auth: { user: INQUIRY_EMAIL, pass: password },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({ from: { name: "Satzstrategie Webseite", address: INQUIRY_EMAIL }, to: INQUIRY_EMAIL, replyTo: { name: "", address: mail.replyTo }, subject: mail.subject, text: mail.text });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("inquiry: Versand fehlgeschlagen", error instanceof Error ? error.message : error);
    return Response.json({ ok: false }, { status: 502 });
  }
}
