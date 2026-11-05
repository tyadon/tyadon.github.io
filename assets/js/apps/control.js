import { html } from '../lib/html.js';
import { getPref, setPref } from '../lib/prefs.js';

const PATTERNS = [['dither', 'Dither'], ['dots', 'Dots'], ['grid', 'Graph paper'], ['plain', 'Plain']];

export const DEFAULTS = { pattern: 'dither', color: false, crt: false, sound: false };

export function applyPrefs(root = document.documentElement) {
  for (const k of Object.keys(DEFAULTS)) root.dataset[k] = String(getPref(k, DEFAULTS[k]));
}

export function render(body) {
  const cur = Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, getPref(k, DEFAULTS[k])]));
  body.innerHTML = html`<form class="pad control">
    <fieldset><legend>Desktop pattern</legend>
      ${PATTERNS.map(([v, l]) => html`<label><input type="radio" name="pattern" value="${v}" ${cur.pattern === v ? 'checked' : ''}> ${l}</label>`)}
    </fieldset>
    <fieldset><legend>Display</legend>
      <label><input type="checkbox" name="color" ${cur.color ? 'checked' : ''}> Color (skip the 1-bit look)</label>
      <label><input type="checkbox" name="crt" ${cur.crt ? 'checked' : ''}> CRT scanlines</label>
      <label><input type="checkbox" name="sound" ${cur.sound ? 'checked' : ''}> Sound</label>
    </fieldset>
  </form>`;
  body.querySelector('form').addEventListener('change', (e) => {
    const el = e.target;
    setPref(el.name, el.type === 'checkbox' ? el.checked : el.value);
    applyPrefs();
  });
}
