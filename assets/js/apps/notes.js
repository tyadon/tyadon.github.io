import { html } from '../lib/html.js';

export function renderList(posts) {
  if (!posts.length) return html`<p class="pad">No notes yet.</p>`;
  return html`<ul class="notes-list">${posts.map((p) => html`<li><button type="button" data-url="${p.url}"><strong>${p.title}</strong><span class="meta">${p.excerpt}</span></button></li>`)}</ul>`;
}

async function openPost(body, url, back) {
  body.innerHTML = '<p class="pad">Loading...</p>';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const article = doc.querySelector('article');
    body.innerHTML = '';
    const bar = document.createElement('p');
    bar.className = 'notes-bar';
    bar.innerHTML = html`<button type="button" class="btn">All notes</button><a class="btn" href="${url}">Open as a page</a>`;
    bar.querySelector('button').addEventListener('click', back);
    body.append(bar, article);
    article.classList.add('pad', 'note');
  } catch {
    body.innerHTML = html`<p class="pad">That note didn't load. <a href="${url}">Open it as a page</a> instead.</p>`;
  }
}

export async function render(body) {
  const showList = async () => {
    body.innerHTML = '<p class="pad">Loading...</p>';
    let posts = [];
    try { posts = await (await fetch('/notes/index.json')).json(); } catch { /* offline */ }
    body.innerHTML = renderList(posts);
    body.querySelectorAll('[data-url]').forEach((b) => b.addEventListener('click', () => openPost(body, b.dataset.url, showList)));
  };
  showList();
}
