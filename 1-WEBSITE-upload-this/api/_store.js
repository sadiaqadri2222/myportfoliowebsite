// Tiny client for a free Upstash Redis database (added from Vercel's Storage tab). No packages needed.
const E = process.env;
const pick = (re, ex) => { const k = Object.keys(E).find(k => re.test(k) && !(ex && ex.test(k)) && E[k]); return k ? E[k] : ''; };
const URL_ = E.UPSTASH_REDIS_REST_URL || E.KV_REST_API_URL || pick(/(REST_API_URL|REDIS_REST_URL)$/);
const TOKEN = E.UPSTASH_REDIS_REST_TOKEN || E.KV_REST_API_TOKEN || pick(/(REST_API_TOKEN|REDIS_REST_TOKEN)$/, /READ_ONLY/);
async function cmd(a) {
  if (!URL_ || !TOKEN) throw new Error('store-not-configured');
  const r = await fetch(URL_, { method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(a) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || 'Storage error ' + r.status);
  return j.result;
}
module.exports = { cmd, TOKEN, configured: !!(URL_ && TOKEN) };
