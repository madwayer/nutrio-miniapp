// NutriO Mini App ↔ Bot API proxy
// Phase 1 refactor: configurable protocol, timeout, robust fallback, body buffering.
//
// Env vars (Vercel project settings):
//   BOT_HOST       — bot host/IP   (default: 147.45.162.38)
//   BOT_PROTOCOL   — 'https' | 'http' (default: 'https')
//   BOT_PORT       — port number   (default: 443 for https, 80 for http)
//   BOT_FALLBACK   — '1' to retry on http://BOT_HOST:8080 when https fails (default: '1')
//   BOT_TIMEOUT_MS — request timeout ms (default: 25000)
//
// The proxy strips '/api/proxy' prefix and forwards everything else.
// PDFs are streamed; everything else is buffered as JSON/text.

import https from 'https';
import http  from 'http';

const HOST           = process.env.BOT_HOST       || '147.45.162.38';
const PROTOCOL       = (process.env.BOT_PROTOCOL  || 'https').toLowerCase();
const DEFAULT_PORT   = PROTOCOL === 'http' ? 80 : 443;
const PORT           = parseInt(process.env.BOT_PORT || DEFAULT_PORT, 10);
const ENABLE_FALLBACK= (process.env.BOT_FALLBACK || '1') === '1';
const TIMEOUT_MS     = parseInt(process.env.BOT_TIMEOUT_MS || '25000', 10);

// Read body once, regardless of req.body presence (Vercel sometimes does not parse).
function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return Promise.resolve(null);
  if (req.body !== undefined && req.body !== null) {
    return Promise.resolve(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
  }
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 25 * 1024 * 1024) { reject(new Error('body too large')); req.destroy(); } });
    req.on('end',  () => resolve(data || null));
    req.on('error', reject);
  });
}

function doRequest(client, options, bodyStr) {
  return new Promise((resolve, reject) => {
    const req = client.request(options, (res) => resolve(res));
    req.on('error', reject);
    req.setTimeout(TIMEOUT_MS, () => { req.destroy(new Error('upstream timeout')); });
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

export default async function handler(req, res) {
  // CORS — safe defaults
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-User-Id, X-Admin-Id, X-Telegram-Init-Data, X-Health-Token');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  // Strip '/api/proxy' prefix; pass query string untouched.
  // req.url is e.g. '/api/proxy/api/diary?user_id=123'
  let upstreamPath = req.url.replace(/^\/api\/proxy/, '');
  if (!upstreamPath || upstreamPath === '/') upstreamPath = '/';
  const isPdf = upstreamPath.startsWith('/api/pdf');

  let bodyStr;
  try { bodyStr = await readBody(req); }
  catch (e) { res.status(413).json({ error: 'body too large' }); return; }

  // Header forwarding: keep only relevant ones, drop hop-by-hop and host
  const fwdHeaders = { 'Content-Type': 'application/json' };
  ['x-telegram-user-id', 'x-telegram-init-data', 'x-admin-id'].forEach(h => {
    if (req.headers[h]) fwdHeaders[h.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('-')] = req.headers[h];
  });
  if (bodyStr) fwdHeaders['Content-Length'] = Buffer.byteLength(bodyStr);

  const baseOptions = {
    hostname: HOST,
    path:     upstreamPath,
    method:   req.method,
    headers:  fwdHeaders,
    rejectUnauthorized: false, // bot uses self-signed cert
  };

  // Try primary protocol first; on connection error optionally retry on http:8080
  const attempts = [];
  attempts.push({ client: PROTOCOL === 'http' ? http : https, opts: { ...baseOptions, port: PORT } });
  if (ENABLE_FALLBACK && PROTOCOL !== 'http') {
    attempts.push({ client: http, opts: { ...baseOptions, port: 8080 } });
  }

  let upstream, lastErr;
  for (let i = 0; i < attempts.length; i++) {
    try {
      upstream = await doRequest(attempts[i].client, attempts[i].opts, bodyStr);
      break;
    } catch (e) {
      lastErr = e;
      // Retry only on connection-level errors
      if (!['ECONNREFUSED', 'EPROTO', 'ECONNRESET', 'ETIMEDOUT'].includes(e.code) && e.message !== 'upstream timeout') break;
    }
  }
  if (!upstream) {
    res.status(502).json({ error: 'bot unreachable', detail: lastErr && (lastErr.code || lastErr.message) });
    return;
  }

  const ct = upstream.headers['content-type'] || 'application/json';
  res.status(upstream.statusCode || 502);
  if (isPdf || ct.includes('pdf') || ct.startsWith('image/') || upstreamPath.startsWith('/share/')) {
    res.setHeader('Content-Type', ct.startsWith('image/') ? ct : 'application/pdf');
    if (upstream.headers['content-disposition']) res.setHeader('Content-Disposition', upstream.headers['content-disposition']);
    if (upstreamPath.startsWith('/share/')) res.setHeader('Cache-Control', 'public, max-age=86400');
    upstream.pipe(res);
    return;
  }
  // Buffer JSON/text
  let data = '';
  upstream.setEncoding('utf8');
  upstream.on('data', c => data += c);
  upstream.on('end',  () => { res.setHeader('Content-Type', ct); res.send(data); });
  upstream.on('error', e => { try { res.status(502).json({ error: 'upstream stream', detail: e.message }); } catch(_){} });
}
