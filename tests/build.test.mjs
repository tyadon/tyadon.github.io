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

const SLUGS = ['ai-sites-all-look-the-same', 'work-with-a-ceiling', 'check-the-finished-looking-stuff'];

test('each post has a page', () => {
  for (const s of SLUGS) assert.ok(existsSync(join(site, 'notes', s, 'index.html')), s);
});

test('canonical uses treyyadon.space', () => {
  for (const s of SLUGS) {
    const page = readFileSync(join(site, 'notes', s, 'index.html'), 'utf8');
    assert.ok(page.includes(`<link rel="canonical" href="https://treyyadon.space/notes/${s}/"`), s);
  }
});

test('notes index is valid json, newest first', () => {
  const list = JSON.parse(readFileSync(join(site, 'notes', 'index.json'), 'utf8'));
  assert.equal(list.length, 3);
  for (const p of list) for (const k of ['title', 'url', 'date', 'excerpt']) assert.ok(p[k], k);
  const dates = list.map((p) => p.date);
  assert.deepEqual([...dates].sort().reverse(), dates);
});

test('feed exists', () => {
  assert.ok(existsSync(join(site, 'feed.xml')));
});

test('posts have no em-dashes', () => {
  for (const s of SLUGS) {
    const page = readFileSync(join(site, 'notes', s, 'index.html'), 'utf8');
    assert.equal(page.includes('—'), false, s);
  }
});

test('post pages work without the desktop', () => {
  const page = readFileSync(join(site, 'notes', SLUGS[0], 'index.html'), 'utf8');
  assert.ok(page.includes('<article'));
  assert.equal(page.includes('main.js'), false);
});

function ldBlocks(page) {
  return [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

test('sitemap lists the homepage and every post', () => {
  const xml = readFileSync(join(site, 'sitemap.xml'), 'utf8');
  assert.ok(xml.includes('<loc>https://treyyadon.space/</loc>'));
  for (const s of SLUGS) assert.ok(xml.includes(`https://treyyadon.space/notes/${s}/`), s);
  assert.equal(/server|docs|superpowers/.test(xml), false);
});

test('robots.txt points at the sitemap', () => {
  const txt = readFileSync(join(site, 'robots.txt'), 'utf8');
  assert.match(txt, /Sitemap: https:\/\/treyyadon\.space\/sitemap\.xml/);
});

test('homepage describes Trey as a Person linked to his profiles', () => {
  const page = readFileSync(join(site, 'index.html'), 'utf8');
  const person = ldBlocks(page).find((b) => b['@type'] === 'Person');
  assert.ok(person, 'Person block');
  assert.equal(person.name, 'Trey Yadon');
  assert.equal(person.url, 'https://treyyadon.space/');
  assert.ok(person.sameAs.includes('https://www.linkedin.com/in/ryadon'));
  assert.ok(person.sameAs.includes('https://github.com/tyadon'));
});

test('homepage title and share image', () => {
  const page = readFileSync(join(site, 'index.html'), 'utf8');
  assert.match(page, /<title>Trey Yadon \| Builder in San Diego<\/title>/);
  assert.match(page, /<meta property="og:image" content="https:\/\/treyyadon\.space\/assets\/img\/og\.png"/);
  assert.match(page, /name="twitter:card" content="summary_large_image"/);
  assert.ok(existsSync(join(site, 'assets/img/og.png')));
});

test('name and bio are visible text outside the fallback', () => {
  const page = readFileSync(join(site, 'index.html'), 'utf8');
  const desktop = page.slice(page.indexOf('<div id="desktop"'));
  assert.match(desktop, /<h1[^>]*>Trey Yadon<\/h1>/);
});
