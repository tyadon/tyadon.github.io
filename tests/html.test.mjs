import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, html, raw } from '../assets/js/lib/html.js';

test('esc neutralizes markup', () => {
  const out = esc('<img onerror=x>"&\'');
  for (const ch of ['<', '>', '"', "'"]) assert.equal(out.includes(ch), false, ch);
  assert.equal(out, '&lt;img onerror=x&gt;&quot;&amp;&#39;');
});

test('esc handles non-strings', () => {
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
  assert.equal(esc(42), '42');
});

test('html escapes interpolations', () => {
  const name = '<b>x</b>';
  assert.equal(String(html`<p>${name}</p>`), '<p>&lt;b&gt;x&lt;/b&gt;</p>');
});

test('html leaves raw() and arrays of html alone', () => {
  assert.equal(String(html`<div>${raw("<i>ok</i>")}</div>`), '<div><i>ok</i></div>');
  const items = ['a', '<b>'].map(s => html`<li>${s}</li>`);
  assert.equal(String(html`<ul>${items}</ul>`), '<ul><li>a</li><li>&lt;b&gt;</li></ul>');
});
