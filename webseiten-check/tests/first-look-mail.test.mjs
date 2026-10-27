import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeInquiryWebsite, createFirstLookMessage, createFirstLookMail } from '../src/lib/first-look-mail.ts';

const request = { website: 'https://beispiel.de/angebot?a=1&b=2', goal: 'Mehr Anfragen für Größe & Qualität.', name: 'Testperson' };

test('website normalization permits common web addresses without fetching them', () => {
  assert.equal(normalizeInquiryWebsite(' beispiel.de '), 'https://beispiel.de/');
  assert.equal(normalizeInquiryWebsite('https://beispiel.de/angebot'), 'https://beispiel.de/angebot');
  for (const value of ['', 'keine webseite', 'javascript:alert(1)', 'https://user:pass@beispiel.de', 'https://', 'localhost', 'a'.repeat(501)]) {
    assert.equal(normalizeInquiryWebsite(value), null, value);
  }
});

test('a first-look request always asks for the advertised free assessment', () => {
  assert.doesNotMatch(createFirstLookMessage(request), /nicht angefordert/);
  assert.match(createFirstLookMessage(request), /Ich wünsche mir eine kostenlose kurze Ersteinschätzung/);
});

test('mailto keeps recipient fixed and encodes umlauts, line breaks and URL parameters', () => {
  const mail = new URL(createFirstLookMail(request));
  assert.equal(mail.protocol, 'mailto:');
  assert.equal(mail.pathname, 'kontakt@satzstrategie.de');
  assert.equal(mail.searchParams.get('body'), createFirstLookMessage(request));
  assert.equal(mail.searchParams.get('subject'), 'Ein erster Blick auf meine Webseite');
  assert.equal([...mail.searchParams.keys()].length, 2);
});

test('retired endpoints have no scraping, AI, lead-storage or payload handling', () => {
  for (const endpoint of ['analyze', 'analyze-text', 'save-lead']) {
    const code = readFileSync(new URL(`../src/app/api/${endpoint}/route.ts`, import.meta.url), 'utf8');
    assert.match(code, /return analysisReleaseGuard\(\)/);
    assert.doesNotMatch(code, /fetch\(|OpenAI|puppeteer|request\.json/);
  }
});
