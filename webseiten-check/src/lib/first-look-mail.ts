export type FirstLookRequest = {
  website: string;
  goal: string;
  name: string;
  wantsFirstLook: boolean;
};

export const INQUIRY_EMAIL = "lillycontentcreatorwerkstatt@gmail.com";

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

export function createFirstLookMessage(request: FirstLookRequest): string {
  return [
    "Hallo Lilly,", "",
    `meine Webseite: ${request.website.trim()}`,
    `Das soll sie erreichen: ${request.goal.trim()}`, "",
    request.wantsFirstLook
      ? "Ich wünsche mir eine kostenlose kurze Ersteinschätzung per E-Mail. Mir ist bewusst, dass dies keine vollständige Prüfung ist."
      : "Ich möchte über eine mögliche Zusammenarbeit sprechen. Eine kostenlose Ersteinschätzung habe ich nicht angefordert.",
    "", "Viele Grüße", request.name.trim(),
  ].filter(line => line !== undefined).join("\n");
}

export function createFirstLookMail(request: FirstLookRequest): string {
  const subject = request.wantsFirstLook ? "Ein erster Blick auf meine Webseite" : "Anfrage zu meiner Webseite";
  return `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(createFirstLookMessage(request))}`;
}
