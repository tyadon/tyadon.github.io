// Newton walks along the bottom of the desktop in stepped, pixel-sized moves.

const frame = (legs) => `<svg viewBox="0 0 20 14" width="60" height="42" shape-rendering="crispEdges" aria-hidden="true">
  <path d="M3 4h11v6H3z M14 2h4v5h-4z M1 3h2v3H1z" fill="#fff" stroke="#000" stroke-width="0.8"/>
  <rect x="14" y="3" width="4" height="1.4" fill="#000"/>
  <rect x="18" y="5" width="1" height="1" fill="#000"/>
  ${legs}
</svg>`;
const A = frame('<rect x="4" y="10" width="1.5" height="3" fill="#000"/><rect x="8" y="10" width="1.5" height="3" fill="#000"/><rect x="12" y="10" width="1.5" height="3" fill="#000"/>');
const B = frame('<rect x="5" y="10" width="1.5" height="3" fill="#000"/><rect x="9" y="10" width="1.5" height="3" fill="#000"/><rect x="11" y="10" width="1.5" height="3" fill="#000"/>');

export function startPet(layer, { onClick, still = false }) {
  const pet = document.createElement('button');
  pet.type = 'button';
  pet.className = 'pet';
  pet.setAttribute('aria-label', 'Newton. Open Newton.exe');
  pet.innerHTML = A;
  pet.addEventListener('click', onClick);
  layer.appendChild(pet);

  let x = 24;
  let dir = 1;
  let pauseUntil = 0;
  let step = 0;
  const place = () => { pet.style.transform = `translateX(${x}px) scaleX(${dir})`; };
  place();
  if (still) return;

  setInterval(() => {
    const now = Date.now();
    if (now < pauseUntil) { pet.innerHTML = A; return; }
    const max = layer.clientWidth - 64;
    x += 6 * dir;
    if (x >= max || x <= 8) dir *= -1;
    x = Math.max(8, Math.min(x, max));
    step += 1;
    pet.innerHTML = step % 2 ? A : B;
    place();
    if (Math.random() < 0.02) pauseUntil = now + 2000 + Math.random() * 3000;
  }, 140);
}
