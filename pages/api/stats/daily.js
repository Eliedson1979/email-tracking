const { pool } = require('../../../lib/db');
const { requireApiKey } = require('../../../lib/auth');
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!requireApiKey(req, res)) return;
  const sql = `
    SELECT date_trunc('day', occurred_at)::date AS day, site, type, count(*)::int as count
    FROM events
    GROUP BY day, site, type
    ORDER BY day DESC, site
  `;
  try {
    const { rows } = await pool.query(sql);
    const out = {};
    for (const r of rows) {
      const d = r.day.toISOString().slice(0,10);
      out[d] = out[d] || {};
      out[d][r.site] = out[d][r.site] || {};
      out[d][r.site][r.type] = r.count;
    }
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
}