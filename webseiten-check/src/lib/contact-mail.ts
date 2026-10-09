export function createContactMail({ name, message, website }: { name: string; message: string; website: string }) {
  const body = `Hallo Lilly,\n\n${message.trim()}\n\nMeine Webseite: ${website.trim() || "noch keine"}\n\nViele Grüße\n${name.trim()}`;
  return `mailto:lillycontentcreatorwerkstatt@gmail.com?subject=${encodeURIComponent("Ein Vorhaben für Satzstrategie")}&body=${encodeURIComponent(body)}`;
}
