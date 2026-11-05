// Pixel-art wine bottles on a 16x48 grid, loosely based on each real label.

const color = (c) => (/^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#000');
const px = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

// Label occupies x 3..12, y 24..37. Each motif draws inside it.
const MOTIFS = {
  face: (a) => px(6, 26, 4, 1, a) + px(5, 27, 6, 7, a) + px(6, 34, 4, 1, a) + px(6, 29, 1, 1, '#000') + px(9, 29, 1, 1, '#000') + px(7, 32, 2, 1, '#000'),
  script: (a) => px(4, 30, 2, 1, a) + px(6, 29, 2, 1, a) + px(8, 30, 2, 1, a) + px(10, 29, 2, 1, a) + px(5, 33, 6, 1, a),
  square: (a) => px(6, 28, 4, 4, a),
  flowers: (a) => [[5, 27], [9, 29], [6, 32], [10, 34]].map(([x, y]) => px(x, y - 1, 1, 3, a) + px(x - 1, y, 3, 1, a)).join(''),
  lines: (a) => [0, 1, 2, 3, 4, 5].map((i) => px(4 + i, 27 + i * 2, 2, 1, a)).join('') + px(10, 27, 1, 9, a),
  diamonds: (a) => [[5, 29], [8, 31], [11, 29]].map(([x, y]) => px(x, y - 1, 1, 1, a) + px(x - 1, y, 3, 1, a) + px(x, y + 1, 1, 1, a)).join(''),
  letters: (a) => px(4, 29, 1, 4, a) + px(5, 30, 1, 1, a) + px(6, 29, 1, 4, a) + px(8, 29, 2, 4, a) + px(11, 29, 1, 4, a),
};

export function bottleSVG(bottle) {
  const glass = color(bottle.glass);
  const label = color(bottle.label);
  const accent = color(bottle.accent);
  const motif = MOTIFS[bottle.motif];
  return `<svg viewBox="0 0 16 48" width="64" height="192" shape-rendering="crispEdges" aria-hidden="true">`
    + `<path d="M6 0h4v14l3 4v29H3V18l3-4z" fill="${glass}" stroke="#000" stroke-width="1"/>`
    + px(6, 0, 4, 4, '#000')
    + px(4, 19, 1, 26, 'rgba(255,255,255,0.25)')
    + px(3, 24, 10, 14, label)
    + (motif ? motif(accent) : '')
    + '</svg>';
}
