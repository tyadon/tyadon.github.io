// 1-bit desktop icons, drawn on a 32x32 grid. Black ink on white paper.

const svg = (body) =>
  `<svg viewBox="0 0 32 32" width="32" height="32" shape-rendering="crispEdges" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  readme: svg('<path d="M7 3h13l6 6v20H7z" fill="#fff"/><path d="M20 3v6h6"/><path d="M11 14h11M11 18h11M11 22h8"/>'),
  archive: svg('<path d="M3 8h10l3 3h13v16H3z" fill="#fff"/><path d="M3 14h26"/>'),
  darkroom: svg('<path d="M3 10h6l2-3h10l2 3h6v17H3z" fill="#fff"/><circle cx="16" cy="18" r="5"/><path d="M24 13h2"/>'),
  cellar: svg('<path d="M14 3h4v7l3 4v15H11V14l3-4z" fill="#fff"/><path d="M11 18h10v6H11z" fill="currentColor"/>'),
  maps: svg('<path d="M3 7l8-3 10 3 8-3v21l-8 3-10-3-8 3z" fill="#fff"/><path d="M11 4v21M21 7v21"/><circle cx="16" cy="14" r="2" fill="currentColor"/>'),
  bookshelf: svg('<path d="M5 6h5v22H5zM12 9h5v19h-5z" fill="#fff"/><path d="M19 8l5-1 4 20-5 1z" fill="currentColor"/><path d="M3 28h26"/>'),
  garage: svg('<circle cx="8" cy="22" r="5" fill="#fff"/><circle cx="24" cy="22" r="5" fill="#fff"/><path d="M8 22l5-8h8l3 8M13 14l-2-4h-3M19 14l2-4h4"/>'),
  notes: svg('<path d="M6 5h20v24H6z" fill="#fff"/><path d="M10 3v4M16 3v4M22 3v4M10 13h12M10 17h12M10 21h8"/>'),
  newton: svg('<path d="M7 6l4 5h10l4-5 1 9c1 7-4 12-10 12S5 22 6 15z" fill="#fff"/><path d="M12 17h1M19 17h1" stroke-width="3"/><path d="M15 21h2v1h-2z" fill="currentColor"/>'),
  terminal: svg('<path d="M3 5h26v22H3z" fill="#000"/><path d="M7 11l4 4-4 4M14 20h7" stroke="#fff"/>'),
  trash: svg('<path d="M8 9h16l-2 19H10z" fill="#fff"/><path d="M5 9h22M13 5h6v4M13 13v11M19 13v11"/>'),
  guestbook: svg('<path d="M4 7c4-2 8-2 12 1 4-3 8-3 12-1v19c-4-2-8-2-12 1-4-3-8-3-12-1z" fill="#fff"/><path d="M16 8v19"/>'),
  mail: svg('<path d="M3 8h26v17H3z" fill="#fff"/><path d="M3 8l13 10L29 8"/>'),
  control: svg('<path d="M4 4h24v24H4z" fill="#fff"/><path d="M10 8v16M16 8v16M22 8v16"/><path d="M8 18h4v3H8zM14 11h4v3h-4zM20 15h4v3h-4z" fill="currentColor"/>'),
};
