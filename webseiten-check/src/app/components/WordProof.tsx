"use client";
import { useState } from "react";
const versions = [
  { label: "Ausgangssatz", note: "Eine große Behauptung. Aber was wird hier eigentlich angeboten?", action: "Den Satz präzisieren" },
  { label: "Überarbeitung", note: "Jetzt steht da, was Sie bekommen. Das Angebot lässt sich einordnen.", action: "Ausgangssatz ansehen" },
];
export default function WordProof() {
  const [selected, setSelected] = useState(0);
  return <section className="proof-section" aria-labelledby="proof-title">
    <div className="proof-intro"><h2 id="proof-title">Ein Satz.<br />Ein Unterschied.</h2><p>Ein Wort kann präzisieren. Ein anderes lenkt ab. Wir suchen so lange, bis Aussage und Absicht zusammenpassen.</p><p className="small-note">Ein selbst entwickeltes Beispiel, kein Kundenprojekt.</p></div>
    <div className="proof-paper">
      <div className="proof-tabs" aria-label="Textfassung wählen">{versions.map((version, index) => <button key={version.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{version.label}</button>)}</div>
      <div className="proof-content" aria-live="polite" aria-atomic="true"><p className={selected === 0 ? "proof-sentence proof-before" : "proof-sentence"}>{selected === 0 ? <>Wir bieten <span className="proof-strike">innovative Lösungen</span> für Ihren Erfolg.</> : <>Wir schreiben die Texte, die Ihr Angebot <span className="proof-insert">verständlich</span> machen.</>}</p><p className="proof-annotation">{versions[selected].note}</p></div>
      <button type="button" className="text-link" onClick={() => setSelected(selected === 0 ? 1 : 0)}>{versions[selected].action}<span aria-hidden="true"> →</span></button>
    </div>
  </section>;
}
