import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampToViewport, isMobile, escClosesWindow, placeWindow, ICON_GUTTER } from '../assets/js/wm-core.js';

test('clampToViewport keeps the title bar reachable', () => {
  assert.deepEqual(clampToViewport({ x: -500, y: -50, w: 400, h: 300 }, { w: 1280, h: 800 }), { x: -320, y: 28 });
  assert.deepEqual(clampToViewport({ x: 5000, y: 5000, w: 400, h: 300 }, { w: 1280, h: 800 }), { x: 1200, y: 776 });
  assert.deepEqual(clampToViewport({ x: 200, y: 100, w: 400, h: 300 }, { w: 1280, h: 800 }), { x: 200, y: 100 });
});

test('isMobile below 700px', () => {
  assert.equal(isMobile(375), true);
  assert.equal(isMobile(699), true);
  assert.equal(isMobile(1024), false);
});

test('Esc does not close a window while typing or while a menu is open', () => {
  assert.equal(escClosesWindow({ tag: 'BODY', menuOpen: false }), true);
  assert.equal(escClosesWindow({ tag: 'SECTION', menuOpen: false }), true);
  assert.equal(escClosesWindow({ tag: 'TEXTAREA', menuOpen: false }), false);
  assert.equal(escClosesWindow({ tag: 'INPUT', menuOpen: false }), false);
  assert.equal(escClosesWindow({ tag: 'BODY', menuOpen: true }), false);
});

const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const fixedRand = () => 0.5;

test('placeWindow keeps windows off the icon columns and under the menubar', () => {
  const vp = { w: 1440, h: 900 };
  const p = placeWindow({ w: 480, h: 360 }, vp, [], fixedRand);
  assert.ok(p.x >= 0 && p.x + 480 <= vp.w - ICON_GUTTER, JSON.stringify(p));
  assert.ok(p.y >= 28 && p.y + 360 <= vp.h, JSON.stringify(p));
});

test('placeWindow spreads windows out instead of stacking them', () => {
  const vp = { w: 1440, h: 900 };
  const placed = [];
  for (let i = 0; i < 3; i++) {
    const size = { w: 420, h: 360 };
    const p = placeWindow(size, vp, placed, fixedRand);
    placed.push({ ...p, ...size });
  }
  for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
    assert.equal(overlap(placed[i], placed[j]), 0, `windows ${i} and ${j} overlap`);
  }
});

test('placeWindow varies with randomness when there is room', () => {
  const vp = { w: 1440, h: 900 };
  const a = placeWindow({ w: 400, h: 300 }, vp, [], () => 0);
  const b = placeWindow({ w: 400, h: 300 }, vp, [], () => 0.99);
  assert.notDeepEqual(a, b);
});

test('placeWindow still fits a window bigger than the free area', () => {
  const vp = { w: 800, h: 600 };
  const p = placeWindow({ w: 700, h: 700 }, vp, [], fixedRand);
  assert.ok(p.x >= 0 && p.y >= 28, JSON.stringify(p));
});
