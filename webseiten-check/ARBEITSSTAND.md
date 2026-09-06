# Satzstrategie – gespeicherter Arbeitsstand

Stand: 6. September 2026

Diese Datei ist der aktuelle Wiedereinstieg. `STRATEGIE.md` bleibt die historische
Konzeptgrundlage vom 17. August; bei abweichenden Design- oder Textentscheidungen
gelten der hier dokumentierte Stand und die späteren Wünsche von Lilly.

## Ziel und Leitplanken

- Lilly möchte als Copywriterin Fuß fassen, ohne Branchenspezialisierung.
- Webseitentexte, Textüberarbeitung, Webseitenanalyse und persönliche Beratung.
- Beratung kann Empfehlungen für ein bestehendes Webdesignteam liefern;
  sie bedeutet nicht automatisch einen Webseiten-Neubau.
- Satzstrategie besteht aus Lilly und unterstützenden KI-Agenten. Keine erfundenen
  menschlichen Mitarbeitenden, Porträts, Kundenreferenzen oder Erfolgsmessungen.
- Minimalistisch, eigenständig, verständlich und persönlich; keine Textberge.
- Amber: `#E8A94A`. Die Hook bleibt: „Wir sehen, was andere übersehen.“

## Projekt und Vorschau

- Aktuelle Anwendung: Next.js im Verzeichnis `webseiten-check`.
- Lokale Vorschau: `http://localhost:3000/` (`npm run dev` in diesem Verzeichnis).
- Das bestehende Git-Repository wird weiterverwendet. Kein neues Repository.
- Der aktuelle Entwicklungsstand wurde am 6. September 2026 auf Wunsch von Lilly
  zu GitHub hochgeladen: Branch `codex/revival-foundation` im bestehenden Repository
  `lillycontentcreatorwerkstatt-sudo/satzstrategie-webseite`. `main` bleibt unverändert.
- Keine Zusammenführung oder aktive Live-Veröffentlichung vorgenommen. Ob die
  GitHub-Anbindung eine automatische Vercel-Vorschau erzeugt, ist nicht verifiziert.
- Die alten HTML-Dateien im Repository bleiben erhalten. Die Anwendung übernimmt
  die bestehenden Rechtstexte über `src/lib/legal-content.ts`.
- Geheimnisse und lokale Laufzeitdaten bleiben außerhalb der Versionskontrolle.

## Startseite: bewahrte Animation, geschärfter Endzustand

- Scheinwerfer beleuchtet nacheinander „gefunden,“ / „verstanden,“ / „und gewählt“;
  darunter Google / Menschen / KI mit kurzen Amber-Akzenten.
- Breiter gemeinsamer Lichtkegel, „wird.“, anschließendes Zusammenführen des Textes.
- Endsatz: „Als Copywriter:innen sorgen wir dafür, dass Ihre Webseite gefunden,
  verstanden und gewählt wird.“ Danach Hook und Handlungsbereich.
- Die Lichtsteuerung, Ablauflogik und Zeiten wurden in der letzten Anpassung
  unverändert gelassen; dies wurde per Prüfsumme des Logikteils kontrolliert.
- Die bestehende Copywriting-Zeile ist größer und besser lesbar. „Copywriter:innen“
  erhält erst beim Abschluss dieselbe dezente Amber-Unterstreichung wie das
  Gestaltungsmotiv der Unterseiten. Der Text selbst bleibt weiß.
- Neben dem Webseitencheck steht „Über Ihre Texte sprechen“ mit Link zu `/kontakt`;
  auf kleineren Bildschirmen steht dieser Link darunter.
- Microcopy: KI-gestützte Ersteinschätzung / in 30 Sekunden; E-Mail-Abfrage ist vorab
  sichtbar. Formgestaltung etwas kantiger und ruhiger.
- Mobile bleibt bei natürlicher Inhaltshöhe. Für niedrige Desktopfenster gibt es
  einen normalen Textfluss statt einer überlappenden absoluten Positionierung.
- Animation einmal pro Sitzung; bei Rückkehr nach Hause keine erneute Sequenz.
  Reduzierte Bewegung zeigt den Endzustand. Entwicklungsbutton „↻ Animation“ bleibt.

