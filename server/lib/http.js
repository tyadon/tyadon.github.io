// Shared HTTP helpers for the TreyOS API.

const ORIGINS = new Set([
  'https://treyyadon.space',
  'https://www.treyyadon.space',
  'https://tyadon.github.io',
  'http://localhost:4000',
]);

export function corsHeaders(origin) {
  const h = { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' };
  if (origin && ORIGINS.has(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

export function clientIp(headers) {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}

export function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders(origin) },
  });
}

export function preflight(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}
