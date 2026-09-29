// Shared helpers. No third-party dependencies anywhere in this project.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = join(ROOT, 'src');
export const DIST = join(ROOT, 'dist');

export const c = {
  dim: s => `\x1b[2m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
};

/**
 * Minimal .env reader — deliberately not a dependency.
 * Real environment variables always win over the .env file, which is how
 * CI and hosting platforms expect to inject configuration.
 */
export function loadEnv() {
  const file = join(ROOT, '.env');
  const out = {};
  if (existsSync(file)) {
    for (const rawLine of readFileSync(file, 'utf8').split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
  }
  for (const key of Object.keys(out)) {
    if (process.env[key] !== undefined && process.env[key] !== '') out[key] = process.env[key];
  }
  for (const key of ['SITE_URL', 'CONTACT_PHONE', 'CONTACT_PHONE_E164', 'CONTACT_EMAIL', 'FORM_ENDPOINT']) {
    if (process.env[key]) out[key] = process.env[key];
  }
  return out;
}

/** The literal stand-in values that ship in src/, and the env var that replaces each. */
export const PLACEHOLDERS = [
  { find: '(000) 000-0000', env: 'CONTACT_PHONE',      label: 'phone number (display)' },
  { find: '+10000000000',   env: 'CONTACT_PHONE_E164', label: 'phone number (tel: link)' },
  { find: 'info@cnspotlesswindowmobiletint.com', env: 'CONTACT_EMAIL', label: 'contact email' },
];

export const bytes = n =>
  n < 1024 ? `${n} B`
  : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB`
  : `${(n / 1024 / 1024).toFixed(2)} MB`;

/** Every local file the HTML points at: src, href, srcset and CSS url(). */
export function collectRefs(html) {
  const refs = new Set();
  const add = v => {
    if (!v) return;
    const clean = v.trim().split('#')[0].split('?')[0];
    if (!clean || /^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(clean)) return;
    refs.add(clean);
  };
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0]);
  }
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(m[1]);
  return [...refs];
}
