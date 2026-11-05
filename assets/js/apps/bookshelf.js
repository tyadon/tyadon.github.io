import { html } from '../lib/html.js';

export function renderHTML(shelf) {
  const b = shelf.current;
  return html`<div class="pad shelf">
    <div class="book-spine" aria-hidden="true"><span>${b.title}</span></div>
    <div>
      <p class="meta">Currently reading</p>
      <h1>${b.title}</h1>
      <p>${b.author}</p>
    </div>
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.bookshelf);
}
