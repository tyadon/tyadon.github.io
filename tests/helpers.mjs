import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, '_site');
let built = null;

export async function buildSite() {
  if (!built) {
    execFileSync(join(ROOT, 'scripts/build.sh'), { cwd: ROOT, stdio: 'pipe' });
    built = SITE;
  }
  return built;
}

export function readSite(rel) {
  return readFileSync(join(SITE, rel), 'utf8');
}

export function readJSON(rel) {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}
