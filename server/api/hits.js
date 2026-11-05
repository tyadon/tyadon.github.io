// GET: current visitor count. POST: count this visit and return the new total.
import { sql } from '../lib/db.js';
import { json, preflight } from '../lib/http.js';

export function OPTIONS(request) {
  return preflight(request);
}

export async function GET(request) {
  const [row] = await sql`select hit_count() as count`;
  return json({ count: Number(row.count) }, 200, request.headers.get('origin'));
}

export async function POST(request) {
  const [row] = await sql`select hit() as count`;
  return json({ count: Number(row.count) }, 200, request.headers.get('origin'));
}
