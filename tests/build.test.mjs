import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite, ROOT } from './helpers.mjs';

let site;
before(async () => { site = await buildSite(); });

test('build produces index.html', () => {
  assert.ok(existsSync(join(site, 'index.html')));
});

test('build excludes private dirs', () => {
  for (const p of ['docs', '.superpowers', 'tests', 'scripts', 'supabase', 'package.json']) {
    assert.equal(existsSync(join(site, p)), false, `${p} should not be published`);
  }
});

test('CNAME is treyyadon.space', () => {
  assert.equal(readFileSync(join(ROOT, 'CNAME'), 'utf8').trim(), 'treyyadon.space');
});

test('fallback lists projects and contact', async () => {
  const page = readFileSync(join(site, 'index.html'), 'utf8');
  const fallback = page.slice(page.indexOf('<main id="fallback"'), page.indexOf('</main>'));
  for (const s of ['whosgotit.app', 'pourmemory.com', 'mailto:itstreyyadon@gmail.com']) {
    assert.ok(fallback.includes(s), s);
  }
});

test('embedded data parses', async () => {
  const page = readFileSync(join(site, 'index.html'), 'utf8');
  const m = page.match(/<script type="application\/json" id="treyos-data">([\s\S]*?)<\/script>/);
  assert.ok(m, 'data script present');
  const data = JSON.parse(m[1]);
  assert.ok(Array.isArray(data.projects));
});
