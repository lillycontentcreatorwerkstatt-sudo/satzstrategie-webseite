import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../src/app/${path}`, import.meta.url), 'utf8');
const activeFiles = [
  'beispiele/page.tsx', 'beispiele/work-examples.tsx',
  'page.tsx', 'leistungen/page.tsx', 'erster-blick/page.tsx', 'wer-wir-sind/page.tsx',
  'kontakt/page.tsx', 'impressum/page.tsx', 'datenschutz/page.tsx', 'not-found.tsx',
  'components/StudioShell.tsx', 'components/MobileMenu.tsx',
  'components/ContactLetter.tsx', 'components/FirstLookLetter.tsx', 'components/CopyEmail.tsx',
];

test('public routes and shared controls do not rely on decorative arrows', () => {
  for (const path of activeFiles) {
    assert.doesNotMatch(read(path), /<Arrow\b|[↗↘→]|className="text-link/, path);
  }
});

test('primary next steps use explicit action surfaces, not linked headlines', () => {
  assert.match(read('page.tsx'), /className="studio-button hero-action" href="\/kontakt">Projekt anfragen/);
  assert.match(read('wer-wir-sind/page.tsx'), /actionLabel="Uns kontaktieren"/);
  assert.match(read('components/StudioShell.tsx'), /<h2>\{children\}<\/h2>/);
  assert.match(read('components/ContactLetter.tsx'), /type="submit">\{sending \? "Wird gesendet …" : "Anfrage senden"\}/);
  assert.match(read('components/FirstLookLetter.tsx'), /<ContactLetter firstLook/);
});
