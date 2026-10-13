import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../src/app/${path}`, import.meta.url), 'utf8');
const activeFiles = [
  'page.tsx', 'beratung/page.tsx', 'erster-blick/page.tsx', 'wer-wir-sind/page.tsx',
  'kontakt/page.tsx', 'impressum/page.tsx', 'datenschutz/page.tsx', 'not-found.tsx',
  'components/StudioShell.tsx', 'components/MobileMenu.tsx', 'components/WordProof.tsx',
  'components/ContactLetter.tsx', 'components/FirstLookLetter.tsx', 'components/CopyEmail.tsx',
];

test('public routes and shared controls do not rely on decorative arrows', () => {
  for (const path of activeFiles) {
    assert.doesNotMatch(read(path), /<Arrow\b|[↗↘→]|className="text-link/, path);
  }
});

test('primary next steps use explicit action surfaces, not linked headlines', () => {
  assert.match(read('page.tsx'), /className="studio-button hero-action" href="\/beratung">Leistungen entdecken/);
  assert.match(read('components/WordProof.tsx'), /className="studio-button proof-action"/);
  assert.match(read('wer-wir-sind/page.tsx'), /actionLabel="Lilly kontaktieren"/);
  assert.match(read('components/StudioShell.tsx'), /<h2>\{children\}<\/h2>/);
  assert.match(read('components/FirstLookLetter.tsx'), /studio-button studio-button-secondary first-look-copy/);
});
