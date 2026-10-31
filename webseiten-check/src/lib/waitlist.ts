import { createHmac, timingSafeEqual } from "node:crypto";

export const WAITLIST_LINK_DAYS = 7;
export const WAITLIST_CONFIRM_URL = "https://www.satzstrategie.de/selbst-machen/bestaetigen";
const MAX_AGE = WAITLIST_LINK_DAYS * 24 * 60 * 60 * 1000;

export type WaitlistMail = { subject: string; text: string; html?: string; replyTo?: string };

// Double opt-in without a database: the link carries address and time, the signature makes it unforgeable.
// The key is derived from the mailbox password, so no extra secret has to be configured.
export function waitlistSecret(password: string): string {
  return createHmac("sha256", password).update("satzstrategie-warteliste").digest("hex");
}

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

// Only addresses that passed normalizeInquiryEmail are signed, so a valid signature also means a valid address.
export function createWaitlistToken(email: string, now: number, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, t: now })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function readWaitlistToken(token: unknown, now: number, secret: string): { email: string; requestedAt: number } | null {
  if (typeof token !== "string" || token.length > 1000) return null;
  const [payload, signature, rest] = token.split(".");
  if (!payload || !signature || rest !== undefined) return null;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { e, t } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof e !== "string" || !Number.isFinite(t) || t > now || now - t > MAX_AGE) return null;
    return { email: e, requestedAt: t };
  } catch { return null; }
}

const berlin = (time: number) => new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Berlin" }).format(time);

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Goes to the address that was entered. Purely factual, no advertising.
// The HTML part makes the link a real tap target; mail apps do not reliably link long addresses in plain text.
export function createWaitlistConfirmRequest(link: string): WaitlistMail {
  const href = escapeHtml(link);
  return {
    html: [
      `<div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.5;color:#1c2333;max-width:520px">`,
      "<p>Hallo,</p>",
      "<p>Sie haben sich auf satzstrategie.de für die Warteliste „Selbst machen“ eingetragen. Bitte bestätigen Sie Ihre Adresse:</p>",
      `<p style="margin:28px 0"><a href="${href}" style="display:inline-block;padding:14px 28px;background:#1c2333;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold">Adresse bestätigen</a></p>`,
      `<p>Der Link gilt ${WAITLIST_LINK_DAYS} Tage. Wenn Sie sich nicht eingetragen haben, ignorieren Sie diese E-Mail einfach. Dann passiert nichts.</p>`,
      "<p>Viele Grüße<br>Lilly und Piet</p>",
      `<p style="font-size:14px;color:#5b6170">Falls der Knopf nicht funktioniert, öffnen Sie diesen Link:<br><a href="${href}" style="color:#1c2333;word-break:break-all">${href}</a></p>`,
      `<p style="font-size:14px;color:#5b6170">Satzstrategie · <a href="https://www.satzstrategie.de/impressum" style="color:#5b6170">Impressum</a></p>`,
      "</div>",
    ].join("\n"),
    subject: "Bitte bestätigen: Warteliste „Selbst machen“",
    text: [
      "Hallo,", "",
      "Sie haben sich auf satzstrategie.de für die Warteliste „Selbst machen“ eingetragen. Bitte bestätigen Sie Ihre Adresse mit diesem Link:", "",
      link, "",
      `Der Link gilt ${WAITLIST_LINK_DAYS} Tage. Wenn Sie sich nicht eingetragen haben, ignorieren Sie diese E-Mail einfach. Dann passiert nichts.`, "",
      "Viele Grüße", "Lilly und Piet", "",
      "Satzstrategie · https://www.satzstrategie.de/impressum",
    ].join("\n"),
  };
}

// Goes to our own mailbox and is the proof of consent.
export function createWaitlistConfirmed(email: string, requestedAt: number, confirmedAt: number): WaitlistMail {
  return {
    subject: `Warteliste bestätigt: ${email}`,
    text: [
      "Hallo Lilly und Piet,", "",
      "diese Adresse hat die Warteliste „Selbst machen“ bestätigt:", "",
      `Adresse: ${email}`,
      `Eingetragen: ${berlin(requestedAt)}`,
      `Bestätigt: ${berlin(confirmedAt)}`, "",
      "Einwilligung: einmal Bescheid geben, wenn „Selbst machen“ startet. Danach wird die Adresse gelöscht.", "",
      "Diese E-Mail ist der Nachweis der Einwilligung (Double-Opt-in).",
    ].join("\n"),
    replyTo: email,
  };
}
