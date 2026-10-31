import nodemailer from "nodemailer";
import { INQUIRY_EMAIL, normalizeInquiryEmail } from "@/lib/inquiry";
import { checkRateLimit } from "@/lib/rate-limit";
import { WAITLIST_CONFIRM_URL, createWaitlistConfirmRequest, createWaitlistConfirmed, createWaitlistToken, readWaitlistToken, waitlistSecret, type WaitlistMail } from "@/lib/waitlist";

// Double opt-in, nothing is stored: "request" mails a signed link to the entered address,
// "confirm" checks that link and mails the proof of consent to our own mailbox.
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 5_000) return Response.json({ ok: false }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw); } catch { return Response.json({ ok: false }, { status: 400 }); }

  const password = process.env.SMTP_PASSWORD;
  if (!password) {
    console.error("waitlist: SMTP_PASSWORD fehlt");
    return Response.json({ ok: false }, { status: 500 });
  }
  const secret = waitlistSecret(password);
  const now = Date.now();
  let mail: WaitlistMail & { to: string };

  if (data.step === "confirm") {
    const entry = readWaitlistToken(data.token, now, secret);
    if (!entry) return Response.json({ ok: false, error: "link" }, { status: 400 });
    mail = { to: INQUIRY_EMAIL, ...createWaitlistConfirmed(entry.email, entry.requestedAt, now) };
  } else {
    // Spam: a filled hidden field or a form sent within three seconds is answered as success but not sent.
    const startedAt = Number(data.startedAt);
    if (data.company || !Number.isFinite(startedAt) || now - startedAt < 3000) return Response.json({ ok: true });
    // Mails go to addresses typed by strangers, so one sender gets only a few per ten minutes.
    if (!checkRateLimit(request, "waitlist", 5, 10 * 60 * 1000).allowed) return Response.json({ ok: false }, { status: 429 });
    const email = normalizeInquiryEmail(typeof data.email === "string" ? data.email : "");
    if (!email) return Response.json({ ok: false, error: "email" }, { status: 400 });
    mail = { to: email, ...createWaitlistConfirmRequest(`${WAITLIST_CONFIRM_URL}#${createWaitlistToken(email, now, secret)}`) };
  }

  const transport = nodemailer.createTransport({
    host: "smtp.ionos.de", port: 465, secure: true,
    auth: { user: INQUIRY_EMAIL, pass: password },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({ from: { name: "Satzstrategie", address: INQUIRY_EMAIL }, to: mail.to, replyTo: mail.replyTo, subject: mail.subject, text: mail.text });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("waitlist: Versand fehlgeschlagen", error instanceof Error ? error.message : error);
    return Response.json({ ok: false }, { status: 502 });
  }
}
