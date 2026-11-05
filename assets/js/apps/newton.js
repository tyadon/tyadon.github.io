import { html } from '../lib/html.js';

export function renderHTML(newton) {
  return html`<div class="newton-app">
    <button type="button" class="newton-photo develop" aria-label="Develop Newton's photo"><img src="${newton.photo}" alt="Newton, a white Samoyed mix, wearing ski goggles in the snow"></button>
    <div class="pad">
      <h1>Newton</h1>
      ${newton.facts.map((f) => html`<p>${f}</p>`)}
    </div>
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.newton);
  const photo = body.querySelector('.newton-photo');
  photo.addEventListener('click', () => photo.classList.toggle('is-developed'));
  setTimeout(() => photo.classList.add('is-developed'), 400);
}
