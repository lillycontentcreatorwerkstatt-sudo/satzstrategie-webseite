import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeServiceWebsite, createServiceInquiry } from '../src/lib/service-inquiry.ts';
test('optional website supports blank, bare domains and full URLs', () => {
 assert.equal(normalizeServiceWebsite(' '), '');
 assert.equal(normalizeServiceWebsite(' example.com '), 'https://example.com/');
 assert.equal(normalizeServiceWebsite('https://example.com/?a=1&b=2'), 'https://example.com/?a=1&b=2');
});
test('malformed addresses, credentials and unsupported schemes are rejected', () => {
 for (const url of ['kein link','javascript:alert(1)','ftp://example.com','https://user:secret@example.com','https://','example']) assert.throws(() => normalizeServiceWebsite(url), url);
});
test('both inquiry intents create one correctly encoded self-sent draft', () => {
 for (const intent of ['website','text']) {
  const draft=createServiceInquiry({intent,project:' Grüße & Ideen?\nEin zweiter Satz. ',website:'example.com'});
  const url=new URL(draft.href);
  assert.equal(url.pathname,'lillycontentcreatorwerkstatt@gmail.com');
  assert.equal(url.searchParams.get('subject'),intent==='website'?'Eine Webseite mit Satzstrategie':'Meine Texte prüfen lassen');
  assert.equal(url.searchParams.get('body'),draft.body);
  assert.match(draft.body,/Grüße & Ideen\?\nEin zweiter Satz\./);
  assert.equal([...url.searchParams.keys()].length,2);
 }
 assert.throws(()=>createServiceInquiry({intent:'text',project:' ',website:''}));
});
