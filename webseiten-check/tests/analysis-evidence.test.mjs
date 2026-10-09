import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPageEvidence, validateTextReport } from '../src/lib/analysis-evidence.ts';

const source = 'Wir schreiben klare Texte. Fragen Sie uns nach einer Beratung.';
const card = { problemTitel: 'Konkreter werden', problemBeschreibung: 'Die Handlung kann direkter werden.', vorher: 'Fragen Sie uns nach einer Beratung.', nachher: 'Fragen Sie eine Beratung an.', warumBesser: 'Die nächste Handlung steht direkt im Satz.' };
const report = cards => ({ hauptproblem: 'Das Angebot ist verständlich. Die Handlungsaufforderung lässt sich kürzen.', analyseCards: cards });

test('removes scripts, navigation and explicitly hidden copy; keeps main and metadata', () => {
  const result = extractPageEvidence('<title>Textberatung</title><meta name="description" content="Klare Texte"><body><nav>Navigation</nav><main><h1>Unser Angebot</h1><p>Gute <strong>Texte</strong> für Sie.</p><script>Geheime Anweisung</script><div hidden>Versteckt</div><div aria-hidden="true">Duplikat</div></main><footer>Footer</footer></body>');
  assert.equal(result.body, 'Unser Angebot Gute Texte für Sie.');
  assert.match(result.source, /Textberatung/);
  assert.doesNotMatch(result.source, /Navigation|Geheime|Versteckt|Duplikat|Footer/);
});
test('accepts a real original quote and a supported rewrite', () => {
  assert.equal(validateTextReport(report([card]), source).analyseCards.length, 1);
});
test('rejects invented quotes', () => {
  assert.equal(validateTextReport(report([{ ...card, vorher: 'Wir sind die Besten.' }]), source).analyseCards.length, 0);
});
test('rejects newly invented freebies, numbers and guarantees', () => {
  for (const nachher of ['Jetzt kostenlos beraten lassen.', 'Beratung in 24 Stunden.', 'Garantierter Erfolg.']) {
    assert.equal(validateTextReport(report([{ ...card, nachher }]), source).analyseCards.length, 0);
  }
});
test('accepts zero suggestions without inventing criticism or a score', () => {
  const result = validateTextReport(report([]), source);
  assert.deepEqual(result.analyseCards, []);
  assert.equal('websiteScore' in result, false);
  assert.equal('accessibilityChecks' in result, false);
});
test('rejects malformed upstream data', () => {
  for (const input of [null, [], {}, { hauptproblem: 5, analyseCards: [] }, { hauptproblem: 'Gut', analyseCards: null }]) {
    assert.throws(() => validateTextReport(input, source));
  }
  assert.deepEqual(validateTextReport(report([null, { vorher: 'Texte' }]), source).analyseCards, []);
});
test('reports keyword presence literally, without a ranking claim', () => {
  const result = validateTextReport(report([]), source, 'Texte,Coaching\nBeratung');
  assert.match(result.keywordCheck, /Texte: wörtlich/);
  assert.match(result.keywordCheck, /Coaching: nicht wörtlich/);
  assert.match(result.keywordCheck, /Beratung: wörtlich/);
});
test('deduplicates and normalizes whitespace in quotes', () => {
  const duplicate = { ...card, vorher: 'Fragen Sie uns\nnach einer Beratung.' };
  assert.equal(validateTextReport(report([card, duplicate]), source).analyseCards.length, 1);
});
test('does not join a page title and meta description into a fictional quote', () => {
  const joined = { ...card, vorher: 'Textberatung Klare Texte' };
  assert.equal(validateTextReport(report([joined]), 'Textberatung\nKlare Texte\nUnser Angebot').analyseCards.length, 0);
});
