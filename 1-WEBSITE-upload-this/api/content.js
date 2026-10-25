// Every page of the website loads this. It returns the latest content you saved in the admin.
const { cmd, configured } = require('./_store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF'); res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  let out = '/* no saved content yet */';
  try { if (configured) { const s = await cmd(['GET', 'site']); if (typeof s === 'string' && s) out = 'window.SITE=' + s + ';'; } } catch (e) {}
  res.statusCode = 200; res.end(out);
};
