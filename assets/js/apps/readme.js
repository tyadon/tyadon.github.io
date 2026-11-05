import { html } from '../lib/html.js';

export function renderHTML(readme) {
  return html`<article class="readme pad">
    <h1 class="display">${readme.title}</h1>
    ${readme.paragraphs.map((p) => html`<p>${p}</p>`)}
  </article>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.readme);
}
