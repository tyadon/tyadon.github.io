import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readJSON, ROOT } from './helpers.mjs';

const content = readJSON('_data/content.json');

function referenced() {
  const out = [];
  for (const p of content.projects) out.push(p.icon, ...p.shots);
  for (const d of content.darkroom) out.push(d.file, d.thumb);
  out.push(content.newton.photo);
  return out;
}

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

test('every image referenced in content.json exists', () => {
  const refs = referenced();
  assert.ok(refs.length > 0);
  for (const r of refs) {
    assert.ok(r && r.startsWith('/assets/img/'), `bad path ${r}`);
    assert.ok(existsSync(join(ROOT, r)), `missing ${r}`);
  }
});

test('no published jpg contains EXIF', () => {
  const jpgs = walk(join(ROOT, 'assets/img')).filter(f => /\.jpe?g$/i.test(f));
  assert.ok(jpgs.length > 0);
  for (const f of jpgs) {
    const head = readFileSync(f).subarray(0, 65536);
    assert.equal(head.includes(Buffer.from('Exif\0\0')), false, f);
  }
});

test('darkroom has 24 entries each with a city', () => {
  assert.equal(content.darkroom.length, 24);
  for (const d of content.darkroom) assert.ok(d.city && d.city.length > 1, d.file);
});
