import InteriorShell from "@/app/components/InteriorShell";

export default function ContactPage() {
  return (
    <InteriorShell eyebrow="Gespräch buchen" title="Lassen Sie uns zuerst herausfinden, was Ihre Website wirklich braucht." intro="Erzählen Sie kurz, wo Sie stehen. Sie erhalten eine ehrliche Einschätzung — auch dann, wenn kein kompletter Neubau nötig ist.">
      <section className="contact-panel">
        <div><p className="interior-eyebrow">Direkter Kontakt</p><h2>Schreiben Sie uns.</h2><p>Am hilfreichsten sind Ihre Webadresse, Ihr Angebot und die Frage, die Sie gerade am meisten beschäftigt.</p></div>
        <a href="mailto:lillycontentcreatorwerkstatt@gmail.com?subject=Gespräch%20mit%20Satzstrategie">E-Mail öffnen ↗</a>
      </section>
    </InteriorShell>
  );
}
