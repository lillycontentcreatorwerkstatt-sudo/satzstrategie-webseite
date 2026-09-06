"use client";
import { useState } from "react";

export default function CopyProof() {
  const [revised, setRevised] = useState(false);
  return (
    <figure className="studio-edit" data-revised={revised}>
      <figcaption className="studio-edit-caption"><span>Ein Satz unter der Lupe</span><span>Aus unserer eigenen Webseite</span></figcaption>
      <div className="studio-edit-versions" aria-live="polite" aria-atomic="true">
        <div className="studio-edit-version" aria-hidden={revised}>
          <p className="studio-edit-label">01 / Der erste Entwurf</p>
          <p className="studio-edit-text">Als Copywriter:innen <mark>bauen wir Webseiten,</mark> die bei Menschen, Google und KI ankommen.</p>
          <p className="studio-edit-note"><span>Die entscheidende Frage</span>Versprechen wir hier gerade einen kompletten Webseiten-Neubau?</p>
        </div>
        <div className="studio-edit-version" aria-hidden={!revised}>
          <p className="studio-edit-label">02 / Die präzisere Aussage</p>
          <p className="studio-edit-text">Als Copywriter:innen sorgen wir dafür, dass Ihre Webseite <mark>gefunden, verstanden und gewählt wird.</mark></p>
          <p className="studio-edit-note"><span>Die bewusste Korrektur</span>Jetzt steht die Aufgabe im Mittelpunkt. Text und Beratung – nicht automatisch eine neue Webseite.</p>
        </div>
      </div>
      <button className="studio-edit-toggle" type="button" aria-pressed={revised} onClick={() => setRevised(!revised)}>{revised ? "Den ersten Entwurf ansehen" : "Unsere Korrektur ansehen"}<span aria-hidden="true">{revised ? "↶" : "→"}</span></button>
    </figure>
  );
}
