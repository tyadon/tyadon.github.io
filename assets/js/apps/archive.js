import { html } from '../lib/html.js';
import { ICONS } from '../icons.js';
import { raw } from '../lib/html.js';

export function renderHTML(entries) {
  return html`<div class="folder pad">
    ${entries.map((e) => html`<button type="button" class="folder-item" data-entry="${e.id}">
      <span class="icon-art">${raw(ICONS.readme)}</span><span class="icon-label">${e.name}</span>
    </button>`)}
  </div>`;
}

export function renderEntry(e) {
  return html`<article class="card pad">
    <h1>${e.name}</h1>
    <p class="meta">${e.years}</p>
    ${e.lines.map((l) => html`<p>${l}</p>`)}
  </article>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.archive);
  body.querySelectorAll('.folder-item').forEach((btn) => btn.addEventListener('click', () => {
    const e = ctx.content.archive.find((a) => a.id === btn.dataset.entry);
    ctx.wm.open(`archive-${e.id}`, { title: e.name, w: 400, h: 320, render: (b) => { b.innerHTML = renderEntry(e); } });
  }));
}
