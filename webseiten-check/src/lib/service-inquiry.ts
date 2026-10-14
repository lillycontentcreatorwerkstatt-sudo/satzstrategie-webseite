/** Local-only normalization. Never fetches a visitor's address. */
export function normalizeServiceWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/\s/.test(trimmed) || (/^[a-z][a-z\d+.-]*:/i.test(trimmed) && !/^https?:\/\//i.test(trimmed))) throw new Error("Bitte eine Webadresse wie beispiel.de eingeben.");
  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) throw new Error("Bitte eine Webadresse wie beispiel.de eingeben.");
  return url.href;
}
export function createServiceInquiry({ intent, project, website }: { intent: "website" | "text"; project: string; website: string }) {
  if (!project.trim()) throw new Error("Bitte das Vorhaben beschreiben.");
  const url = normalizeServiceWebsite(website);
  const subject = intent === "website" ? "Eine Webseite mit Satzstrategie" : "Meine Texte prüfen lassen";
  const body = `Hallo Lilly,\n\n${project.trim()}${url ? `\n\nMeine Webadresse: ${url}` : ""}\n\nIch freue mich auf ein erstes Gespräch.`;
  return { subject, body, href: `mailto:lillycontentcreatorwerkstatt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
