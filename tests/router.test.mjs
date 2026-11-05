import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, toHash } from '../assets/js/lib/router.js';

const ids = ['readme', 'darkroom', 'maps'];

test('parses a known app', () => {
  assert.deepEqual(parseHash('#/app/darkroom', ids), { app: 'darkroom' });
});

test('rejects unknown, malformed and empty hashes', () => {
  for (const h of ['#/app/nope', '#/app/<script>', '', '#', '#/darkroom', '#/app/', '#/app/darkroom/extra']) {
    assert.deepEqual(parseHash(h, ids), { app: null }, h);
  }
});

test('toHash', () => {
  assert.equal(toHash('maps'), '#/app/maps');
});
