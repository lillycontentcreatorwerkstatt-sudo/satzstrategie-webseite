# Satzstrategie Check

Der Satzstrategie Check ist die Next.js-Anwendung hinter den beiden kostenlosen Analyse-Werkzeugen:

- `/` analysiert Webseiten anhand von Inhalt, Conversion und grundlegenden Barrierefreiheitsmerkmalen.
- `/text-check` analysiert Texte für LinkedIn, Instagram oder Landingpages.

Die statische Unternehmenswebsite liegt eine Ebene höher im Repository und wird unabhängig von dieser Anwendung veröffentlicht.

## Lokal starten

Voraussetzungen: eine aktuelle Node.js-LTS-Version und npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Anschließend ist die Anwendung unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Umgebungsvariablen

- `OPENAI_API_KEY`: API-Schlüssel für die beiden Analysen.
- `GOOGLE_SHEET_URL`: HTTPS-Endpunkt, an den freigeschaltete Leads gesendet werden.
- `CHROMIUM_REMOTE_EXEC_PATH`: optionaler Remote-Pack für Chromium auf Vercel. Ohne Angabe wird der im Code hinterlegte offizielle Sparticuz-Pack verwendet.

Geheimnisse gehören ausschließlich in `.env.local` beziehungsweise in die Vercel Environment Variables und nie ins Repository.

## Qualitätschecks

```bash
npm run lint
npm run build
npm audit
```

## Betriebshinweise

Die Analyse-Endpunkte validieren Eingaben, blockieren lokale und private Netzwerkziele und besitzen ein einfaches In-Memory-Limit pro Client. Für höheren Traffic sollte dieses Limit durch einen zentralen Dienst wie Vercel KV oder Upstash Redis ersetzt werden, weil mehrere Serverless-Instanzen keinen gemeinsamen Speicher besitzen.
