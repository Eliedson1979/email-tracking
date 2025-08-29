const { pool } = require('../../lib/db');
const { requireApiKey } = require('../../lib/auth');
const { deterministicId } = require('../../lib/hash');
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!requireApiKey(req, res)) return;
  const body = req.body;
  if (!body || !Array.isArray(body.events)) return res.status(400).json({ error: 'invalid body, expected { events: [] }' });
  const events = body.events.map(ev => ({
    event_id: ev.id || deterministicId(ev),
    site: ev.site,
    type: ev.type,
    user_id: ev.user_id || null,
    occurred_at: ev.timestamp || ev.occurred_at || new Date().toISOString()
  }));
  const params = [];
  const rows = [];
  let idx = 1;
  for (const e of events) {
    params.push(e.event_id, e.site, e.type, e.user_id, e.occurred_at);
    rows.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
  }
  const sql = `INSERT INTO events (event_id, site, type, user_id, occurred_at) VALUES ${rows.join(', ')} ON CONFLICT (site, event_id) DO NOTHING RETURNING id`;
  try {
    const { rows: inserted } = await pool.query(sql, params);
    res.status(201).json({ inserted: inserted.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
}