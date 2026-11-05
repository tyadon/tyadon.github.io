// Per-visitor settings. Storage can throw (private mode, blocked data), so every access is guarded.

const PREFIX = 'treyos.';

export function createPrefs(storage) {
  return {
    getPref(key, fallback) {
      try {
        const v = storage?.getItem(PREFIX + key);
        return v === null || v === undefined ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    setPref(key, value) {
      try { storage?.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* not saved, still applied */ }
    },
  };
}

const local = (() => { try { return globalThis.localStorage ?? null; } catch { return null; } })();
export const { getPref, setPref } = createPrefs(local);
