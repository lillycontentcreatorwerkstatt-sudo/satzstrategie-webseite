// Typische Webseiten-Floskeln für die Kostprobe „Texte“. Bewusst eine kurze Liste:
// Sie markiert Kandidaten, das Urteil bleibt beim Menschen.
const FLOSKELN = [
  "individuell\\p{L}*", "ma(?:ß|ss)geschneidert\\p{L}*", "ganzheitlich\\p{L}*", "innovativ\\p{L}*", "kompeten(?:t|z)\\p{L}*",
  "zuverlässig\\p{L}*", "professionell\\p{L}*", "hochwertig\\p{L}*", "qualität\\p{L}*", "leidenschaft\\p{L}*",
  "kundenorientier\\p{L}*", "lösung(?:en)?", "dynamisch\\p{L}*", "einzigartig\\p{L}*", "optimal\\p{L}*", "perfekt\\p{L}*",
  "flexib\\p{L}*", "erstklassig\\p{L}*", "mehrwert\\p{L}*", "synergie\\p{L}*", "partner(?:n|in|innen)?", "aus einer hand",
  "rundum\\p{L}*", "full-?service", "höchste[nmrs]?", "bestmöglich\\p{L}*", "state of the art",
];
const pattern = () => new RegExp(`(?<!\\p{L})(?:${FLOSKELN.join("|")})(?!\\p{L})`, "giu");

export type Segment = { text: string; floskel: boolean };

// Zerlegt einen Satz in Abschnitte, Floskeln sind markiert. Läuft nur im Browser, nichts wird gesendet.
export function markFloskeln(text: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern())) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ text: text.slice(last, start), floskel: false });
    segments.push({ text: match[0], floskel: true });
    last = start + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), floskel: false });
  return segments;
}

export function createClaudePrompt(sentence: string): string {
  return [
    "Hier ist ein Satz von meiner Webseite:",
    `„${sentence.trim() || "[Ihr Satz]"}“`, "",
    "Ich biete an: [Ihr Angebot]",
    "Meine Kundschaft: [für wen]", "",
    "Bitte streiche alle Floskeln und schreibe drei kurze Fassungen. Jede soll sagen, was ich tue, für wen und mit welchem Ergebnis. Erfinde keine Zahlen, Auszeichnungen oder Versprechen.",
  ].join("\n");
}
