import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markFloskeln, createClaudePrompt } from '../src/lib/floskeln.ts';

const found = text => markFloskeln(text).filter(segment => segment.floskel).map(segment => segment.text);

test('typical phrases are marked, also with endings and umlauts', () => {
  assert.deepEqual(found('Wir bieten maßgeschneiderte Lösungen mit höchster Qualität.'), ['maßgeschneiderte', 'Lösungen', 'höchster', 'Qualität']);
  assert.deepEqual(found('Ihr kompetenter Partner – alles aus einer Hand!'), ['kompetenter', 'Partner', 'aus einer Hand']);
});

test('ordinary words that only start like a phrase stay unmarked', () => {
  assert.deepEqual(found('Lösungsmittel entfernen wir höchstens zweimal, die Partnerschaft besteht seit 2019.'), []);
  assert.deepEqual(found('Wir streichen Wohnungen in Bremen.'), []);
});

test('the marked segments rebuild the original sentence', () => {
  const text = 'Flexible, innovative Ideen für Ihr Projekt.';
  assert.equal(markFloskeln(text).map(segment => segment.text).join(''), text);
  assert.deepEqual(found(text), ['Flexible', 'innovative']);
});

test('the Claude prompt carries the own sentence and forbids invented claims', () => {
  assert.match(createClaudePrompt(' Wir streichen Wohnungen. '), /^Hier ist ein Satz von meiner Webseite:\n„Wir streichen Wohnungen\.“/);
  assert.match(createClaudePrompt(''), /„\[Ihr Satz\]“/);
  assert.match(createClaudePrompt('x'), /Erfinde keine Zahlen, Auszeichnungen oder Versprechen\./);
});
