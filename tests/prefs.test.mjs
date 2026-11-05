import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrefs } from '../assets/js/lib/prefs.js';

const mapStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};

test('round-trips values', () => {
  const { getPref, setPref } = createPrefs(mapStorage());
  assert.equal(getPref('crt', false), false);
  setPref('crt', true);
  setPref('pattern', 'dots');
  assert.equal(getPref('crt', false), true);
  assert.equal(getPref('pattern', 'dither'), 'dots');
});

test('throwing storage falls back silently', () => {
  const bad = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const { getPref, setPref } = createPrefs(bad);
  assert.doesNotThrow(() => setPref('crt', true));
  assert.equal(getPref('crt', false), false);
});

test('corrupt stored value falls back', () => {
  const s = mapStorage();
  s.setItem('treyos.crt', '{not json');
  assert.equal(createPrefs(s).getPref('crt', false), false);
});
