import assert from 'node:assert/strict';
import { load } from 'cheerio';

// HTTP-only checks: no form submission or external mail client is invoked.
const origin = process.argv[2] || 'http://127.0.0.1:4182';
const canonicalOrigin = 'https://www.satzstrategie.de';
const production = new URL(origin).origin === canonicalOrigin;
assert.ok(production || ['127.0.0.1', 'localhost'].includes(new URL(origin).hostname));
const routes = ['/', '/leistungen', '/beispiele', '/wer-wir-sind', '/kontakt', '/erster-blick', '/impressum', '/datenschutz'];
const pages = new Map();
for (const path of routes) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const $ = load(await response.text());
  assert.equal($('h1').length, 1, `One main heading: ${path}`);
  assert.equal($('html').attr('lang'), 'de');
  assert.equal(new URL($('link[rel="canonical"]').attr('href')).href, new URL(path, canonicalOrigin).href);
  assert.ok($('meta[name="description"]').attr('content'));
  assert.ok($('meta[property="og:image"]').attr('content'));
  assert.equal(($('meta[name="robots"]').attr('content') || '').includes('noindex'), !production);
  pages.set(path, $);
}
for (const [path, $] of pages) {
  for (const link of $('a[href]').toArray()) {
    const href = $(link).attr('href');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href, new URL(path, origin));
    const target = pages.get(url.pathname);
    assert.ok(target, `Known internal page: ${href}`);
    if (url.hash) assert.ok(target('[id]').toArray().some(el => target(el).attr('id') === decodeURIComponent(url.hash.slice(1))), `Anchor target: ${href}`);
  }
}
const redirects = [
  ['/beratung', '/leistungen'], ['/referenzen', '/beispiele'],
  ['/ueber-uns', '/wer-wir-sind'], ['/wir-sind', '/wer-wir-sind'],
  ['/Kontakt?anliegen=text', '/kontakt?anliegen=text'],
  ['/kontakt.html', '/kontakt'], ['/impressum.html', '/impressum'],
  ['/datenschutz.html', '/datenschutz'], ['/index.html', '/'],
];
for (const [from, to] of redirects) {
  const response = await fetch(new URL(from, origin), { redirect: 'manual' });
  assert.equal(response.status, 308, from);
  const location = new URL(response.headers.get('location'), origin);
  assert.equal(location.pathname + location.search, to);
  assert.equal((await fetch(location, { redirect: 'manual' })).status, 200, `No redirect loop: ${from}`);
}
for (const [from, to] of [['/referenzen/', '/beispiele'], ['/impressum/', '/impressum'], ['/Kontakt/', '/kontakt']]) {
  const response = await fetch(new URL(from, origin));
  assert.equal(response.status, 200, from);
  assert.equal(new URL(response.url).pathname, to);
}
const missing = await fetch(new URL('/testbericht-nicht-vorhanden', origin));
assert.equal(missing.status, 404);
const missingPage = load(await missing.text());
assert.match(missingPage('title').text(), /Seite nicht gefunden/);
assert.match(missingPage('meta[name="robots"]').attr('content'), /noindex/);
assert.match(pages.get('/')('title').text(), /Texte und Webseiten/);
assert.doesNotMatch(pages.get('/wer-wir-sind')('meta[name="description"]').attr('content'), /UX\/UI|KI-Spezialistin/);
assert.doesNotMatch(pages.get('/kontakt')('meta[name="description"]').attr('content'), /zweiter Blick/);
assert.doesNotMatch(pages.get('/datenschutz')('article').text(), /nicht vorausgewählt|Die Anwendung/);
assert.match(pages.get('/datenschutz')('article').text(), /14\. Oktober 2026/);
assert.match(pages.get('/erster-blick')('main').text(), /24 Stunden/);
for (const path of ['/kontakt', '/erster-blick']) {
  assert.ok(pages.get(path)('a[href^="mailto:"]').length, `Email without JavaScript: ${path}`);
}
const sitemap = await fetch(new URL('/sitemap.xml', origin));
assert.equal(sitemap.status, 200);
const xml = load(await sitemap.text(), { xmlMode: true });
assert.deepEqual(xml('loc').toArray().map(el => new URL(xml(el).text()).href).sort(), routes.map(path => new URL(path, canonicalOrigin).href).sort());
const robots = await fetch(new URL('/robots.txt', origin));
assert.equal(robots.status, 200);
assert.match(await robots.text(), production ? /Allow: \// : /Disallow: \//);
const image = await fetch(new URL('/opengraph-image', origin));
assert.equal(image.status, 200);
assert.match(image.headers.get('content-type'), /image\/png/);
const bytes = Buffer.from(await image.arrayBuffer());
assert.equal(bytes.readUInt32BE(16), 1200);
assert.equal(bytes.readUInt32BE(20), 630);
console.log(`PASS ${origin}: 8 pages, metadata, anchors, 12 redirect cases, 404, sitemap, robots, mail links, privacy copy, response time, share image.`);
