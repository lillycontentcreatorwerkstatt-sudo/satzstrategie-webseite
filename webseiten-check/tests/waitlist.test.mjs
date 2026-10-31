import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createWaitlistToken, readWaitlistToken, waitlistSecret, createWaitlistConfirmRequest, createWaitlistConfirmed } from '../src/lib/waitlist.ts';

const secret = waitlistSecret('test-passwort');
const day = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 10, 1, 9, 0);

test('a confirmation link carries the address and works for seven days only', () => {
  const token = createWaitlistToken('lena@beispiel.de', start, secret);
  assert.deepEqual(readWaitlistToken(token, start + day, secret), { email: 'lena@beispiel.de', requestedAt: start });
  assert.equal(readWaitlistToken(token, start + 8 * day, secret), null);
  assert.equal(readWaitlistToken(token, start - 1, secret), null);
});

test('forged or foreign links are rejected', () => {
  const token = createWaitlistToken('lena@beispiel.de', start, secret);
  const [, signature] = token.split('.');
  const forged = `${Buffer.from(JSON.stringify({ e: 'fremd@beispiel.de', t: start })).toString('base64url')}.${signature}`;
  assert.equal(readWaitlistToken(forged, start + day, secret), null);
  assert.equal(readWaitlistToken(token, start + day, waitlistSecret('anderes-passwort')), null);
  for (const value of [undefined, '', 'kaputt', `${token}.x`, 'a'.repeat(1001)]) assert.equal(readWaitlistToken(value, start + day, secret), null);
});

test('the confirmation request is factual and the proof names both times', () => {
  const request = createWaitlistConfirmRequest('https://www.satzstrategie.de/selbst-machen/bestaetigen#abc');
  assert.equal(request.subject, 'Bitte bestätigen: Warteliste „Selbst machen“');
  assert.match(request.text, /#abc\n\nDer Link gilt 7 Tage\. Wenn Sie sich nicht eingetragen haben, ignorieren Sie diese E-Mail einfach\./);
  const proof = createWaitlistConfirmed('lena@beispiel.de', start, start + day);
  assert.equal(proof.subject, 'Warteliste bestätigt: lena@beispiel.de');
  assert.equal(proof.replyTo, 'lena@beispiel.de');
  assert.match(proof.text, /Eingetragen: 1\. November 2026 um 10:00\nBestätigt: 2\. November 2026 um 10:00/);
});

test('the waitlist endpoint mails strangers only the confirmation link and stores nothing', () => {
  const code = readFileSync(new URL('../src/app/api/waitlist/route.ts', import.meta.url), 'utf8');
  assert.match(code, /to: INQUIRY_EMAIL, \.\.\.createWaitlistConfirmed/);
  assert.match(code, /to: email, \.\.\.createWaitlistConfirmRequest/);
  assert.match(code, /checkRateLimit\(request, "waitlist"/);
  assert.doesNotMatch(code, /fetch\(|writeFile|OpenAI/);
});
