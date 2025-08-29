const { pool } = require('../../../lib/db');
const { requireApiKey } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  if (!requireApiKey(req, res)) return;

  const { site, type, email, campaign_id, group_by } = req.query;

  // filtros dinâmicos
  const filters = [];
  const params = [];
  let idx = 1;

  if (site) {
    filters.push(`site = $${idx++}`);
    params.push(site);
  }
  if (type) {
    filters.push(`type = $${idx++}`);
    params.push(type);
  }
  if (email) {
    filters.push(`email = $${idx++}`);
    params.push(email);
  }
  if (campaign_id) {
    filters.push(`metadata->>'campaign_id' = $${idx++}`);
    params.push(campaign_id);
  }

  // agrupamento dinâmico
  let extraGroup = '';
  let extraSelect = '';
  if (group_by === 'email') {
    extraSelect = ', email';
    extraGroup = ', email';
  } else if (group_by === 'campaign_id') {
    extraSelect = `, metadata->>'campaign_id' as campaign_id`;
    extraGroup = `, metadata->>'campaign_id'`;
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const sql = `
    SELECT 
      date_trunc('day', occurred_at)::date AS day,
      site,
      type
      ${extraSelect},
      count(*)::int as count
    FROM events
    ${where}
    GROUP BY day, site, type ${extraGroup}
    ORDER BY day DESC, site
  `;

  try {
    const { rows } = await pool.query(sql, params);

    // Estrutura de saída
    const out = {};
    for (const r of rows) {
      const d = r.day.toISOString().slice(0, 10);
      out[d] = out[d] || {};
      out[d][r.site] = out[d][r.site] || {};

      if (group_by === 'email') {
        out[d][r.site][r.email] = out[d][r.site][r.email] || {};
        out[d][r.site][r.email][r.type] = r.count;
      } else if (group_by === 'campaign_id') {
        const cid = r.campaign_id || 'unknown';
        out[d][r.site][cid] = out[d][r.site][cid] || {};
        out[d][r.site][cid][r.type] = r.count;
      } else {
        out[d][r.site][r.type] = r.count;
      }
    }

    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
}
