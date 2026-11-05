import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { validateEntry, shouldCountHit, fetchEntries, getHits, signEntry, loadEntries } from '../assets/js/services/guestbook.js';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

const ok = { name: 'Sam', message: 'Love the dog.', website: '', hp: '' };

test('validateEntry accepts a normal entry', () => {
  assert.deepEqual(validateEntry(ok), { ok: true });
  assert.equal(validateEntry({ ...ok, website: 'https://example.com' }).ok, true);
});

test('validateEntry rejects bad input', () => {
  const bad = [
    { ...ok, name: '' },
    { ...ok, name: '   ' },
    { ...ok, name: 'x'.repeat(41) },
    { ...ok, message: '' },
    { ...ok, message: 'x'.repeat(501) },
    { ...ok, hp: 'i am a bot' },
    { ...ok, website: 'javascript:alert(1)' },
  ];
  for (const e of bad) assert.equal(validateEntry(e).ok, false, JSON.stringify(e).slice(0, 60));
  assert.match(validateEntry({ ...ok, name: '' }).error, /name/i);
});

test('shouldCountHit counts once per session', () => {
  const m = new Map();
  const s = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
  assert.equal(shouldCountHit(s), true);
  assert.equal(shouldCountHit(s), false);
});

test('shouldCountHit is false when storage throws', () => {
  const s = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  assert.equal(shouldCountHit(s), false);
});

test('fetchEntries resolves [] when the network fails', async () => {
  globalThis.fetch = () => Promise.reject(new Error('offline'));
  assert.deepEqual(await fetchEntries(), []);
});

test('getHits resolves null on a 503', async () => {
  globalThis.fetch = () => Promise.resolve(new Response('down', { status: 503 }));
  assert.equal(await getHits(), null);
});

test('signEntry surfaces the server error message', async () => {
  globalThis.fetch = () => Promise.resolve(new Response(JSON.stringify({ message: 'slow down: try again later' }), { status: 400 }));
  const r = await signEntry(ok);
  assert.equal(r.ok, false);
  assert.match(r.error, /slow down/);
});

test('loadEntries tells offline apart from empty', async () => {
  globalThis.fetch = () => Promise.reject(new Error('offline'));
  assert.deepEqual(await loadEntries(), { ok: false, entries: [] });
  globalThis.fetch = () => Promise.resolve(new Response('{"entries":[]}', { status: 200 }));
  assert.deepEqual(await loadEntries(), { ok: true, entries: [] });
});

test('hits use the API shape', async () => {
  const calls = [];
  globalThis.fetch = (url, opts = {}) => { calls.push([url, opts.method || 'GET']); return Promise.resolve(new Response('{"count":42}', { status: 200 })); };
  const { recordHit } = await import('../assets/js/services/guestbook.js');
  assert.equal(await getHits(), 42);
  assert.equal(await recordHit(), 42);
  assert.deepEqual(calls.map((c) => c[1]), ['GET', 'POST']);
  assert.ok(calls.every((c) => c[0].endsWith('/api/hits')));
});
