// Guestbook and hit counter over the TreyOS API. Network failures never throw to callers.
import { API_BASE } from '../config.js';

export const enabled = () => Boolean(API_BASE);

export function validateEntry({ name = '', message = '', website = '', hp = '' }) {
  const n = name.trim();
  const m = message.trim();
  const w = website.trim();
  if (hp) return { ok: false, error: 'Something went wrong. Try again.' };
  if (n.length < 1 || n.length > 40) return { ok: false, error: 'Your name needs to be 1 to 40 characters.' };
  if (m.length < 1 || m.length > 500) return { ok: false, error: 'Your message needs to be 1 to 500 characters.' };
  if (w && !/^https?:\/\//i.test(w)) return { ok: false, error: 'Your website needs to start with http:// or https://.' };
  if (w.length > 200) return { ok: false, error: 'Your website address needs to be 200 characters or fewer.' };
  return { ok: true };
}

export function shouldCountHit(storage) {
  try {
    if (storage.getItem('treyos.counted')) return false;
    storage.setItem('treyos.counted', '1');
    return true;
  } catch {
    return false;
  }
}

async function call(path, method = 'GET', body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => null);
    return res.ok ? { ok: true, data } : { ok: false, error: data?.message || `Error ${res.status}` };
  } catch {
    return { ok: false, error: 'offline' };
  } finally {
    clearTimeout(timer);
  }
}

export async function loadEntries(limit = 50) {
  const r = await call('/api/guestbook');
  const ok = r.ok && Array.isArray(r.data?.entries);
  return { ok, entries: ok ? r.data.entries.slice(0, limit) : [] };
}

export async function fetchEntries(limit = 50) {
  return (await loadEntries(limit)).entries;
}

export async function signEntry({ name, message, website = '', hp = '' }) {
  const r = await call('/api/guestbook', 'POST', { name, message, website, hp });
  return r.ok ? { ok: true, entry: r.data.entry } : { ok: false, error: r.error };
}

export async function recordHit() {
  const r = await call('/api/hits', 'POST');
  return r.ok && typeof r.data?.count === 'number' ? r.data.count : null;
}

export async function getHits() {
  const r = await call('/api/hits');
  return r.ok && typeof r.data?.count === 'number' ? r.data.count : null;
}
