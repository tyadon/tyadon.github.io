import { html } from '../lib/html.js';

export function renderHTML(items) {
  return html`<div class="pad trash">
    <p class="meta">${items.length} items. Nothing here gets deleted.</p>
    ${items.map((t) => html`<section class="trash-item"><h2>${t.name}</h2>${t.lines.map((l) => html`<p>${l}</p>`)}</section>`)}
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.trash);
}
