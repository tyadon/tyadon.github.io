// Deep links look like #/app/<id>. Anything else opens nothing.

export function parseHash(hash, known) {
  const m = /^#\/app\/([a-z0-9-]+)$/.exec(hash || '');
  return { app: m && known.includes(m[1]) ? m[1] : null };
}

export function toHash(appId) {
  return `#/app/${appId}`;
}
