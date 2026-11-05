import { html, raw } from '../lib/html.js';
import { ICONS } from '../icons.js';

export function renderHTML(garage) {
  return html`<div class="pad garage">
    <div class="garage-art" aria-hidden="true">${raw(ICONS.garage)}</div>
    <h1>${garage.bike}</h1>
    ${garage.lines.map((l) => html`<p>${l}</p>`)}
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.garage);
}
