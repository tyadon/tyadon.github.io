// Guestbook and hit counter over Supabase RPC. Network failures never throw to callers.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

export const enabled = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function validateEntry({ name = '', message = '', website = '', hp = '' }) {
  const n = name.trim();
  const m = message.trim();
  const w = website.trim();
  if (hp) return { ok: false, error: 'Something went wrong. Try again.' };
  if (n.length < 1 || n.length > 40) return { ok: false, error: 'Your name needs to be 1 to 40 characters.' };
  if (m.length < 1 || m.length > 500) return { ok: false, error: 'Your message needs to be 1 to 500 characters.' };
  if (w && !/^https?:\/\//i.test(w)) return { ok: false, error: 'Your website needs to start with http:// or https://.' };
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

async function rpc(fn, args = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      signal: ctrl.signal,
    });
    const body = await res.json().catch(() => null);
    return res.ok ? { ok: true, data: body } : { ok: false, error: body?.message || `Error ${res.status}` };
  } catch {
    return { ok: false, error: 'offline' };
  } finally {
    clearTimeout(timer);
  }
}

export async function loadEntries(limit = 50) {
  const r = await rpc('list_guestbook', { p_limit: limit });
  const ok = r.ok && Array.isArray(r.data);
  return { ok, entries: ok ? r.data : [] };
}

export async function fetchEntries(limit = 50) {
  return (await loadEntries(limit)).entries;
}

export async function signEntry({ name, message, website = '', hp = '' }) {
  const r = await rpc('sign_guestbook', { p_name: name, p_message: message, p_website: website || null, p_hp: hp });
  return r.ok ? { ok: true, entry: r.data } : { ok: false, error: r.error };
}

export async function recordHit() {
  const r = await rpc('hit');
  return r.ok && typeof r.data === 'number' ? r.data : null;
}

export async function getHits() {
  const r = await rpc('hit_count');
  return r.ok && typeof r.data === 'number' ? r.data : null;
}
