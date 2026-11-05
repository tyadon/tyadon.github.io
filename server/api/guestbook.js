// GET: latest signatures. POST: sign. Validation and rate limits live in Postgres (sign_guestbook).
import { sql } from '../lib/db.js';
import { json, preflight, clientIp } from '../lib/http.js';

export function OPTIONS(request) {
  return preflight(request);
}

export async function GET(request) {
  const entries = await sql`select id, name, message, website, created_at from list_guestbook(50)`;
  return json({ entries }, 200, request.headers.get('origin'));
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  let body;
  try { body = await request.json(); } catch { return json({ message: 'bad request' }, 400, origin); }
  const { name = '', message = '', website = '', hp = '' } = body || {};
  try {
    const [entry] = await sql`select id, name, message, website, created_at
      from sign_guestbook(${String(name)}, ${String(message)}, ${website ? String(website) : null}, ${String(hp)}, ${clientIp(request.headers)})`;
    return json({ entry }, 201, origin);
  } catch (err) {
    // Exceptions raised in sign_guestbook carry user-facing messages; anything else stays generic.
    const msg = err?.code === 'P0001' ? err.message : 'could not sign right now';
    return json({ message: msg }, 400, origin);
  }
}
