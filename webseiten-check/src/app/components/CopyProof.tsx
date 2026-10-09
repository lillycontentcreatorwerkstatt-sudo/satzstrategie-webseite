"use client";
import { useState } from "react";

export default function CopyProof() {
  const [revised, setRevised] = useState(true);
  return (
    <figure className="studio-edit" data-revised={revised}>
      <figcaption className="studio-edit-caption"><span>Ein Satz unter der Lupe</span><span>Unsere Kontaktseite: vorher und jetzt</span></figcaption>
      <div className="studio-edit-versions" aria-live="polite" aria-atomic="true">
        <div className="studio-edit-version" aria-hidden={revised}>
          <p className="studio-edit-label">01 / Der erste Entwurf</p>
          <p className="studio-edit-text">Der erste Satz <mark>muss nicht perfekt sein.</mark></p>
          <p className="studio-edit-note"><span>Was fehlt?</span>Worüber sprechen wir? Der Satz bleibt beim Schreiben der Nachricht hängen.</p>
        </div>
        <div className="studio-edit-version" aria-hidden={!revised}>
          <p className="studio-edit-label">02 / Die präzisere Aussage</p>
          <p className="studio-edit-text"><mark>Was haben Sie vor?</mark><br />Neue Texte? Eine neue Webseite? Oder wissen Sie noch nicht, wo es hakt?</p>
          <p className="studio-edit-note"><span>Was sich ändert</span>Jetzt geht es um Ihr Vorhaben. Auch wenn der Auftrag noch nicht feststeht.</p>
        </div>
      </div>
      <button className="studio-edit-toggle" type="button" aria-pressed={revised} onClick={() => setRevised(!revised)}>{revised ? "Den ersten Entwurf ansehen" : "Unsere Korrektur ansehen"}<span aria-hidden="true">{revised ? "↶" : "→"}</span></button>
    </figure>
  );
}
