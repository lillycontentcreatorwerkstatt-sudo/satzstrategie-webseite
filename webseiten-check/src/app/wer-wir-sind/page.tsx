import type { Metadata } from "next";
import Link from "next/link";
import StudioShell, { StudioEyebrow } from "@/app/components/StudioShell";

export const metadata: Metadata = {
  title: "Wer wir sind — Satzstrategie",
  description: "Lilly verbindet Copywriting, UX/UI-Design und Softwareentwicklung. Piet ist Inhaber und prüft die Entwürfe mit. KI-Agenten unterstützen die Arbeit, Menschen entscheiden.",
};

export default function AboutPage() {
  return (
    <StudioShell active="/wer-wir-sind">
      <section className="studio-hero studio-about-personal">
        <StudioEyebrow number="03">Wer wir sind</StudioEyebrow>
        <h1 className="studio-title"><span className="studio-mark">Lilly</span> &amp; <span className="studio-mark">Piet</span><span className="studio-name-period">.</span></h1>
        <p className="studio-personal-role">Zwei Menschen. Viele KI-Agenten.</p>
        <p className="studio-lead">Wir haben Satzstrategie gemeinsam aufgebaut.</p>
        <dl className="studio-team-lines">
          <div><dt>Lilly <span>Copywriting · UX/UI-Design · Softwareentwicklung</span></dt><dd>Lilly schreibt die Texte, gestaltet die Nutzerführung und entwickelt die Webseite. Sie steuert die KI-Agenten und prüft deren Ergebnisse vor der Freigabe.</dd></div>
          <div><dt>Piet <span>Inhaber · Der zweite Blick</span></dt><dd>Piet arbeitet im Hintergrund. Er liest mit, hinterfragt Entwürfe und sagt, wo etwas noch nicht überzeugt.</dd></div>
        </dl>
        <aside className="studio-team-support" aria-labelledby="team-support-title">
          <h2 id="team-support-title">Wo KI mitarbeitet.</h2>
          <p>Unsere Agenten unterstützen bei Recherche, Text und Code. Wir prüfen und geben frei. Die Verantwortung bleibt bei uns.</p>
        </aside>
        <div className="studio-actions"><Link href="/kontakt" className="studio-button">Lilly schreiben <span aria-hidden="true">↗</span></Link></div>
      </section>
    </StudioShell>
  );
}
