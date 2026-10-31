export const INQUIRY_EMAIL = "kontakt@satzstrategie.de";

export type InquiryKind = "first-look" | "contact" | "waitlist";

export type Inquiry = {
  kind: InquiryKind;
  email: string;
  message: string;
  website: string;
  name: string;
};

export type InquiryMail = { subject: string; text: string; replyTo: string };

// Syntactic validation only. No DNS lookup, scraping or third-party request.
export function normalizeInquiryWebsite(value: string): string | null {
  const input = value.trim();
  if (!input || input.length > 500 || /\s/.test(input)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    if (!url.hostname.includes(".") || url.hostname.startsWith(".") || url.hostname.endsWith(".")) return null;
    return url.href;
  } catch { return null; }
}

// Deliberately strict: the address becomes the Reply-To header.
export function normalizeInquiryEmail(value: string): string | null {
  const input = value.trim();
  if (input.length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(input)) return null;
  return input;
}

export function createFirstLookMessage({ website, message, name, email }: Omit<Inquiry, "kind">): string {
  return [
    "Hallo Lilly und Piet,", "",
    `meine Webseite: ${website.trim()}`,
    `Das soll sie erreichen: ${message.trim()}`, "",
    "Ich wünsche mir eine kostenlose kurze Ersteinschätzung per E-Mail. Mir ist bewusst, dass dies keine vollständige Prüfung ist.",
    "", "Viele Grüße", name.trim() || "(ohne Namen)", email.trim(),
  ].join("\n");
}

export function createContactMessage({ website, message, name, email }: Omit<Inquiry, "kind">): string {
  return `Hallo Lilly und Piet,\n\n${message.trim()}\n\nMeine Webseite: ${website.trim() || "noch keine"}\n\nViele Grüße\n${name.trim() || "(ohne Namen)"}\n${email.trim()}`;
}

export function createWaitlistMessage(email: string): string {
  return `Hallo Lilly und Piet,\n\nbitte sagen Sie mir einmal Bescheid, wenn „Selbst machen“ startet.\n\nViele Grüße\n${email.trim()}`;
}

const text = (value: unknown, max: number) => typeof value === "string" && value.length <= max ? value : null;

export function parseInquiry(input: unknown): InquiryMail | { error: string } {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const kind = data.kind === "first-look" || data.kind === "contact" || data.kind === "waitlist" ? data.kind : null;
  const email = normalizeInquiryEmail(text(data.email, 254) ?? "");
  if (kind === "waitlist" && email) return { subject: "Warteliste: Selbst machen", text: createWaitlistMessage(email), replyTo: email };
  const message = text(data.message, kind === "first-look" ? 500 : 3000);
  const name = text(data.name ?? "", 120);
  const rawWebsite = text(data.website ?? "", 2048);
  if (!kind) return { error: "kind" };
  if (!email) return { error: "email" };
  if (message === null || message.trim().length < 10) return { error: "message" };
  if (name === null || rawWebsite === null) return { error: "length" };
  if (kind === "first-look") {
    const website = normalizeInquiryWebsite(rawWebsite);
    if (!website) return { error: "website" };
    return { subject: `Ersteinschätzung: ${new URL(website).hostname}`, text: createFirstLookMessage({ website, message, name, email }), replyTo: email };
  }
  return { subject: "Anfrage über die Webseite", text: createContactMessage({ website: rawWebsite, message, name, email }), replyTo: email };
}
