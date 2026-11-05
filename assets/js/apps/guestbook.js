import { html } from '../lib/html.js';
import { validateEntry, loadEntries, signEntry } from '../services/guestbook.js';

const when = (iso) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

export function renderEntries(entries) {
  if (!entries.length) return html`<p class="meta">No signatures yet. Be the first.</p>`;
  return html`<ol class="gb-entries">${entries.map((e) => html`<li>
    <p class="gb-msg">${e.message}</p>
    <p class="meta">${e.website ? html`<a href="${e.website}" target="_blank" rel="noopener nofollow ugc">${e.name}</a>` : e.name}, ${when(e.created_at)}</p>
  </li>`)}</ol>`;
}

const FORM = html`<form class="gb-form" novalidate>
  <label>Name <input name="name" maxlength="40" required autocomplete="nickname"></label>
  <label>Message <textarea name="message" maxlength="500" rows="3" required></textarea></label>
  <label>Website (optional) <input name="website" type="url" maxlength="200" placeholder="https://"></label>
  <label class="gb-hp" aria-hidden="true">Leave this empty <input name="hp" tabindex="-1" autocomplete="off"></label>
  <button class="btn" type="submit">Sign the guestbook</button>
  <p class="gb-status" role="status"></p>
</form>`;

export function render(body) {
  body.innerHTML = html`<div class="pad guestbook">${FORM}<h2>Signatures</h2><div class="gb-list"><p class="meta">Dialing in...</p></div></div>`;
  const list = body.querySelector('.gb-list');
  const form = body.querySelector('form');
  const status = body.querySelector('.gb-status');

  const load = async () => {
    const { ok, entries } = await loadEntries();
    list.innerHTML = ok ? renderEntries(entries) : html`<p class="meta">Line busy. The guestbook is offline right now, try again later.</p>`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const entry = Object.fromEntries(new FormData(form));
    const check = validateEntry(entry);
    if (!check.ok) { status.textContent = check.error; return; }
    status.textContent = 'Sending...';
    const r = await signEntry(entry);
    if (!r.ok) {
      status.textContent = r.error === 'offline' ? 'Line busy. The guestbook is offline right now, try again later.' : `Not signed: ${r.error}.`;
      return;
    }
    form.reset();
    status.textContent = 'Signed. Thanks for stopping by.';
    load();
  });

  load();
}
