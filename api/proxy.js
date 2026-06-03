// api/proxy.js — Vercel serverless proxy к боту NutriO
import https from 'https';

export default function handler(req, res) {
  const path = req.url.replace('/api/proxy', '') || '/';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-User-Id');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const options = {
    hostname: process.env.BOT_HOST || '147.45.162.38',
    port: 443,
    path: path,
    method: req.method,
    rejectUnauthorized: false,
    headers: { 'Content-Type': 'application/json' },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => { data += chunk; });
    proxyRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxyReq.on('error', (e) => {
    res.status(502).json({ error: e.message });
  });

  if (req.method !== 'GET' && req.body) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
}
