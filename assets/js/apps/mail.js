import { html } from '../lib/html.js';

export function renderHTML(mail) {
  return html`<div class="pad mail">
    <p>The fastest way to reach me:</p>
    <p><a class="btn" href="mailto:${mail.email}">${mail.email}</a></p>
    <p>Or find me here: ${mail.links.map((l, i) => html`${i ? ', ' : ''}<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)}</p>
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.mail);
}
