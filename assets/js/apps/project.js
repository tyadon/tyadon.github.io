import { html } from '../lib/html.js';

export function renderHTML(p) {
  return html`<article class="project" style="--brand:${p.color}">
    <header class="project-head">
      <img class="project-icon" src="${p.icon}" alt="" width="56" height="56">
      <div>
        <h1>${p.name}</h1>
        <p class="project-role">${p.role}, ${p.years}</p>
      </div>
    </header>
    <div class="pad project-body">
      <p class="project-pitch">${p.pitch}</p>
      ${p.note ? html`<p>${p.note}</p>` : ''}
      <h2>How it works</h2>
      <ol class="project-how">${p.how.map((s) => html`<li>${s}</li>`)}</ol>
      <ul class="chips" aria-label="Built with">${p.stack.map((s) => html`<li>${s}</li>`)}</ul>
      <p class="project-links">${p.links.map((l) => html`<a class="btn" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)}</p>
      <h2>Screens</h2>
      <p class="hint">Hover or tap a screen to develop it.</p>
      <div class="shots">${p.shots.map((s, i) => html`<button type="button" class="shot develop" aria-label="Screen ${i + 1}"><img src="${s}" alt="" loading="lazy"></button>`)}</div>
    </div>
  </article>`;
}

export function render(body, ctx, id) {
  body.innerHTML = renderHTML(ctx.content.projects.find((p) => p.id === id));
  body.querySelectorAll('.develop').forEach((b) => b.addEventListener('click', () => b.classList.toggle('is-developed')));
}
