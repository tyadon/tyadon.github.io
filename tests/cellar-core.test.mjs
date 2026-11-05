import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bottleSVG } from '../assets/js/apps/cellar-core.js';

const base = { glass: '#2a0f0a', label: '#c0392b', accent: '#f4d03f' };

test('bottle is crisp pixel art with the label color', () => {
  const svg = bottleSVG({ ...base, motif: 'face' });
  assert.ok(svg.includes('crispEdges'));
  assert.ok(svg.includes('#c0392b'));
  assert.ok(svg.includes('#2a0f0a'));
});

test('different motifs draw differently', () => {
  const motifs = ['face', 'script', 'square', 'flowers', 'lines', 'diamonds', 'letters'];
  const out = new Set(motifs.map((motif) => bottleSVG({ ...base, motif })));
  assert.equal(out.size, motifs.length);
});

test('unknown motif falls back to a plain label', () => {
  const svg = bottleSVG({ ...base, motif: 'banana' });
  assert.ok(svg.includes('#c0392b'));
  assert.equal(svg.includes('#f4d03f'), false);
});

test('colors are sanitized', () => {
  const svg = bottleSVG({ glass: '"/><script>', label: '#fff', accent: '#000', motif: 'square' });
  assert.equal(svg.includes('<script>'), false);
});
