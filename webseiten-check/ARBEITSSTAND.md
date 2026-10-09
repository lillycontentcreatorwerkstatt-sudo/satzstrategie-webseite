# Satzstrategie – gespeicherter Arbeitsstand

Stand: 9. Oktober 2026 — geprüfter Stand zur Veröffentlichung freigegeben

## Veröffentlichung am 9. Oktober 2026

- Lilly hat Commit, Push und Veröffentlichung des aktuellen Vorschau-Stands
  beauftragt. Enthalten sind die Text-/Layoutänderungen sowie die bereits lokal
  geprüfte Überarbeitung des Textchecks einschließlich Zitatvalidierung.
- Vor Freigabe: ESLint, alle neun Tests und Produktionsbuild erfolgreich.
  Hauptzweig vor Veröffentlichung identisch mit GitHub; kein Force-Push nötig.
- Neue interne Agentenanbindung, globale Kostenlimits, endgültiger Umfang der
  Gratisanalyse und rechtliche Aktualisierung bleiben offen. Keine neuen
  Dienstzugänge, Umgebungsvariablen oder personenbezogenen Test-Leads angelegt.
- Deployment und Domain-Auslieferung werden nach dem Push separat geprüft.
  Die folgenden Angaben „lokal/nicht veröffentlicht“ beschreiben den vorherigen
  Arbeitsstand und werden durch den bestätigten Release abgelöst.

## Textüberarbeitung am 9. Oktober 2026 — noch nicht veröffentlicht

- Lillys Angebot umfasst Copywriting, UX/UI-Design und Softwareentwicklung.
  Piet bleibt Inhaber und zweiter menschlicher Blick. Keine Branchenbindung.
- Haupt-Hook „Wir sehen, was andere übersehen.“ und Licht-Choreografie bleiben.
  Die bleibende Zeile darüber nennt „Copywriting, Design und Entwicklung.“
  Kontakt-CTA: „Ihr Projekt besprechen“. Keine Änderung an Animationszeiten.
- Navigation: „Leistungen“ statt „Copywriting & Beratung“, Route `/beratung` bleibt.
  Einstieg „Jeder Satz. Jeder Klick.“; vier Leistungen: Texte, Design, Entwicklung,
  Analyse/Beratung. Überarbeitung und Einzelaufträge ausdrücklich möglich.
- Auf Wunsch anschließend den schwarzen Kasten „Sie wissen, was Sie können …“
  unverändert von der Teamseite zur Leistungsseite verschoben. Er ersetzt dort
  den Vorher/Nachher-Vergleich; dessen Komponentendatei bleibt als Entwurf erhalten.
- Teamseite: konkrete Tätigkeiten und menschliche Prüfung/Freigabe statt einer
  Beschränkung Lillys auf Textberatung. Namen und Amber-Unterstreichungen bleiben.
- Teamseite gestrafft: kurzer Einstieg, direkt Lilly und Piet, danach ein kleiner
  Absatz zur KI-Unterstützung und „Lilly schreiben“ als Kontaktlink. Keine dritte
  gleichrangige Agenten-Rolle und kein Werbekasten zwischen Einstieg und Menschen.
  Bei 390 px beginnt der Rollenbereich jetzt bei ca. 387 px. Beide geänderten
  Seiten bei 320/390/768/1280 px geprüft: kein horizontaler Überlauf, keine
  Browserfehler. ESLint und Produktionsbuild nach dem Umbau erfolgreich.
- Kontakt: „Was haben Sie vor?“; direkter E-Mail-Weg und bestehende Adresse bleiben.
- Kostenloser Einstieg weiterhin klar als KI-Textcheck bezeichnet. Den bisher
  nicht unter echten Produktionsbedingungen belegten 30-Sekunden-Hinweis entfernt.
  E-Mail-Voraussetzung bleibt vorab sichtbar. Keine Änderung an API/Agentenanbindung.
- Keine versteckten Werbebotschaften, Ranking- oder KI-Empfehlungsgarantien.
  Technische Leistung: HTML-Struktur, Metadaten und passende strukturierte Daten.
- Prüfung: ESLint, 9 Tests und Produktionsbuild mit TypeScript erfolgreich.
  Fünf Seiten bei 320, 390, 768 und 1280 px ohne horizontalen Überlauf;
  Kontaktbutton bei 320×568 ohne Scrollen erreichbar. Browser ohne JS-Fehler,
  Animation erreicht bei 390 px ihren Endzustand. Screenshots visuell geprüft.
  Keine vollständige Barrierefreiheitsprüfung oder Live-Analyse durchgeführt.
- Dateien lokal gespeichert. Kein Commit, Push oder Deployment dieser Runde.

Die nachfolgenden Abschnitte dokumentieren frühere Stände. Bei abweichenden
Textformulierungen gilt die Überarbeitung vom 9. Oktober.

## Gezielte Team-Veröffentlichung am 8. Oktober 2026

- Auf ausdrücklichen Wunsch nur `src/app/wer-wir-sind/page.tsx` committed und nach
  GitHub `main` gepusht: `81f541a30b79d1e3c85664ba3e74d425a53c62ef`.
