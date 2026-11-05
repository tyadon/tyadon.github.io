// Pure window-placement helpers. No DOM access, so they run under node --test.

const START = { x: 120, y: 48 };
const STEP = 24;
const DEFAULT = { w: 480, h: 360 };
const HANDLE = 80; // px of title bar that must stay on screen
const TITLE_H = 24;

export function cascade(index, viewport) {
  let x = START.x + index * STEP;
  let y = START.y + index * STEP;
  if (x + DEFAULT.w > viewport.w || y + DEFAULT.h > viewport.h) return { ...START };
  return { x, y };
}

export function clampToViewport(rect, viewport, menubar = 28) {
  const x = Math.min(Math.max(rect.x, HANDLE - rect.w), viewport.w - HANDLE);
  const y = Math.min(Math.max(rect.y, menubar), viewport.h - TITLE_H);
  return { x, y };
}

// Esc closes the focused window unless the visitor is typing or a menu is open.
export function escClosesWindow({ tag, menuOpen }) {
  return !menuOpen && tag !== 'INPUT' && tag !== 'TEXTAREA';
}

export function isMobile(width) {
  return width < 700;
}
