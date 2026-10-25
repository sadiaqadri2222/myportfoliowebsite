// Vercel function: checks your admin login and saves your edits to the database. Changes are live instantly.
const crypto = require('crypto');
const { cmd, TOKEN, configured } = require('./_store');
const E = process.env;
const ENV_USER = E.ADMIN_USER || 'admin', ENV_PASS = E.ADMIN_PASSWORD || '';
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const hashPw = (p, salt) => crypto.scryptSync(String(p), salt, 32).toString('hex');
// A password you set inside the admin is stored (scrambled) in the database. Vercel's ADMIN_PASSWORD, if set, always also works (reset key).
async function stored() { if (!configured) return null; try { const x = await cmd(['GET', 'auth']); return x ? JSON.parse(x) : null; } catch (e) { return null; } }
const pwOk = (p, st) => (ENV_PASS && same(p, ENV_PASS)) || (st && same(hashPw(p, st.s), st.h)) || (!ENV_PASS && !st && same(p, 'Admin@123'));
const loginOk = (u, p, st) => (ENV_PASS && same(u, ENV_USER) && same(p, ENV_PASS)) || (st && same(u, st.u) && same(hashPw(p, st.s), st.h)) || (!ENV_PASS && !st && same(u, 'admin') && same(p, 'Admin@123'));
const secretOf = st => E.SESSION_SECRET || crypto.createHash('sha256').update('sadia|' + ENV_PASS + '|' + (TOKEN || '') + '|' + (st ? st.h : '')).digest('hex');
const sign = (p, sec) => crypto.createHmac('sha256', sec).update(p).digest('base64url');
const mint = sec => { const p = Buffer.from(JSON.stringify({ e: Date.now() + 12 * 3600e3 })).toString('base64url'); return p + '.' + sign(p, sec); };
const valid = (t, sec) => { try { const [p, s] = String(t).split('.'); if (!p || !s || !same(sign(p, sec), s)) return false; return JSON.parse(Buffer.from(p, 'base64url')).e > Date.now(); } catch (e) { return false; } };
const wait = ms => new Promise(r => setTimeout(r, ms));
function out(res, code, o) { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(o)); }
const NOSTORE = 'Saving is not switched on yet. In Vercel open your project, go to Storage, create a free Upstash Redis database, connect it to this project, then Redeploy (see VERCEL-SETUP.txt).';
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF'); res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  try {
    if (req.method !== 'POST') return out(res, 405, { ok: 0 });
    let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } b = b || {};
    const a = b.a, tok = (req.headers.authorization || '').replace(/^Bearer /, ''), st = await stored(), SEC = secretOf(st);
    if (a === 'status') {
      const c = { store: false };
      if (configured) { try { await cmd(['PING']); c.store = true; } catch (e) { c.error = 'The database answered with an error: ' + e.message; } }
      return out(res, 200, { in: valid(tok, SEC), configured: c, default: !ENV_PASS && !st });
    }
    if (a === 'login') {
      if (loginOk(String(b.u || ''), String(b.p || ''), st)) return out(res, 200, { ok: 1, token: mint(SEC), default: !ENV_PASS && !st });
      await wait(700); return out(res, 200, { ok: 0 });
    }
    if (!valid(tok, SEC)) return out(res, 401, { ok: 0, err: 'Please log in again.' });
    if (!configured) return out(res, 200, { ok: 0, err: NOSTORE });
    if (a === 'passwd') {
      const nw = String(b.new || ''), nu = String(b.u || '').trim();
      if (!pwOk(String(b.old || ''), st)) { await wait(500); return out(res, 200, { ok: 0, err: 'Your current password is not right.' }); }
      if (nw.length < 8 || nw === 'Admin@123') return out(res, 200, { ok: 0, err: 'Choose a new password with at least 8 characters (not the default one).' });
      const salt = crypto.randomBytes(16).toString('hex'), n = { u: nu || (st ? st.u : ENV_USER), s: salt, h: hashPw(nw, salt) };
      await cmd(['SET', 'auth', JSON.stringify(n)]); return out(res, 200, { ok: 1, token: mint(secretOf(n)) });
    }
    if (a === 'blob') {
      const n = String(b.name || ''), t = String(b.type || ''), d = String(b.b64 || '');
      if (!/^photo-[A-Za-z0-9]+\.(jpg|png|webp|gif)$/.test(n) || !/^image\/(jpeg|png|webp|gif)$/.test(t) || !/^[A-Za-z0-9+/=]+$/.test(d)) return out(res, 200, { ok: 0, err: 'That file type is not allowed.' });
      if (d.length > 950000) return out(res, 200, { ok: 0, err: 'That photo is too big. Please choose a smaller one.' });
      await cmd(['SET', 'img:' + n, JSON.stringify({ t, d })]); return out(res, 200, { ok: 1, path: '/api/img?n=' + n });
    }
    if (a === 'save') {
      const site = b.site; if (!site || typeof site !== 'object') return out(res, 200, { ok: 0, err: 'Nothing to save.' });
      const str = JSON.stringify(site); if (str.length > 900000) return out(res, 200, { ok: 0, err: 'There is too much text/content to store. Remove some items and try again.' });
      const prev = await cmd(['GET', 'site']);
      if (typeof prev === 'string' && prev) { await cmd(['LPUSH', 'hist', prev]); await cmd(['LTRIM', 'hist', 0, 9]); }
      await cmd(['SET', 'site', str]); return out(res, 200, { ok: 1 });
    }
    if (a === 'restore') {
      const p = await cmd(['LINDEX', 'hist', 0]);
      if (!p) return out(res, 200, { ok: 0, err: 'No earlier saved version found yet.' });
      return out(res, 200, { ok: 1, site: JSON.parse(p) });
    }
    return out(res, 200, { ok: 0 });
  } catch (e) { return out(res, 200, { ok: 0, err: e.message === 'store-not-configured' ? NOSTORE : (e.message || 'Server error') }); }
};