## Unterseiten

- `/analyse`: „Was kommt wirklich an?“; schwarzer Eingabebereich, große weiße
  Beschriftungen „Ihre Webadresse“ und „Ihr Angebot“, helle Eingaben, Amber-CTA.
  Analyse, E-Mail-Freischaltung und Ergebnisbericht sind erhalten. Keine Messung
  von Rankings oder tatsächlichen KI-Empfehlungen, keine vollständige
  Barrierefreiheitsprüfung; Grenzen sind im aufklappbaren Hinweis erklärt.
- `/beratung`: „Ihr Können. In klaren Worten.“; direkter Kontakt und drei
  Leistungsanker. Interaktiver Vorher/Nachher-Vergleich aus unserer eigenen
  Webseitenentwicklung ersetzt das fiktive Beispiel: „Webseiten bauen“ versus
  präzisere Beschreibung der Aufgabe. Keine behauptete Conversion-Steigerung.
- `/wer-wir-sind`: „Ich bin Lilly.“; konkreter Blick auf die Lücke zwischen Können
  und Außenwirkung. Rollen von Lilly und KI-Agenten klar getrennt.
- `/kontakt`: „Der erste Satz muss nicht perfekt sein.“; „Lilly schreiben“ öffnet
  eine E-Mail-Vorlage. Bestehende Kontaktadresse bleibt unverändert. Kein Kalender:
  Ein Termin wird persönlich vereinbart, daher kein irreführendes Sofort-Buchen.
- `/impressum` und `/datenschutz`: gemeinsame klare Gestaltung; bestehende
  Rechtstexte nicht inhaltlich neu geschrieben oder juristisch geprüft.
- Mobile-Menü und direkter Kontakt sind auf den Hauptseiten vorhanden.
- `/text-check` ist eine ältere separate Funktion und wurde nicht neu gestaltet.

## Wichtige Dateien

- `src/app/components/SpotlightHero.tsx` und `src/app/globals.css`: Startseite.
- `src/app/components/StudioShell.tsx` und `studio.css`: Unterseiten-Gestaltung.
- `src/app/components/CopyProof.tsx`: eigene Textentscheidung als Vorher/Nachher.
- `src/app/components/AnalysisExperience.tsx`: Analyseformular und Ergebnisansicht.
- `src/app/components/MobileMenu.tsx`, `MobileMenu.module.css`, `siteNavigation.ts`:
  Navigation einschließlich kleiner Ansichten.

## Prüfstand und nächste sinnvolle Schritte

- Nach der letzten Codeänderung erfolgreich: Produktionsbuild inklusive
  TypeScript, gezielter ESLint-Check, `git diff --check`, lokaler HTTP-Aufruf.
- Die jüngsten Designänderungen sind noch nicht abschließend im Browser auf
  verschiedenen Desktop-/Mobilgrößen oder bei vergrößertem Text visuell abgenommen.
  Nicht als vollständig geprüfte Barrierefreiheit darstellen.
- Nächster Schritt: Lilly beurteilt den neuen ruhenden Startseitenzustand und die
  Unterseiten. Anschließend bei Beauftragung visuell prüfen: Abstände, Footer,
  schmale/kurze Fenster, Kontaktweg, Tastatur und reduzierte Bewegung.
- Ein echtes Porträt von Lilly fehlt bewusst noch: nur ein von ihr ausgewähltes
  Bild verwenden. Weitere Arbeitsbeispiele nur nachvollziehbar und korrekt benennen.
- Vor Veröffentlichung: aktuelle Kontaktdaten, Impressumsanbieter, Datenschutz,
  Analyse-/Lead-Verarbeitung und tatsächliche Analysedauer überprüfen. Keine
  juristische Freigabe oder garantierte Analysezeit aus diesem Stand ableiten.

Die Startseitenanimation ist eine bewusst freigegebene Kernidee. Sie nicht bei
jedem gestalterischen Vorschlag neu entwerfen. Änderungswünsche kurz erklären,
umsetzen und Lilly ausprobieren lassen.
