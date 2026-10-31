import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeInquiryWebsite, normalizeInquiryEmail, createFirstLookMessage, parseInquiry } from '../src/lib/inquiry.ts';

const firstLook = { kind: 'first-look', website: 'https://beispiel.de/angebot?a=1&b=2', message: 'Mehr Anfragen für Größe & Qualität.', name: 'Testperson', email: 'test@beispiel.de' };

test('website normalization permits common web addresses without fetching them', () => {
  assert.equal(normalizeInquiryWebsite(' beispiel.de '), 'https://beispiel.de/');
  assert.equal(normalizeInquiryWebsite('https://beispiel.de/angebot'), 'https://beispiel.de/angebot');
  for (const value of ['', 'keine webseite', 'javascript:alert(1)', 'https://user:pass@beispiel.de', 'https://', 'localhost', 'a'.repeat(501)]) {
    assert.equal(normalizeInquiryWebsite(value), null, value);
  }
});

test('reply address must be a single plain address', () => {
  assert.equal(normalizeInquiryEmail(' jörg@beispiel.de '), null);
  assert.equal(normalizeInquiryEmail(' joerg@beispiel.de '), 'joerg@beispiel.de');
  for (const value of ['', 'keine', 'a@b', 'a@b.de, c@d.de', 'a@b.de\nBcc: c@d.de', '"x" <a@b.de>', 'a@b.de;c@d.de']) {
    assert.equal(normalizeInquiryEmail(value), null, value);
  }
});

test('a first-look request always asks for the advertised free assessment', () => {
  assert.match(createFirstLookMessage(firstLook), /Ich wünsche mir eine kostenlose kurze Ersteinschätzung/);
  const mail = parseInquiry(firstLook);
  assert.equal(mail.subject, 'Ersteinschätzung: beispiel.de');
  assert.equal(mail.replyTo, 'test@beispiel.de');
  assert.match(mail.text, /meine Webseite: https:\/\/beispiel\.de\/angebot\?a=1&b=2\nDas soll sie erreichen: Mehr Anfragen für Größe & Qualität\./);
  assert.match(mail.text, /Viele Grüße\nTestperson\ntest@beispiel\.de$/);
});

test('a contact request keeps German text and works without website or name', () => {
  const mail = parseInquiry({ kind: 'contact', message: 'Grüße & eine Idee?\nZweite Zeile.', website: ' ', name: '', email: 'lena@beispiel.de' });
  assert.equal(mail.subject, 'Anfrage über die Webseite');
  assert.equal(mail.text, 'Hallo Lilly und Piet,\n\nGrüße & eine Idee?\nZweite Zeile.\n\nMeine Webseite: noch keine\n\nViele Grüße\n(ohne Namen)\nlena@beispiel.de');
});

test('a waitlist request needs only an address and asks for one notification', () => {
  const mail = parseInquiry({ kind: 'waitlist', email: ' lena@beispiel.de ' });
  assert.equal(mail.subject, 'Warteliste: Selbst machen');
  assert.equal(mail.replyTo, 'lena@beispiel.de');
  assert.match(mail.text, /bitte sagen Sie mir einmal Bescheid, wenn „Selbst machen“ startet\./);
  assert.deepEqual(parseInquiry({ kind: 'waitlist', email: 'kaputt' }), { error: 'email' });
});

test('invalid inquiries are rejected', () => {
  assert.deepEqual(parseInquiry(null), { error: 'kind' });
  assert.deepEqual(parseInquiry({ ...firstLook, email: 'kaputt' }), { error: 'email' });
  assert.deepEqual(parseInquiry({ ...firstLook, message: 'kurz' }), { error: 'message' });
  assert.deepEqual(parseInquiry({ ...firstLook, message: 'x'.repeat(501) }), { error: 'message' });
  assert.deepEqual(parseInquiry({ ...firstLook, website: 'keine webseite' }), { error: 'website' });
  assert.deepEqual(parseInquiry({ ...firstLook, name: 42 }), { error: 'length' });
});

test('inquiry endpoint sends only to the own mailbox and keeps the password out of the code', () => {
  const code = readFileSync(new URL('../src/app/api/inquiry/route.ts', import.meta.url), 'utf8');
  assert.match(code, /to: INQUIRY_EMAIL/);
  assert.match(code, /process\.env\.SMTP_PASSWORD/);
  assert.doesNotMatch(code, /fetch\(|OpenAI|puppeteer|writeFile/);
});

test('retired endpoints have no scraping, AI, lead-storage or payload handling', () => {
  for (const endpoint of ['analyze', 'analyze-text', 'save-lead']) {
    const code = readFileSync(new URL(`../src/app/api/${endpoint}/route.ts`, import.meta.url), 'utf8');
    assert.match(code, /return analysisReleaseGuard\(\)/);
    assert.doesNotMatch(code, /fetch\(|OpenAI|puppeteer|request\.json/);
  }
});
