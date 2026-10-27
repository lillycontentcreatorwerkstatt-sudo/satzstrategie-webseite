export function createContactMail({ name, message, website }: { name: string; message: string; website: string }) {
  const body = `Hallo Lilly und Piet,\n\n${message.trim()}\n\nMeine Webseite: ${website.trim() || "noch keine"}\n\nViele Grüße\n${name.trim()}`;
  return `mailto:kontakt@satzstrategie.de?subject=${encodeURIComponent("Ein Vorhaben für Satzstrategie")}&body=${encodeURIComponent(body)}`;
}
