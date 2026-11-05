// TreyOS boot: builds the menubar and icons, wires the window manager and deep links.
import { createWM } from './wm.js';
import { isMobile } from './wm-core.js';
import { parseHash, toHash } from './lib/router.js';
import { ICONS } from './icons.js';
import { APPS, APP_IDS, getApp } from './apps/index.js';
import { applyPrefs } from './apps/control.js';
import { getPref } from './lib/prefs.js';
import { startPet } from './pet.js';

const content = JSON.parse(document.getElementById('treyos-data').textContent);
const desktop = document.getElementById('desktop');
const wm = createWM(desktop.querySelector('.windows'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

applyPrefs();
const ctx = { content, wm, openApp, prefs: { getPref } };

async function openApp(id) {
  const app = getApp(id);
  if (!app) return;
  if (wm.isOpen(id)) { wm.focus(id); return; }
  const mod = await app.load();
  wm.open(id, { title: app.title, w: app.w, h: app.h, render: (body) => mod.render(body, ctx) });
}

function iconFor(app) {
  const project = content.projects.find((p) => p.id === app.id);
  if (project) return `<img src="${project.icon}" alt="" width="32" height="32">`;
  return ICONS[app.id] || '';
}

function buildIcons() {
  const list = desktop.querySelector('.icons');
  let lastPointer = 'mouse';
  for (const app of APPS.filter((a) => a.desktop)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon';
    btn.setAttribute('role', 'listitem');
    btn.dataset.app = app.id;
    btn.innerHTML = `<span class="icon-art">${iconFor(app)}</span><span class="icon-label"></span>`;
    btn.querySelector('.icon-label').textContent = app.title;
    btn.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; });
    btn.addEventListener('click', (e) => {
      // Keyboard (detail 0), touch, and phones open on a single click; mouse selects first.
      if (e.detail === 0 || lastPointer === 'touch' || isMobile(window.innerWidth)) { openApp(app.id); return; }
      list.querySelectorAll('.icon').forEach((i) => i.classList.toggle('is-selected', i === btn));
    });
    btn.addEventListener('dblclick', () => openApp(app.id));
    list.appendChild(btn);
  }
  desktop.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.icon')) list.querySelectorAll('.is-selected').forEach((i) => i.classList.remove('is-selected'));
  });
}

function buildMenubar() {
  const bar = desktop.querySelector('.menubar');
  const menus = [
    { label: '✱', name: 'TreyOS', items: [['About TreyOS', () => openApp('readme')], ['Control Panel', () => openApp('control')], ['Restart', restart]] },
    { label: 'Apps', items: APPS.map((a) => [a.title, () => openApp(a.id)]) },
    { label: 'Special', items: [['Empty Trash', () => openApp('trash')], ['Sign Guestbook', () => openApp('guestbook')]] },
  ];
  bar.innerHTML = '<div class="menus"></div><div class="status"><span class="hits" id="hits" title="Visitors">------</span><span class="city"></span><time class="clock"></time></div>';
  bar.querySelector('.city').textContent = content.site.city;
  const holder = bar.querySelector('.menus');
  for (const m of menus) {
    const wrap = document.createElement('div');
    wrap.className = 'menu';
    wrap.innerHTML = `<button type="button" class="menu-title" aria-haspopup="true" aria-expanded="false"></button><div class="menu-items" role="menu" hidden></div>`;
    const title = wrap.querySelector('.menu-title');
    title.textContent = m.label;
    if (m.name) title.setAttribute('aria-label', m.name);
    const items = wrap.querySelector('.menu-items');
    for (const [label, fn] of m.items) {
      const it = document.createElement('button');
      it.type = 'button';
      it.setAttribute('role', 'menuitem');
      it.textContent = label;
      it.addEventListener('click', () => { closeMenus(); fn(); });
      items.appendChild(it);
    }
    title.addEventListener('click', () => {
      const open = items.hidden;
      closeMenus();
      items.hidden = !open;
      title.setAttribute('aria-expanded', String(open));
      if (open) items.querySelector('button')?.focus();
    });
    holder.appendChild(wrap);
  }
  document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.menu')) closeMenus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });

  const clock = bar.querySelector('.clock');
  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    clock.dateTime = now.toISOString();
  };
  tick();
  setInterval(tick, 30_000);
}

function closeMenus() {
  desktop.querySelectorAll('.menu-items').forEach((m) => { m.hidden = true; });
  desktop.querySelectorAll('.menu-title').forEach((t) => t.setAttribute('aria-expanded', 'false'));
}

function session(key, value) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
  } catch { /* storage blocked */ }
  return null;
}

function boot(done) {
  const screen = document.getElementById('boot');
  if (reducedMotion || session('treyos.booted')) { screen.remove(); done(); return; }
  screen.classList.add('is-on');
  screen.querySelector('.boot-bar span').addEventListener('animationend', () => {
    session('treyos.booted', '1');
    screen.remove();
    done();
  }, { once: true });
}

function restart() {
  session('treyos.booted', '');
  window.location.reload();
}

function openFromHash(fallback) {
  const { app } = parseHash(window.location.hash, APP_IDS);
  if (app) openApp(app); else if (fallback) openApp(fallback);
}

const winRoot = desktop.querySelector('.windows');
winRoot.addEventListener('wm:open', (e) => {
  if (APP_IDS.includes(e.detail.appId)) history.replaceState(null, '', toHash(e.detail.appId));
});
winRoot.addEventListener('wm:open', () => { if (getPref('sound', false)) blip(); });
winRoot.addEventListener('wm:close', (e) => {
  if (window.location.hash === toHash(e.detail.appId)) history.replaceState(null, '', window.location.pathname);
});
window.addEventListener('hashchange', () => openFromHash(null));

// A short square-wave blip when a window opens, only if sound is on.
let audio;
function blip() {
  try {
    audio = audio || new AudioContext();
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = 'square';
    o.frequency.value = 880;
    g.gain.value = 0.04;
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.05);
  } catch { /* no audio */ }
}

buildMenubar();
buildIcons();
startPet(desktop.querySelector('.pet-layer'), { onClick: () => openApp('newton'), still: reducedMotion });
boot(() => {
  desktop.classList.add('is-ready');
  openFromHash('readme');
});

export { ctx };
