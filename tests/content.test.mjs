import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readJSON } from './helpers.mjs';

const content = readJSON('_data/content.json');
const KEYS = ['site', 'readme', 'projects', 'archive', 'trash', 'darkroom', 'cellar', 'maps', 'bookshelf', 'garage', 'newton', 'mail'];

function urls(node, out = []) {
  if (Array.isArray(node)) node.forEach(n => urls(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'url' && typeof v === 'string') out.push(v);
      else urls(v, out);
    }
  }
  return out;
}

test('has every top-level key', () => {
  for (const k of KEYS) assert.ok(k in content, `missing ${k}`);
});

test('no em-dashes', () => {
  assert.equal(JSON.stringify(content).includes('—'), false);
});

test('no forbidden terms', () => {
  const text = JSON.stringify(content).toLowerCase();
  assert.equal(/\bintern(ship)?s?\b/.test(text), false, 'found an internship');
  for (const term of ['openai', 'schyler', 'jpmorgan', 'ge aviation', 'betting', 'patty', 'bean and tres', 'years old']) {
    assert.equal(text.includes(term), false, `found "${term}"`);
  }
});

test('links are https', () => {
  for (const u of urls(content)) assert.match(u, /^https:\/\//, u);
  assert.equal(content.mail.email, 'itstreyyadon@gmail.com');
});

test('cellar is the seven wines in order', () => {
  assert.deepEqual(content.cellar.map(w => w.name), [
    'Donnafugata Sedàra', 'La Vela Bolina', 'Antek', 'Camarda Nerello Mascalese',
    'Pitanga', 'Le Fontane Cerasuolo di Vittoria Classico', 'Kaid Syrah',
  ]);
  const motifs = ['face', 'script', 'square', 'flowers', 'lines', 'diamonds', 'letters'];
  for (const w of content.cellar) assert.ok(motifs.includes(w.bottle.motif), w.name);
});

test('maps has the eight spots', () => {
  assert.equal(content.maps.length, 8);
  for (const m of content.maps) {
    assert.equal(typeof m.x, 'number'); assert.equal(typeof m.y, 'number');
    assert.ok(m.x >= 0 && m.x <= 100 && m.y >= 0 && m.y <= 100, m.name);
  }
});

test('projects', () => {
  const by = Object.fromEntries(content.projects.map(p => [p.id, p]));
  assert.equal(by.whosgotit.role, 'Solo founder');
  const w = by.whosgotit.links.map(l => l.url);
  assert.ok(w.includes('https://apps.apple.com/us/app/whos-got-it/id6775676276'));
  assert.ok(w.includes('https://whosgotit.app'));
  assert.equal(by.pourmemory.role, 'Co-founder & CTO');
  assert.ok(by.pourmemory.links.map(l => l.url).includes('https://pourmemory.com'));
});

test('readme instructions work on phones too', () => {
  assert.match(content.readme.paragraphs.join(' '), /tap/i);
});
