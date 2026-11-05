import { html } from '../lib/html.js';

export function renderHTML(spots) {
  return html`<div class="maps">
    <div class="map">
      <img src="/assets/img/ui/sd-map.svg" alt="Map of San Diego">
      ${spots.map((s, i) => html`<button type="button" class="pin" data-i="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="${s.name}, ${s.area}"></button>`)}
    </div>
    <div class="pad">
      <p class="hint">Where I eat in San Diego.</p>
      <ol class="spots">${spots.map((s, i) => html`<li><button type="button" data-i="${i}">${s.name}</button> <span class="meta">${s.area}</span></li>`)}</ol>
    </div>
  </div>`;
}

export function render(body, ctx) {
  body.innerHTML = renderHTML(ctx.content.maps);
  const select = (i) => body.querySelectorAll('[data-i]').forEach((el) => el.classList.toggle('is-picked', el.dataset.i === String(i)));
  body.querySelectorAll('[data-i]').forEach((el) => {
    el.addEventListener('click', () => select(el.dataset.i));
    el.addEventListener('mouseenter', () => select(el.dataset.i));
  });
}
