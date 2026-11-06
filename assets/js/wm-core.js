// Pure window-placement helpers. No DOM access, so they run under node --test.

const HANDLE = 80; // px of title bar that must stay on screen
const TITLE_H = 24;

// Right-hand strip where the desktop icons live (two 96px columns plus gaps and margin).
export const ICON_GUTTER = 232;
const GRID = 24;
const MARGIN = 16;
const TOP = 40;

// Picks a spot for a new window: anywhere in the free desktop area that overlaps the
// open windows least, preferring edges and corners. Ties are broken by rand(), so windows
// land in different places instead of stacking.
export function placeWindow(size, viewport, existing = [], rand = Math.random) {
  const xMax = Math.max(MARGIN, viewport.w - ICON_GUTTER - size.w);
  const yMax = Math.max(TOP, viewport.h - size.h - MARGIN);
  if (viewport.w - ICON_GUTTER - size.w < MARGIN) {
    return { x: Math.max(0, Math.min(MARGIN, viewport.w - size.w)), y: TOP };
  }
  let best = Infinity;
  let picks = [];
  for (let y = TOP; y <= yMax; y += GRID) {
    for (let x = MARGIN; x <= xMax; x += GRID) {
      let cost = 0;
      for (const r of existing) {
        const ox = Math.max(0, Math.min(x + size.w, r.x + r.w) - Math.max(x, r.x));
        const oy = Math.max(0, Math.min(y + size.h, r.y + r.h) - Math.max(y, r.y));
        cost += ox * oy;
      }
      if (cost < best) { best = cost; picks = [{ x, y }]; } else if (cost === best) picks.push({ x, y });
    }
  }
  // Among the least-overlapping spots, favor ones hugging an edge or corner of the free area,
  // which leaves the middle open for the next window.
  const edge = (p) => Math.min(p.x - MARGIN, xMax - p.x) + Math.min(p.y - TOP, yMax - p.y);
  const tightest = Math.min(...picks.map(edge));
  const near = picks.filter((p) => edge(p) <= tightest + GRID * 2);
  return near[Math.min(near.length - 1, Math.floor(rand() * near.length))];
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
