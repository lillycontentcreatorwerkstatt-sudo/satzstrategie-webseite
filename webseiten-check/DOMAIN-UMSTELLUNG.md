# Domain-Umstellung auf Vercel

6. September 2026, von Lilly ausdrücklich beauftragt.

## Ausgangsstand und Rückweg

Domainanbieter und DNS-Verwaltung bleiben bei IONOS. Vor der Umstellung wurden
folgende Web-Einträge in der DNS-Verwaltung abgelesen (jeweils TTL 3600 Sekunden):

| Typ | Host | Bisheriger Wert |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | lillycontentcreatorwerkstatt-sudo.github.io |

Diese fünf Werte ermöglichen bei Bedarf die Rückkehr zu GitHub Pages. Die alte
Website und deren Git-Historie werden nicht gelöscht.

## Ziel laut Vercel-Projekteinstellungen

Projekt: `satzstrategie/satzstrategie-webseite`, Umgebung `Production`.
Die Domainnamen sind dort bereits hinzugefügt:

- `www.satzstrategie.de`: aktuelle Produktionsversion.
- `satzstrategie.de`: permanente 308-Weiterleitung auf `www.satzstrategie.de`.

| Typ | Host | Von Vercel vorgegebener neuer Wert |
| --- | --- | --- |
| A | @ | 216.198.79.1 |
| CNAME | www | c348a76a114e6300.vercel-dns-017.com |

## Unverändert lassen

Nameserver, beide MX-Einträge (`mx00.ionos.de`, `mx01.ionos.de`, Priorität 10), SPF,
DMARC, DKIM, Autodiscover, Domain Connect und Google-Verifizierung. Kein Umzug
der Domainregistrierung, keine Änderung von E-Mail-Diensten.

## Status

Umstellung am 6. September 2026 abgeschlossen:

- Beide Domainnamen zeigen in Vercel „Valid Configuration“.
- IONOS enthält den neuen A-Eintrag und den neuen WWW-CNAME. Die drei übrigen
  alten GitHub-A-Einträge wurden gezielt entfernt; die alten Werte stehen oben.
- Ein Vergleich aller DNS-Zeilen vor und nach der Änderung bestätigt, dass
  sämtliche übrigen Einträge unverändert sind, insbesondere die E-Mail-Einträge.
- Der autoritative Nameserver `ns1021.ui-dns.de` liefert die neuen Web-Ziele.
- HTTPS direkt am neuen Vercel-Ziel mit regulärer Zertifikatsprüfung getestet:
  `https://www.satzstrategie.de/` liefert HTTP 200 und die aktuelle Startseite;
  `https://satzstrategie.de/` liefert HTTP 308 auf die WWW-Adresse.
- Geprüfte Anwendung: Git-Commit `880e3d0`, Produktionszweig `main`,
  Vercel Root Directory `webseiten-check`.
- Der Animations-Wiederholungsbutton ist in der öffentlichen Produktionsseite
  nicht enthalten. Lokal bleibt er im Entwicklungsmodus verfügbar.

Zum Prüfzeitpunkt gegen 23:16 Uhr MESZ lieferten lokale DNS-Zwischenspeicher noch
die alten GitHub-Ziele. Die weltweite Verteilung ist damit noch nicht überall
bestätigt. Bei der bisherigen TTL von einer Stunde kann die alte Seite zunächst
noch erscheinen; das ist kein Anlass, die korrekt gesetzten DNS-Werte erneut
zu ändern. Die neue Seite ist unabhängig davon unter
`https://satzstrategie-webseite.vercel.app/` erreichbar.
