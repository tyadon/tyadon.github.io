// Tiny HTML templating. Interpolations are escaped unless wrapped in raw().

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const RAW = Symbol('raw');

export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ENTITIES[c]);
}

export function raw(str) {
  return { [RAW]: true, value: String(str) };
}

function part(v) {
  if (Array.isArray(v)) return v.map(part).join('');
  if (v && v[RAW]) return v.value;
  return esc(v);
}

// Returns a plain string marked as already-safe when nested in another html``.
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += part(v) + strings[i + 1]; });
  return new SafeString(out);
}

class SafeString extends String {
  get [RAW]() { return true; }
  get value() { return this.toString(); }
}
