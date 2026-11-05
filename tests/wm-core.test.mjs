import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cascade, clampToViewport, isMobile } from '../assets/js/wm-core.js';

test('cascade steps 24px from 120,48', () => {
  const vp = { w: 1440, h: 900 };
  assert.deepEqual(cascade(0, vp), { x: 120, y: 48 });
  assert.deepEqual(cascade(1, vp), { x: 144, y: 72 });
  assert.deepEqual(cascade(2, vp), { x: 168, y: 96 });
});

test('cascade wraps when a 480x360 window would overflow', () => {
  const vp = { w: 800, h: 600 };
  // y + 360 > 600 once y > 240, i.e. index 9 (48 + 9*24 = 264)
  assert.deepEqual(cascade(9, vp), { x: 120, y: 48 });
});

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
