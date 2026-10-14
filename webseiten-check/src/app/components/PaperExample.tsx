"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function PaperExample() {
  const specimen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = specimen.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.settled = "true";
        observer.disconnect();
      }
    }, { threshold: .3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <section className="paper-example section-space" aria-labelledby="paper-example-title">
    <div className="paper-example-intro"><h2 id="paper-example-title">Weniger Floskel.<br />Mehr Aussage.</h2><p>Eine Webseite muss sagen, was jemand anbietet. Hier wird aus einem allgemeinen Versprechen eine konkrete Leistung.</p><Link href="/beispiele">Weitere Beispiele ansehen</Link></div>
    <div className="paper-specimen" ref={specimen}>
      <div className="specimen-before"><h3>Vorher</h3><p>„Wir bieten innovative Lösungen rund um Ihr Zuhause.“</p></div>
      <div className="specimen-after"><h3>Nachher</h3><p>Wir renovieren<br /><strong>Altbauwohnungen<br />in Leipzig.</strong></p><span>Die Arbeit und der Ort stehen fest. Leser wissen sofort, ob das Angebot zu ihnen passt.</span></div>
    </div>
    <p className="specimen-caption">Selbst entwickeltes Text- und Gestaltungsbeispiel für einen erfundenen Handwerksbetrieb. Kein Kundenprojekt.</p>
  </section>;
}
