// Serves the photos you upload in the admin.
const { cmd } = require('./_store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const n = String((req.query && req.query.n) || (String(req.url).match(/[?&]n=([^&]+)/) || [])[1] || '');
  if (!/^[A-Za-z0-9._-]{3,90}$/.test(n)) { res.statusCode = 404; return res.end(); }
  try {
    const s = await cmd(['GET', 'img:' + n]); if (!s) { res.statusCode = 404; return res.end('Not found'); }
    const o = JSON.parse(s);
    res.setHeader('Content-Type', o.t); res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.statusCode = 200; res.end(Buffer.from(o.d, 'base64'));
  } catch (e) { res.statusCode = 404; res.end(); }
};
