import { html, raw } from '../lib/html.js';
import { bottleSVG } from './cellar-core.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(d) {
  const [y, m, day] = d.split('-').map(Number);
  return day ? `${MONTHS[m - 1]} ${day}, ${y}` : `${MONTHS[m - 1]} ${y}`;
}

export function renderHTML(wines) {
  return html`<div class="pad cellar">
    <p class="hint">The last ${wines.length} bottles I logged in Pour Memory. Pick one.</p>
    <div class="rack">${wines.map((w, i) => html`<button type="button" class="bottle" data-i="${i}" aria-label="${w.name}">${raw(bottleSVG(w.bottle))}</button>`)}</div>
    <p class="cellar-detail" aria-live="polite"></p>
  </div>`;
}

export function render(body, ctx) {
  const wines = ctx.content.cellar;
  body.innerHTML = renderHTML(wines);
  const detail = body.querySelector('.cellar-detail');
  const pick = (btn) => {
    const w = wines[Number(btn.dataset.i)];
    body.querySelectorAll('.bottle').forEach((b) => b.classList.toggle('is-picked', b === btn));
    detail.innerHTML = html`<strong>${w.name}</strong><br>${w.place}, ${formatDate(w.date)}`;
  };
  body.querySelectorAll('.bottle').forEach((b) => {
    b.addEventListener('click', () => pick(b));
    b.addEventListener('focus', () => pick(b));
    b.addEventListener('mouseenter', () => pick(b));
  });
  pick(body.querySelector('.bottle'));
}
