import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corsHeaders, clientIp, json } from '../server/lib/http.js';

test('cors allows the site, the github.io domain and local preview only', () => {
  for (const o of ['https://treyyadon.space', 'https://www.treyyadon.space', 'https://tyadon.github.io', 'http://localhost:4000']) {
    assert.equal(corsHeaders(o)['Access-Control-Allow-Origin'], o, o);
  }
  assert.equal(corsHeaders('https://evil.example')['Access-Control-Allow-Origin'], undefined);
  assert.equal(corsHeaders(null)['Access-Control-Allow-Origin'], undefined);
});

test('clientIp takes the first forwarded address', () => {
  assert.equal(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' })), '1.2.3.4');
  assert.equal(clientIp(new Headers({ 'x-real-ip': '5.6.7.8' })), '5.6.7.8');
  assert.equal(clientIp(new Headers()), 'unknown');
});

test('json sets status, content type and cors', async () => {
  const res = json({ ok: 1 }, 201, 'https://treyyadon.space');
  assert.equal(res.status, 201);
  assert.equal(res.headers.get('content-type'), 'application/json');
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://treyyadon.space');
  assert.deepEqual(await res.json(), { ok: 1 });
});
