// api/proxy.js — Vercel serverless proxy к боту NutriO
import https from 'https';

export default function handler(req, res) {
  const path = req.url.replace('/api/proxy', '') || '/';

  // CORS — allow all methods and headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-User-Id, X-Admin-Id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const isPdf = path.startsWith('/api/pdf');

  const options = {
    hostname: process.env.BOT_HOST || '147.45.162.38',
    port: 443,
    path: path,
    method: req.method,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers['x-admin-id'] ? { 'X-Admin-Id': req.headers['x-admin-id'] } : {}),
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || 'application/json';
    const disposition = proxyRes.headers['content-disposition'] || '';

    if (isPdf || contentType.includes('application/pdf')) {
      // Stream binary PDF
      res.setHeader('Content-Type', 'application/pdf');
      if (disposition) res.setHeader('Content-Disposition', disposition);
      res.status(proxyRes.statusCode);
      proxyRes.pipe(res);
    } else {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(proxyRes.statusCode).send(data);
      });
    }
  });

  proxyReq.on('error', (e) => {
    res.status(502).json({ error: e.message });
  });

  if (req.method !== 'GET' && req.body) {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
    proxyReq.write(body);
  }

  proxyReq.end();
}
