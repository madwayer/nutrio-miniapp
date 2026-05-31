// api/proxy.js — Vercel serverless proxy к боту NutriO
export default async function handler(req, res) {
  const path = req.url.replace('/api/proxy', '');
  const target = `http://147.45.162.38:8080${path}`;

  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Telegram-User-Id');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const fetchRes = await fetch(target, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    const data = await fetchRes.json();
    res.status(fetchRes.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Bot unavailable' });
  }
}
