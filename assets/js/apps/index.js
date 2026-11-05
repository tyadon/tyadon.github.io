// App registry. Each app module exports render(body, ctx).

const mod = (path) => () => import(path);
const project = (id) => () => import('./project.js').then((m) => ({ render: (body, ctx) => m.render(body, ctx, id) }));

const placeholder = () => Promise.resolve({
  render(body) { body.innerHTML = '<p class="pad">This app is still being built.</p>'; },
});

export const APPS = [
  { id: 'readme', title: 'ReadMe', w: 460, h: 420, desktop: true, load: mod('./readme.js') },
  { id: 'whosgotit', title: "Who's Got It", w: 620, h: 560, desktop: true, load: project('whosgotit') },
  { id: 'pourmemory', title: 'Pour Memory', w: 620, h: 560, desktop: true, load: project('pourmemory') },
  { id: 'notes', title: 'Notes', w: 560, h: 520, desktop: true, load: placeholder },
  { id: 'darkroom', title: 'Darkroom', w: 640, h: 520, desktop: true, load: mod('./darkroom.js') },
  { id: 'archive', title: 'Archive', w: 440, h: 300, desktop: true, load: mod('./archive.js') },
  { id: 'cellar', title: 'Cellar', w: 560, h: 340, desktop: true, load: mod('./cellar.js') },
  { id: 'maps', title: 'Maps', w: 560, h: 520, desktop: true, load: mod('./maps.js') },
  { id: 'bookshelf', title: 'Bookshelf', w: 360, h: 260, desktop: true, load: mod('./bookshelf.js') },
  { id: 'garage', title: 'Garage', w: 380, h: 260, desktop: true, load: mod('./garage.js') },
  { id: 'newton', title: 'Newton.exe', w: 420, h: 540, desktop: true, load: mod('./newton.js') },
  { id: 'terminal', title: 'Terminal', w: 520, h: 340, desktop: true, load: mod('./terminal.js') },
  { id: 'guestbook', title: 'Guestbook', w: 480, h: 520, desktop: true, load: placeholder },
  { id: 'mail', title: 'Mail', w: 380, h: 260, desktop: true, load: mod('./mail.js') },
  { id: 'control', title: 'Control Panel', w: 400, h: 340, desktop: true, load: mod('./control.js') },
  { id: 'trash', title: 'Trash', w: 420, h: 300, desktop: true, load: mod('./trash.js') },
];

export const APP_IDS = APPS.map((a) => a.id);
export const getApp = (id) => APPS.find((a) => a.id === id);
