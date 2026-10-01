#!/usr/bin/env node
/**
 * Production build. Zero dependencies — Node standard library only.
 *
 *   src/  ->  dist/
 *
 * Steps: validate -> inject config -> minify -> copy assets -> emit SEO files.
 * Run with --strict to fail the build when contact placeholders are unresolved.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { SRC, DIST, c, loadEnv, PLACEHOLDERS, bytes, collectRefs } from './lib.mjs';

const strict = process.argv.includes('--strict');
const env = loadEnv();
const warnings = [];
const t0 = Date.now();

console.log(c.bold('\n  C&N Spotless — production build\n'));

// ── 1. read + validate source ────────────────────────────────────────────────
const srcHtml = readFileSync(join(SRC, 'index.html'), 'utf8');

const missing = collectRefs(srcHtml).filter((ref) => {
  try { statSync(join(SRC, ref)); return false; } catch { return true; }
});
if (missing.length) {
  console.error(c.red('  ✗ referenced files not found in src/:'));
  for (const m of missing) console.error('      ' + m);
  process.exit(1);
}
console.log(`  ${c.green('✓')} asset references resolve`);

// Nothing that looks like a credential may ship.
const secretPatterns = [
  [/\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{12,}/, 'Stripe-style key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(?:api[_-]?key|secret|password|passwd|auth[_-]?token)\s*[:=]\s*["'][^"'\s]{8,}["']/i, 'hardcoded credential'],
];
for (const [re, label] of secretPatterns) {
  if (re.test(srcHtml)) {
    console.error(c.red(`  ✗ possible ${label} found in src/index.html — refusing to build`));
    process.exit(1);
  }
}
console.log(`  ${c.green('✓')} no credentials in source`);

// ── 2. inject configuration ──────────────────────────────────────────────────
let html = srcHtml;

for (const { find, env: key, label } of PLACEHOLDERS) {
  const value = env[key];
  if (value) {
    const count = html.split(find).length - 1;
    html = html.split(find).join(value);
    console.log(`  ${c.green('✓')} ${label} → ${value} ${c.dim(`(${count}x)`)}`);
  } else if (html.includes(find)) {
    warnings.push(`${label} still shows the placeholder "${find}" — set ${key}`);
  }
}

if (env.FORM_ENDPOINT) {
  const before = html;
  html = html.replace(/var FORM_ENDPOINT = "";/, `var FORM_ENDPOINT = ${JSON.stringify(env.FORM_ENDPOINT)};`);
  if (html === before) warnings.push('FORM_ENDPOINT was set but its target line was not found in index.html');
  else console.log(`  ${c.green('✓')} quote form posts to ${env.FORM_ENDPOINT}`);
} else {
  warnings.push("FORM_ENDPOINT is unset — the quote form falls back to opening the visitor's email app");
}

if (env.CONTACT_EMAIL) {
  html = html.replace(/var BUSINESS_EMAIL = "[^"]*";/, `var BUSINESS_EMAIL = ${JSON.stringify(env.CONTACT_EMAIL)};`);
}

const DEFAULT_HOST = 'cnspot.vercel.app';
const siteUrl = (env.SITE_URL || `https://${DEFAULT_HOST}`).replace(/\/+$/, '');

let siteHost = DEFAULT_HOST;
try {
  siteHost = new URL(siteUrl).host.replace(/^www\./, '');
} catch {
  console.error(c.red(`  ✗ SITE_URL is not a valid absolute URL: ${siteUrl}`));
  process.exit(1);
}

html = html.split(`https://${DEFAULT_HOST}`).join(siteUrl);
// Also swap the bare domain where it appears as link text, so the footer link
// never disagrees with its own href. The lookbehind keeps email addresses out
// of it — those are governed by CONTACT_EMAIL alone.
html = html.replace(new RegExp(`(?<!@)${DEFAULT_HOST.replace(/\./g, '\\.')}`, 'g'), siteHost);
// og:image and schema images need absolute URLs once the origin is known
html = html.replace(/(<meta property="og:image" content=")([^"]+)(")/, (_m, a, p, b) =>
  `${a}${p.startsWith('http') ? p : `${siteUrl}/${p}`}${b}`);
html = html.replace(/("logo":\s*")(assets\/[^"]+)(")/, (_m, a, p, b) => `${a}${siteUrl}/${p}${b}`);
html = html.replace(/("image":\s*")(assets\/[^"]+)(")/, (_m, a, p, b) => `${a}${siteUrl}/${p}${b}`);
console.log(`  ${c.green('✓')} canonical origin → ${siteUrl}`);

if (strict && warnings.length) {
  console.error(c.red('\n  ✗ --strict: unresolved configuration\n'));
  for (const w of warnings) console.error('      ' + w);
  process.exit(1);
}

// ── 3. minify (conservative: comments + whitespace only) ─────────────────────
const sizeBefore = Buffer.byteLength(html);
html = minifyHtml(html);
const sizeAfter = Buffer.byteLength(html);
console.log(
  `  ${c.green('✓')} minified html ${bytes(sizeBefore)} → ${bytes(sizeAfter)} ` +
  c.dim(`(-${Math.round((1 - sizeAfter / sizeBefore) * 100)}%)`)
);

// ── 4. write dist ────────────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'index.html'), html);
cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(DIST, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n` +
  '    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n'
);

// Cache and security headers. Netlify and Cloudflare Pages both read this file.
writeFileSync(
  join(DIST, '_headers'),
  '/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: SAMEORIGIN\n' +
  '  Referrer-Policy: strict-origin-when-cross-origin\n' +
  '  Permissions-Policy: geolocation=(), microphone=(), camera=()\n\n' +
  '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n' +
  '/index.html\n  Cache-Control: public, max-age=0, must-revalidate\n'
);

console.log(`  ${c.green('✓')} wrote robots.txt, sitemap.xml, _headers`);

// ── 5. report ────────────────────────────────────────────────────────────────
let total = 0;
let files = 0;
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else { total += statSync(p).size; files++; }
  }
})(DIST);

console.log(`\n  ${c.bold('dist/')} — ${files} files, ${bytes(total)} ` + c.dim(`in ${Date.now() - t0}ms`));
if (warnings.length) {
  console.log(c.yellow(`\n  ${warnings.length} warning${warnings.length > 1 ? 's' : ''} (build still succeeded):`));
  for (const w of warnings) console.log(c.yellow('    ! ') + w);
  console.log(c.dim("    Set these in .env or your host's environment variables. See README."));
}
console.log(c.green('\n  Build succeeded.\n'));

/**
 * Whitespace-and-comments minifier.
 *
 * Deliberately conservative: it never rewrites JavaScript, never touches text
 * inside <pre>/<textarea>, and never removes the single space that separates
 * inline elements. CSS gets comment removal plus whitespace collapsing, but
 * spaces around operators survive so calc() and clamp() keep working.
 */
function minifyHtml(input) {
  const stash = [];
  const mark = (i) => `@@CNS${i}@@`;
  const keep = (re, src) => src.replace(re, (m) => mark(stash.push(m) - 1));

  let out = input;
  out = keep(/<pre[\s\S]*?<\/pre>/gi, out);
  out = keep(/<textarea[\s\S]*?<\/textarea>/gi, out);
  out = keep(/<script[\s\S]*?<\/script>/gi, out);

  out = out.replace(/<style>([\s\S]*?)<\/style>/gi, (_m, css) => `<style>${minifyCss(css)}</style>`);
  out = out.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  // collapse indentation and blank lines between tags, keeping single separators
  out = out.replace(/>\s*\n\s*</g, '>\n<').replace(/\n{2,}/g, '\n').replace(/^[ \t]+/gm, '');

  return out.replace(/@@CNS(\d+)@@/g, (_m, i) => stash[Number(i)]);
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim();
}
