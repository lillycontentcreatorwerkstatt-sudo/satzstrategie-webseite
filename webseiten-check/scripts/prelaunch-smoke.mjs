import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

// Local preview only. Never submits the contact letter or sends an email.
const origin = process.env.REVIEW_ORIGIN || 'http://127.0.0.1:3102';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(origin).hostname), 'Only run against a local preview.');
const output = resolve('../.impeccable/review/prelaunch');
await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const records = [];
const errors = [];
const externalRequests = new Set();
const internalPaths = new Set();
const routes = ['/', '/beratung', '/wer-wir-sind', '/kontakt', '/analyse', '/text-check', '/impressum', '/datenschutz'];
try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin) externalRequests.add(request.url());
  });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  for (const [width, height] of [[320, 568], [390, 844], [1440, 900]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    for (const route of routes) {
      const response = await page.goto(origin + route, { waitUntil: 'networkidle0' });
      assert.equal(response.status(), 200, route);
      await page.evaluate(() => document.fonts.ready);
      const record = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll('h1').length,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        robots: document.querySelector('meta[name="robots"]')?.content,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content,
        shareImage: document.querySelector('meta[property="og:image"]')?.content,
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
        cookie: document.cookie,
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
      }));
      assert.ok(record.scrollWidth <= width + 1, `Overflow: ${route} at ${width}`);
      assert.equal(record.h1, 1, `Main heading: ${route}`);
      assert.equal(record.canonical, new URL(route, 'https://www.satzstrategie.de').href);
      assert.ok(record.robots.includes('noindex'), 'This is a preview build');
      assert.ok(record.description && record.shareImage, `Metadata missing: ${route}`);
      assert.equal(record.cookie, '');
      assert.deepEqual(record.localStorage, []);
      assert.deepEqual(record.sessionStorage, []);
      for (const link of record.links) {
        if (link?.startsWith('/')) internalPaths.add(new URL(link, origin).pathname);
      }
      records.push({ route, ...record });
      if (width !== 320 && ['/', '/analyse', '/datenschutz'].includes(route)) {
        await page.screenshot({ path: `${output}/${width}-${route.replaceAll('/', '') || 'home'}.png`, fullPage: true });
      }
    }
  }
  // Include short portrait and landscape in the cover layout check.
  for (const [width, height] of [[375, 667], [667, 375], [844, 390], [768, 1024]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(origin, { waitUntil: 'networkidle0' });
    const bounds = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      bandBottom: document.querySelector('.discipline-band').getBoundingClientRect().bottom,
      footerTop: document.querySelector('footer').getBoundingClientRect().top,
    }));
    assert.ok(bounds.width <= width + 1);
    assert.ok(bounds.bandBottom <= bounds.footerTop + 1, `Cover clipped at ${width}x${height}`);
    records.push({ route: '/', width, height, bounds });
  }
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(origin + '/analyse', { waitUntil: 'networkidle0' });
  let apiCalls = 0;
  page.on('request', request => { if (request.url().includes('/api/')) apiCalls++; });
  assert.equal(await page.$$eval('input, textarea', elements => elements.length), 0);
  await page.click('#analysis-example');
  await page.waitForSelector('#analysis-results');
  assert.match(await page.$eval('#analysis-results', node => node.textContent), /Es wurde keine Webseite geprüft/);
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H1');
  await page.screenshot({ path: `${output}/390-example.png`, fullPage: true });
  await page.click('.studio-report-actions button:last-child');
  await page.waitForFunction(() => document.activeElement?.id === 'analysis-example');
  assert.equal(apiCalls, 0);
  await page.click('.mobile-menu summary');
  assert.equal(await page.$eval('.mobile-menu', node => node.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.$eval('.mobile-menu', node => node.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'SUMMARY');
  await page.goto(origin + '/kontakt', { waitUntil: 'networkidle0' });
  assert.equal(await page.$eval('.contact-letter', form => form.checkValidity()), false);
  assert.match(await page.$eval('.contact-letter', node => node.textContent), /weder gespeichert noch versendet/);
  assert.match(await page.$eval('.direct-email', node => node.textContent), /lillycontentcreatorwerkstatt@gmail.com/);
  // Form navigation is intentionally not invoked: no external mail program or send.
  for (const route of internalPaths) assert.equal((await fetch(origin + route)).status, 200, route);
  assert.equal((await fetch(origin + '/nicht-vorhanden')).status, 404);
  for (const [oldPath, path] of [['/index.html', '/'], ['/impressum.html', '/impressum'], ['/datenschutz.html', '/datenschutz'], ['/kontakt.html', '/kontakt']]) {
    const response = await fetch(origin + oldPath, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, path);
  }
  for (const endpoint of ['/api/analyze', '/api/analyze-text', '/api/save-lead']) {
    const response = await fetch(origin + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, 'ANALYSIS_NOT_RELEASED');
  }
  assert.match(await (await fetch(origin + '/robots.txt')).text(), /Disallow: \//);
  const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
  assert.equal((sitemap.match(/<loc>/g) || []).length, 8);
  const imageResponse = await fetch(origin + '/opengraph-image');
  assert.equal(imageResponse.status, 200);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  await writeFile(`${output}/share-image.png`, image);
  assert.deepEqual(errors, []);
  assert.deepEqual([...externalRequests], []);
  await writeFile(`${output}/checks.json`, JSON.stringify({ records, errors, externalRequests: [...externalRequests], exampleApiCalls: apiCalls, checks: 'passed' }, null, 2));
  console.log(`PASS: 24 route/viewport checks, 4 extra cover sizes, metadata, redirects, menu, example/reset, contact validation, no tracking requests/storage, 3 locked APIs. Screenshots: ${output}`);
} finally {
  await browser.close();
}
