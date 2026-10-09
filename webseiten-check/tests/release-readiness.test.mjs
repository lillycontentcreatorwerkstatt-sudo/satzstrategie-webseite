import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analysisReleaseGuard, isAnalysisAvailable } from '../src/lib/analysis-release.ts';
import { isIndexableDeployment, pageMetadata, PUBLIC_ROUTES, SITE_URL, organizationData } from '../src/lib/site-metadata.ts';

test('the unfinished analysis flow stays closed even with configured secrets', async () => {
  const oldKey = process.env.OPENAI_API_KEY;
  const oldSheet = process.env.GOOGLE_SHEET_URL;
  try {
    process.env.OPENAI_API_KEY = 'test-not-a-real-key';
    process.env.GOOGLE_SHEET_URL = 'https://example.invalid/no-request';
    assert.equal(isAnalysisAvailable(), false);
    const response = analysisReleaseGuard();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).code, 'ANALYSIS_NOT_RELEASED');
  } finally {
    if (oldKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = oldKey;
    if (oldSheet === undefined) delete process.env.GOOGLE_SHEET_URL; else process.env.GOOGLE_SHEET_URL = oldSheet;
  }
});

test('only production deployments are indexable, never previews or local builds', () => {
  assert.equal(isIndexableDeployment('production'), true);
  for (const environment of ['preview', 'development', '', 'staging']) {
    assert.equal(isIndexableDeployment(environment), false);
  }
});

test('every public route receives its own canonical and share metadata', () => {
  assert.equal(new Set(PUBLIC_ROUTES).size, 8);
  for (const path of PUBLIC_ROUTES) {
    const metadata = pageMetadata(path, 'Seitentitel', 'Beschreibung');
    const canonical = new URL(path, SITE_URL).href;
    assert.equal(metadata.alternates.canonical, canonical);
    assert.equal(metadata.openGraph.url, canonical);
    assert.equal(metadata.twitter.card, 'summary_large_image');
    assert.equal(metadata.openGraph.title, 'Seitentitel');
  }
});

test('structured data identifies the actual organization without invented ratings', () => {
  const organization = organizationData['@graph'].find(item => item['@type'] === 'Organization');
  assert.equal(organization.name, 'Satzstrategie');
  assert.equal(organization.url, SITE_URL);
  assert.equal(organization.email, 'lillycontentcreatorwerkstatt@gmail.com');
  assert.equal(organization.aggregateRating, undefined);
});
