import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContactMail } from '../src/lib/contact-mail.ts';

test('mail draft preserves German text, paragraph breaks and URL query characters', () => {
  const mail = new URL(createContactMail({ name: ' Jörg ', message: 'Grüße & eine Idee?\nZweite Zeile.', website: 'https://example.com/?a=1&b=2' }));
  assert.equal(mail.protocol, 'mailto:');
  assert.equal(mail.pathname, 'lillycontentcreatorwerkstatt@gmail.com');
  assert.equal(mail.searchParams.get('subject'), 'Ein Vorhaben für Satzstrategie');
  assert.equal(mail.searchParams.get('body'), 'Hallo Lilly,\n\nGrüße & eine Idee?\nZweite Zeile.\n\nMeine Webseite: https://example.com/?a=1&b=2\n\nViele Grüße\nJörg');
  assert.equal([...mail.searchParams.keys()].length, 2);
});

test('mail draft supports a project without an existing website', () => {
  const mail = new URL(createContactMail({ name: 'Lena', message: 'Eine neue Seite.', website: ' ' }));
  assert.match(mail.searchParams.get('body'), /Meine Webseite: noch keine/);
});