- Lilly und Piet, beide mit Amber-Unterstreichung, ihre unterschiedlichen Rollen
  und die KI-Unterstützung werden auf `https://www.satzstrategie.de/wer-wir-sind`
  ausgeliefert. Direkt am öffentlichen Ziel geprüft.
- Vorher isolierter Produktionsbuild aus dem alten veröffentlichten Stand plus
  ausschließlich dieser Teamseite erfolgreich; kein Übernehmen anderer Änderungen.
- Analyse, Datenschutz, Startseite, Kontaktseite und alle übrigen lokalen
  Überarbeitungen bleiben unveröffentlicht. Die folgende Übersicht beschreibt
  diese lokale Weiterentwicklung; bei Veröffentlichungsangaben gilt dieser Abschnitt.
- Analyse-/Agenten-Anbindung später gemeinsam planen: nur ein bis zwei hilfreiche
  Hinweise im kostenlosen Einstieg, vertiefte Arbeit über Kontakt. Übergabe an
  interne Agenten, Lillys Freigaben/Skills sowie Missbrauchsschutz und Kostenlimits
  sind noch zu gestalten, nicht als bereits umgesetzt darstellen.

## Aktuell: Review umgesetzt

- Bestehendes Repository und Vercel bleiben. Nur die Teamseite wurde veröffentlicht;
  keine DNS-Änderung und keine Veröffentlichung der restlichen Überarbeitung.
- Freigegebene Scheinwerferfolge, Bewegung, Amber und Hook bleiben. Die Aussage ist
  jetzt als Ziel formuliert: „Unser Ziel als Copywriter:innen: eine Webseite, die
  gefunden, verstanden und gewählt wird.“ Keine Zusage bestimmter Rankings.
- Während des Intros sind „Copywriting & Beratung“ und „Zum Textcheck“ sichtbar.
  Überspringen beendet die Sequenz sauber und fokussiert das URL-Feld. Rückkehr,
  reduzierte Bewegung, blockierter Sitzungsspeicher und HTML ohne JavaScript haben
  einen statischen Endzustand bzw. eine sichere Ausweichlösung. Ohne JavaScript
  ist die eigentliche API-Analyse weiterhin nicht bedienbar.
- Entwicklungsbutton bleibt lokal; in Produktionsbuilds weiterhin ausgeblendet.
- CTA heißt „Textcheck starten“. Einzelne eingegebene Seite, KI-Unterstützung,
  ungefähre Dauer und E-Mail-Abfrage sind vorab erkennbar.
- Öffentliche Namen verbindlich: **Lilly und Piet**. Satzstrategie gemeinsam ins
  Leben gerufen; rechtlicher Inhaber ist Peter, bereits im Impressum benannt.
  Lilly verantwortet Copywriting und Beratung; Piet arbeitet im Hintergrund und
  bringt den zweiten menschlichen Blick ein. KI-Agenten unterstützen beide.
  Keine Ergänzung von Lillys bürgerlichem Namen auf der öffentlichen Teamseite.
- `/kontakt`: „Lilly schreiben“ direkt unter dem Einstieg; E-Mail-Adresse kann
  alternativ kopiert werden. Auf 320×568 liegt der Button bei y≈438 und ist ohne
  Scrollen erreichbar. Es wird weiterhin eine E-Mail geöffnet, kein Kalender.
- `/beratung`: konkrete Leistungen statt abstrakter Beschreibungen. Der eigene
  Vorher/Nachher-Vergleich zeigt zuerst die präzisere Fassung.
- `/wer-wir-sind`: „Lilly & Piet.“ und „Zwei Menschen. Viele KI-Agenten.“
  Beide menschlichen Rollen und die KI-Unterstützung werden getrennt vorgestellt.
- `/text-check`: Einfügen eigener Texte bleibt erhalten, jetzt im gemeinsamen
  Design und mit derselben Auswertung wie `/analyse`. Kein „KI-Erkennungs-Score“.
- Alte Links `/kontakt.html`, `/impressum.html`, `/datenschutz.html`, `/index.html`
  werden dauerhaft auf die entsprechenden neuen Seiten weitergeleitet.

### Analyse: veränderte Aussagekraft

- Nur Textredaktion, kein vorgetäuschter Gesamt-Webseitentest. Keine willkürlichen
  Punktzahlen, keine modellgeschätzten Kontrast-/WCAG-Befunde, keine KI-Urheberschaft.
- Skripte, Navigation und explizit versteckte Inhalte werden vor dem Check entfernt.
  Seitentitel, Beschreibung und Haupttext sind getrennte Zitatquellen.
- Null bis drei Vorschläge; Originalzitate werden gegen den gelesenen Text geprüft.
  Ungültige Zitate, Dubletten und bestimmte neu erfundene Zahlen/Gratis-/Garantie-
  versprechen werden verworfen. Das ist kein vollständiger Faktenprüfer: fachliche
  Aussagen und semantische Bedeutungsänderungen brauchen weiter menschliche Prüfung.
- Angebotsstichworte werden ausdrücklich nur wörtlich abgeglichen. Kein Rückschluss
  von fehlender wörtlicher Nennung auf fehlende Google-/KI-Sichtbarkeit.
