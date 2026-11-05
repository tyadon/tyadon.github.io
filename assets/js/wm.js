// Window manager: one window per app id, drag by title bar, Esc to close.
import { cascade, clampToViewport, isMobile } from './wm-core.js';

export function createWM(root) {
  const wins = new Map(); // appId -> { el, returnFocus }
  let z = 10;
  let opened = 0;

  const viewport = () => ({ w: window.innerWidth, h: window.innerHeight });

  function focus(appId) {
    const w = wins.get(appId);
    if (!w) return;
    for (const other of wins.values()) other.el.classList.remove('is-focused');
    w.el.style.zIndex = String(++z);
    w.el.classList.add('is-focused');
  }

  function close(appId) {
    const w = wins.get(appId);
    if (!w) return;
    w.el.remove();
    wins.delete(appId);
    root.dispatchEvent(new CustomEvent('wm:close', { detail: { appId } }));
    if (w.returnFocus && document.contains(w.returnFocus)) w.returnFocus.focus();
    const top = [...wins.entries()].sort((a, b) => b[1].el.style.zIndex - a[1].el.style.zIndex)[0];
    if (top) focus(top[0]);
  }

  function enableDrag(el, handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (isMobile(window.innerWidth) || e.target.closest('button')) return;
      const start = { px: e.clientX, py: e.clientY, x: el.offsetLeft, y: el.offsetTop };
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const pos = clampToViewport(
          { x: start.x + ev.clientX - start.px, y: start.y + ev.clientY - start.py, w: el.offsetWidth, h: el.offsetHeight },
          viewport(),
        );
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }

  function open(appId, opts) {
    if (wins.has(appId)) {
      focus(appId);
      return wins.get(appId).el;
    }
    const { title, w = 480, h = 360, render } = opts;
    const el = document.createElement('section');
    const titleId = `win-title-${appId}`;
    el.className = 'win';
    el.dataset.app = appId;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', titleId);
    el.tabIndex = -1;
    el.innerHTML = `
      <header class="tbar">
        <button class="tbar-close" type="button" aria-label="Close"></button>
        <h2 class="tbar-title" id="${titleId}"></h2>
      </header>
      <div class="wbody"></div>`;
    el.querySelector('.tbar-title').textContent = title;

    if (isMobile(window.innerWidth)) {
      el.classList.add('is-full');
    } else {
      const vp = viewport();
      const width = Math.min(w, vp.w - 32);
      const pos = clampToViewport({ ...cascade(opened, vp), w: width, h }, vp);
      Object.assign(el.style, { left: `${pos.x}px`, top: `${pos.y}px`, width: `${width}px`, height: `${Math.min(h, vp.h - 60)}px` });
    }
    opened += 1;

    el.querySelector('.tbar-close').addEventListener('click', () => close(appId));
    el.addEventListener('pointerdown', () => focus(appId));
    enableDrag(el, el.querySelector('.tbar'));

    wins.set(appId, { el, returnFocus: document.activeElement });
    root.appendChild(el);
    focus(appId);
    el.focus({ preventScroll: true });
    if (render) render(el.querySelector('.wbody'));
    root.dispatchEvent(new CustomEvent('wm:open', { detail: { appId } }));
    return el;
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const focused = [...wins.entries()].find(([, w]) => w.el.classList.contains('is-focused'));
    if (focused) close(focused[0]);
  });

  return { open, close, focus, isOpen: (appId) => wins.has(appId) };
}
