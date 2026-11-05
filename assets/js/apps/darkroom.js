import { html } from '../lib/html.js';

export function renderGrid(photos) {
  return html`<div class="pad">
    <p class="hint">${photos.length} prints from Europe. Open one to develop it.</p>
    <div class="contact-sheet">${photos.map((p, i) => html`<button type="button" class="print develop" data-i="${i}" aria-label="Photo ${i + 1}, ${p.city}"><img src="${p.thumb}" alt="" loading="lazy"></button>`)}</div>
  </div>`;
}

function renderViewer(photos, i) {
  const p = photos[i];
  return html`<figure class="viewer">
    <div class="viewer-frame develop"><img src="${p.file}" alt="Photo taken in ${p.city}"></div>
    <figcaption>
      <button type="button" class="btn" data-step="-1" aria-label="Previous photo">Prev</button>
      <span>${p.city}, ${i + 1} of ${photos.length}</span>
      <button type="button" class="btn" data-step="1" aria-label="Next photo">Next</button>
    </figcaption>
  </figure>`;
}

function openViewer(ctx, start) {
  const photos = ctx.content.darkroom;
  let i = start;
  ctx.wm.close('darkroom-view');
  ctx.wm.open('darkroom-view', {
    title: 'Print', w: 640, h: 560,
    render(body) {
      const show = () => {
        body.innerHTML = renderViewer(photos, i);
        const frame = body.querySelector('.viewer-frame');
        const img = frame.querySelector('img');
        const develop = () => requestAnimationFrame(() => frame.classList.add('is-developed'));
        if (img.complete) develop(); else img.addEventListener('load', develop, { once: true });
        body.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => step(Number(b.dataset.step))));
      };
      const step = (d) => { i = (i + d + photos.length) % photos.length; show(); };
      const win = body.closest('.win');
      win.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      });
      let x0 = null;
      body.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
      body.addEventListener('pointerup', (e) => {
        if (x0 !== null && Math.abs(e.clientX - x0) > 50) step(e.clientX < x0 ? 1 : -1);
        x0 = null;
      });
      show();
    },
  });
}

export function render(body, ctx) {
  body.innerHTML = renderGrid(ctx.content.darkroom);
  body.querySelectorAll('.print').forEach((b) => b.addEventListener('click', () => openViewer(ctx, Number(b.dataset.i))));
}