- Ergebnisbericht zeigt zuerst den Inhalt; Druck- und Neustartbuttons stehen unten.
  E-Mail-Freischaltung bleibt erhalten; keine Speicherung eines erfundenen Scores.

### Prüfung und Grenzen

- 9 automatisierte Tests für Extraktion, Zitate, erfundene Zusätze, ungültige
  Antworten, Null-Vorschläge und Stichwortabgleich. Ausführen: `npm test` (Node 22.18+
  oder neuer; geprüft mit Node 25). ESLint, Produktionsbuild inklusive TypeScript
  und `git diff --check` nach der letzten Codeänderung erfolgreich.
- Chrome-Prüfung: 320×568, 390×844, 768×1024 und 1280×800. Kein horizontaler Überlauf in den
  geprüften Ansichten. Desktop-Startseite samt Footer bei 1280×800 vollständig sichtbar.
- Überspringen → URL-Fokus → Übergabe an Analyse im Browser getestet.
- Isolierter Produktions-Test auf Port 3001: Text eingeben → E-Mail-Gate → simulierte
  Speicherstörung → erneuter Versuch → Ergebnisansicht. Nur reservierte example.com-
  Adressen gegen lokalen Testdienst; keine echten Leads gespeichert.
- Tatsächliches Einlesen von `https://www.satzstrategie.de/` mit simuliertem KI-Dienst:
  HTTP 200 in rund 6 Sekunden. Fehlerhafte Modellantwort: HTTP 502. Null Vorschläge:
  HTTP 200. Interne URL/ungewöhnlicher Port abgewiesen. Alter Kontaktlink: HTTP 308.
- Lokal fehlen die echten OpenAI-/Lead-Zugangsdaten. Eine echte KI-Antwort der
  neuen Fassung und die echte Google-Sheets-Anbindung wurden deshalb nicht getestet.
  Testdienst unter `tests/fixture-server.mjs` gehört nicht zur Anwendung und wird
  nach dem Test beendet. Niemals Test-Umgebungsvariablen auf Vercel übernehmen.
- Kein vollständiger Barrierefreiheitstest, kein Test auf realem iPhone/Safari,
  keine abschließende Druck-/PDF- oder Screenreader-Abnahme.

### Vor einer Veröffentlichung noch klären

- Datenschutz auf den tatsächlichen Ablauf bringen: OpenAI für Prüftexte und
  Google-Sheets-Ziel für E-Mail/Webadresse/Angebot; Zweck, Speicherfristen,
  Verantwortlichkeit und verwendete Dienstkonfigurationen bestätigen lassen.
- Bestehende Rechtstexte enthalten noch historische Cookie-/Formularbeschreibungen.
  Sie wurden nicht durch erfundene rechtliche Zusicherungen ersetzt.
- Reale KI-Auswertung und Lead-Anbindung mit berechtigt bereitgestellter Test-
  Konfiguration prüfen. Veröffentlichung erst nach Freigabe.

---

## Historischer Stand vom 6. September 2026

Die folgenden Abschnitte dokumentieren die vorherige veröffentlichte Fassung.
Bei Abweichungen gilt der aktuelle Stand oben.

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
- Der aktuelle Entwicklungsstand wurde am 6. September 2026 zunächst auf
  `codex/revival-foundation` zu GitHub hochgeladen. Anschließend hat Lilly gewünscht,
  dass der neue Stand den veralteten Stand in `main` ersetzt.
- Aktueller Hauptzweig ist deshalb `main` im bestehenden Repository
  `lillycontentcreatorwerkstatt-sudo/satzstrategie-webseite`. Die Übernahme erfolgt
  regulär als Fast-forward, ohne Force-Push; ältere Versionen bleiben erhalten.
- Ein Push auf `main` kann die angebundene Veröffentlichung auslösen. Ein aktueller
  GitHub-Stand allein bestätigt noch nicht die erfolgreich ausgelieferte Live-Seite.
- Am 6. September 2026 wurde die bestehende Domain bei IONOS auf das Vercel-Projekt
  umgestellt: `https://www.satzstrategie.de/`, mit Weiterleitung von
  `https://satzstrategie.de/`. Beide Domainkonfigurationen und HTTPS am neuen Ziel
  sind geprüft; DNS-Zwischenspeicher können vorübergehend noch die alte Seite zeigen.
  E-Mail-Einträge bleiben unverändert. Details und Rückweg: `DOMAIN-UMSTELLUNG.md`.
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
- Noch ausstehende inhaltliche Freigabe trotz erfolgter Domain-Umstellung:
  aktuelle Kontaktdaten, Impressumsanbieter, Datenschutz,
  Analyse-/Lead-Verarbeitung und tatsächliche Analysedauer überprüfen. Keine
  juristische Freigabe oder garantierte Analysezeit aus diesem Stand ableiten.

Die Startseitenanimation ist eine bewusst freigegebene Kernidee. Sie nicht bei
jedem gestalterischen Vorschlag neu entwerfen. Änderungswünsche kurz erklären,
umsetzen und Lilly ausprobieren lassen.
