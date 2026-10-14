import Link from "next/link";
import { ProofCaret } from "./Proof";

// Ein korrigiertes Blatt: die Floskel ist gestrichen, die konkrete Aussage eingefügt.
export default function PaperExample() {
  return <section className="paper-example section-space" aria-labelledby="paper-example-title">
    <div className="paper-example-intro"><h2 id="paper-example-title" aria-label="Weniger Floskel, mehr Aussage."><del className="proof-del">Floskel.</del><ins className="proof-ins"><ProofCaret />Aussage.</ins></h2><p>Eine Webseite muss sagen, was jemand anbietet. Hier wird aus einem allgemeinen Versprechen eine konkrete Leistung.</p><Link href="/beispiele">Weitere Beispiele ansehen</Link></div>
    <figure className="paper-specimen">
      <div className="proof-sheet">
        <div>
          <p className="proof-sheet-old"><span className="visually-hidden">Vorher: </span><del className="proof-del">„Wir bieten innovative Lösungen rund um Ihr Zuhause.“</del></p>
          <p className="proof-sheet-new"><ProofCaret /><span><span className="visually-hidden">Nachher: </span>Wir renovieren Altbauwohnungen in Leipzig.</span></p>
          <p className="proof-sheet-why">Die Arbeit und der Ort stehen fest. Leser wissen sofort, ob das Angebot zu ihnen passt.</p>
        </div>
        <div className="proof-sheet-notes"><span className="hand">Was? Wo? Für wen?</span><span className="hand">jetzt klar.</span></div>
      </div>
      <figcaption className="specimen-caption">Selbst entwickeltes Text- und Gestaltungsbeispiel für einen erfundenen Handwerksbetrieb. Kein Kundenprojekt.</figcaption>
    </figure>
  </section>;
}
