import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { resolve, extname, normalize } from 'node:path';

const root = resolve('public');
const dataDir = resolve('data');
const contentFile = resolve(dataDir, 'content.json');
const localSecrets = Object.fromEntries((await readFile('.dev.vars', 'utf8').catch(() => '')).split(/\r?\n/).filter((line) => line.includes('=')).map((line) => { const [key, ...value] = line.split('='); return [key.trim(), value.join('=').trim()]; }));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
const readBody = (request) => new Promise((resolveBody, reject) => { let body = ''; request.on('data', (chunk) => { body += chunk; if (body.length > 30_000_000) reject(new Error('Archivo demasiado grande')); }); request.on('end', () => resolveBody(body)); request.on('error', reject); });

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  try {
    if (url.pathname === '/api/login' && request.method === 'POST') {
      const { email, password } = JSON.parse(await readBody(request));
      if (!localSecrets.ADMIN_EMAIL || !localSecrets.ADMIN_PASSWORD) { response.writeHead(503); response.end('Configura .dev.vars'); return; }
      if (email !== localSecrets.ADMIN_EMAIL || password !== localSecrets.ADMIN_PASSWORD) { response.writeHead(401); response.end('Credenciales incorrectas'); return; }
      response.writeHead(204); response.end(); return;
    }
    if (url.pathname === '/api/content' && request.method === 'GET') {
      const data = await readFile(contentFile, 'utf8').catch(() => 'null');
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(data); return;
    }
    if (url.pathname === '/api/content' && request.method === 'POST') {
      const body = await readBody(request); JSON.parse(body);
      await mkdir(dataDir, { recursive: true });
      const temporaryFile = `${contentFile}.tmp`;
      await writeFile(temporaryFile, body, 'utf8'); await rename(temporaryFile, contentFile);
      response.writeHead(204); response.end(); return;
    }
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = resolve(root, `.${normalize(path)}`);
    if (!file.startsWith(root)) throw new Error('Ruta no permitida');
    const fileInfo = await stat(file);
    if (!fileInfo.isFile()) throw new Error('No encontrado');
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' }); response.end(await readFile(file));
  } catch (error) {
    response.writeHead(url.pathname.startsWith('/api/') ? 500 : 404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end(error.message || 'No encontrado');
  }
}).listen(8787, () => console.log('Portfolio local: http://localhost:8787'));
