import https from 'https';
export default function handler(req, res) {
  const path = req.url.replace('/api/proxy', '') || '/';
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-User-Id, X-Admin-Id');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const isPdf = path.startsWith('/api/pdf');
  const options = {
    hostname: process.env.BOT_HOST || '147.45.162.38',
    port: 443, path, method: req.method, rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json',
      ...(req.headers['x-admin-id'] ? { 'X-Admin-Id': req.headers['x-admin-id'] } : {}),
    },
  };
  const proxyReq = https.request(options, (proxyRes) => {
    const ct = proxyRes.headers['content-type'] || 'application/json';
    if (isPdf || ct.includes('pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      if (proxyRes.headers['content-disposition']) res.setHeader('Content-Disposition', proxyRes.headers['content-disposition']);
      res.status(proxyRes.statusCode);
      proxyRes.pipe(res);
    } else {
      let data = '';
      proxyRes.on('data', c => data += c);
      proxyRes.on('end', () => { res.setHeader('Content-Type', 'application/json'); res.status(proxyRes.statusCode).send(data); });
    }
  });
  proxyReq.on('error', e => res.status(502).json({ error: e.message }));
  if (req.method !== 'GET' && req.body) {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
    proxyReq.write(body);
  }
  proxyReq.end();
}
