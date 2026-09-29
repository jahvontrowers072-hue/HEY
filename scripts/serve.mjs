#!/usr/bin/env node
/**
 * Static file server used by `npm run dev` (serves src/) and
 * `npm run preview` (serves dist/). Node standard library only.
 *
 *   node scripts/serve.mjs <dir> [port]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname, normalize, resolve } from 'node:path';
import { ROOT, c } from './lib.mjs';

const dir = resolve(ROOT, process.argv[2] || 'src');
const port = Number(process.argv[3] || process.env.PORT || 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  // normalize first so "../" cannot escape the served directory
  let filePath = join(dir, normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));

  if (!resolve(filePath).startsWith(dir)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    if (statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 Not Found');
    console.log(c.dim(`  404  ${urlPath}`));
    return;
  }

  let size;
  try {
    size = statSync(filePath).size;
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 Not Found');
    console.log(c.dim(`  404  ${urlPath}`));
    return;
  }

  const type = TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';

  // range requests so <video> can seek
  const range = req.headers.range;
  if (range && /^bytes=\d*-\d*$/.test(range)) {
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = s ? Number(s) : 0;
    const end = e ? Number(e) : size - 1;
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Cache-Control': 'no-cache' });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`\n  ${c.bold('C&N Spotless')} — serving ${c.dim(dir.replace(ROOT + '/', ''))}`);
  console.log(`  ${c.green('→')} http://localhost:${port}\n`);
});
