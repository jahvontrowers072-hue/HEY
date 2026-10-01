// SEO + link check for the built site. Run after `npm run build`:  npm run check
// Exits non-zero on errors; prints warnings that don't block a deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const SITE = "https://cnspotless.shopzencho.com";
const FORBIDDEN = [/cnspotlesswindowmobiletint/i, /cnspot\.vercel\.app/i, /localhost/i, /127\.0\.0\.1/, /example\.com/i, /\(000\)\s*000-0000/];

const errors = [], warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const meta = (html, attr, name) => (html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || [])[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Map a site path to its file on disk (cleanUrls: /x -> x.html).
function fileFor(p) {
  const clean = decodeURIComponent(p.split(/[?#]/)[0]);
  if (clean === "/" || clean === "") return "index.html";
  const direct = clean.replace(/^\//, "");
  if (fs.existsSync(path.join(ROOT, direct)) && fs.statSync(path.join(ROOT, direct)).isFile()) return direct;
  if (fs.existsSync(path.join(ROOT, direct + ".html"))) return direct + ".html";
  return null;
}

// Indexable pages come from the sitemap; that's the contract.
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!sitemap.startsWith("<?xml") || !sitemap.includes("http://www.sitemaps.org/schemas/sitemap/0.9")) err("sitemap.xml", "not a valid sitemap document");
if (!locs.length) err("sitemap.xml", "no URLs");
if (new Set(locs).size !== locs.length) err("sitemap.xml", "duplicate URLs");

const titles = new Map(), descs = new Map();
for (const loc of locs) {
  if (!loc.startsWith(SITE + "/")) { err("sitemap.xml", `URL not on ${SITE}: ${loc}`); continue; }
  const p = loc.slice(SITE.length) || "/";
  const file = fileFor(p);
  if (!file) { err("sitemap.xml", `no page for ${loc}`); continue; }
  const html = read(file);
  const head = html.slice(0, html.indexOf("</head>"));

  // robots
  const robots = meta(head, "name", "robots") || "";
  if (/noindex/i.test(robots)) err(file, "in sitemap but marked noindex");

  // title + description
  const title = decode((head.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = decode(meta(head, "name", "description") || "");
  if (!title) err(file, "missing <title>");
  else if (title.length > 65) warn(file, `title is ${title.length} chars (may be cut off in results)`);
  if (!desc) err(file, "missing meta description");
  else if (desc.length < 70 || desc.length > 165) warn(file, `meta description is ${desc.length} chars`);
  if (titles.has(title)) err(file, `title duplicates ${titles.get(title)}`); else titles.set(title, file);
  if (descs.has(desc)) err(file, `description duplicates ${descs.get(desc)}`); else descs.set(desc, file);

  // canonical must be this exact URL
  const canonical = (head.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canonical !== loc) err(file, `canonical is ${canonical}, expected ${loc}`);

  // Open Graph + Twitter
  for (const k of ["og:type", "og:site_name", "og:url", "og:title", "og:description", "og:image", "og:image:width", "og:image:height", "og:image:alt", "og:locale"]) {
    if (!meta(head, "property", k)) err(file, `missing ${k}`);
  }
  for (const k of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!meta(head, "name", k)) err(file, `missing ${k}`);
  }
  if (meta(head, "property", "og:url") !== loc) err(file, "og:url does not match canonical");
  const ogImg = meta(head, "property", "og:image") || "";
  if (!ogImg.startsWith(SITE + "/")) err(file, `og:image not on ${SITE}`);
  else if (!fileFor(ogImg.slice(SITE.length))) err(file, `og:image file missing: ${ogImg}`);

  // JSON-LD parses and only uses the production domain
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) err(file, "no JSON-LD");
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b); } catch (e) { err(file, `invalid JSON-LD: ${e.message}`); continue; }
    if (!data["@context"] || !data["@type"]) err(file, "JSON-LD block missing @context/@type");
    const urls = [...b.matchAll(/"https?:\/\/[^"]+"/g)].map((m) => m[0].slice(1, -1)).filter((u) => !u.startsWith("https://schema.org"));
    for (const u of urls) if (!u.startsWith(SITE)) err(file, `JSON-LD URL off-domain: ${u}`);
    if (/"(ratingValue|reviewCount|aggregateRating|priceRange)"/.test(b)) err(file, "JSON-LD contains rating/review/price data that the site doesn't publish");
  }

  // headings
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => +m[1]);
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) err(file, `has ${h1s} <h1> elements`);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { warn(file, `heading jumps from h${levels[i - 1]} to h${levels[i]}`); break; }

  // images
  for (const tag of html.match(/<img\b[^>]*>/g) || []) if (!/\balt="/.test(tag)) err(file, `image without alt: ${tag.slice(0, 80)}`);
}

// Every page on disk (including 404): links, forbidden domains
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const homeIds = new Set([...read("index.html").matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
for (const file of pages) {
  const html = read(file);
  for (const re of FORBIDDEN) if (re.test(html)) err(file, `contains forbidden/placeholder value ${re}`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"]*|#[^"]*)"/g)) {
    if (href === "#" ) continue;                                  // JS-driven controls (modals)
    if (href.startsWith("#")) { if (!ids.has(href.slice(1))) err(file, `anchor ${href} has no target`); continue; }
    const [p, hash] = href.split("#");
    const target = fileFor(p);
    if (!target) { err(file, `broken internal link ${href}`); continue; }
    if (hash) {
      const targetIds = target === "index.html" ? homeIds : new Set([...read(target).matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
      if (!targetIds.has(hash)) err(file, `link ${href} points to a missing section`);
    }
  }
}

// 404 page
const notFound = read("404.html");
if (!/<meta name="robots" content="noindex/.test(notFound)) err("404.html", "should be noindex");
if (locs.some((l) => /404/.test(l))) err("sitemap.xml", "includes the 404 page");
if (!/href="\/"/.test(notFound)) err("404.html", "no link back to the homepage");

// robots.txt
const robotsTxt = read("robots.txt");
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap.xml`)) err("robots.txt", "missing production Sitemap line");
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) err("robots.txt", "blocks the whole site");
if (/^Disallow:.*(assets|\.css|\.js)/m.test(robotsTxt)) err("robots.txt", "blocks CSS/JS/images");

console.log(`SEO check: ${locs.length} indexable pages, ${pages.length} HTML files`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);
if (errors.length) { console.log(`\n${errors.length} error(s).`); process.exit(1); }
console.log(warnings.length ? `\nPassed with ${warnings.length} warning(s).` : "\nAll checks passed.");
