#!/usr/bin/env node
/**
 * Pre-flight checks. Runs without building, so it is safe in CI and as a
 * pre-commit step. Exits non-zero on anything that would break a deploy.
 */
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SRC, c, PLACEHOLDERS, loadEnv, collectRefs, bytes } from './lib.mjs';

const html = readFileSync(join(SRC, 'index.html'), 'utf8');
const env = loadEnv();
const problems = [];
const notes = [];

console.log(c.bold('\n  Pre-flight checks\n'));

// 1. every referenced local file exists
const refs = collectRefs(html);
const missing = refs.filter((r) => {
  try { statSync(join(SRC, r)); return false; } catch { return true; }
});
missing.length
  ? problems.push(`missing files: ${missing.join(', ')}`)
  : console.log(`  ${c.green('✓')} ${refs.length} asset references resolve`);

// 2. no orphaned assets bloating the repo
const onDisk = readdirSync(join(SRC, 'assets')).map((f) => `assets/${f}`);
const used = new Set(refs);
const orphans = onDisk.filter((f) => !used.has(f));
orphans.length
  ? notes.push(`unreferenced assets (safe to delete): ${orphans.join(', ')}`)
  : console.log(`  ${c.green('✓')} no unreferenced assets`);

// 3. credentials must never be committed
const secretPatterns = [
  [/\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{12,}/, 'Stripe-style key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(?:api[_-]?key|secret|password|passwd|auth[_-]?token)\s*[:=]\s*["'][^"'\s]{8,}["']/i, 'hardcoded credential'],
];
const found = secretPatterns.filter(([re]) => re.test(html)).map(([, label]) => label);
found.length
  ? problems.push(`possible credentials in source: ${found.join(', ')}`)
  : console.log(`  ${c.green('✓')} no credentials in source`);

// 4. basic document health
const checks = [
  [/<title>[^<]{5,70}<\/title>/, 'page title present and a sane length'],
  [/<meta name="description" content="[^"]{50,170}"/, 'meta description present and a sane length'],
  [/<html lang="en">/, 'lang attribute set'],
  [/application\/ld\+json/, 'LocalBusiness schema present'],
  [/<meta property="og:title"/, 'Open Graph tags present'],
];
for (const [re, label] of checks) {
  re.test(html) ? console.log(`  ${c.green('✓')} ${label}`) : problems.push(`failed: ${label}`);
}

const imgs = [...html.matchAll(/<img\b[^>]*>/g)];
const noAlt = imgs.filter((m) => !/\salt=/.test(m[0]));
noAlt.length
  ? problems.push(`${noAlt.length} <img> without alt text`)
  : console.log(`  ${c.green('✓')} all ${imgs.length} images have alt text`);

// 5. unresolved contact placeholders (a warning, not a failure)
for (const { find, env: key, label } of PLACEHOLDERS) {
  if (html.includes(find) && !env[key]) {
    notes.push(`${label} is still the placeholder "${find}" — set ${key} before going live`);
  }
}
if (!env.FORM_ENDPOINT) {
  notes.push('FORM_ENDPOINT unset — quote form falls back to the visitor\'s email app');
}

// 6. payload weight
const heroVideo = statSync(join(SRC, 'assets/hero-loop.mp4')).size;
const page = Buffer.byteLength(html);
console.log(c.dim(`\n  page ${bytes(page)} · hero video ${bytes(heroVideo)}`));

if (notes.length) {
  console.log(c.yellow(`\n  ${notes.length} note${notes.length > 1 ? 's' : ''}:`));
  for (const n of notes) console.log(c.yellow('    ! ') + n);
}

if (problems.length) {
  console.log(c.red(`\n  ${problems.length} problem${problems.length > 1 ? 's' : ''}:`));
  for (const p of problems) console.log(c.red('    x ') + p);
  console.log('');
  process.exit(1);
}

console.log(c.green('\n  All checks passed.\n'));
