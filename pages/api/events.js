const { pool } = require('../../lib/db');
const { requireApiKey } = require('../../lib/auth');
const { deterministicId } = require('../../lib/hash');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!requireApiKey(req, res)) return;

  const body = req.body;
  if (!body || !Array.isArray(body.events)) {
    return res.status(400).json({ error: 'invalid body, expected { events: [] }' });
  }

  const events = [];
  const errors = [];

  for (const [i, ev] of body.events.entries()) {
    try {
      if (!ev.site || !ev.type) {
        throw new Error("missing required fields: site and type");
      }
      events.push({
        event_id: ev.id || deterministicId(ev),
        site: ev.site,
        type: ev.type,
        user_id: ev.user_id || ev.email || null,
        email: ev.email || null,
        metadata: ev.metadata ? JSON.stringify(ev.metadata) : null,
        occurred_at: ev.timestamp || ev.occurred_at || new Date().toISOString()
      });
    } catch (err) {
      errors.push({ index: i, error: err.message });
    }
  }

  if (events.length === 0) {
    return res.status(400).json({ processed: 0, duplicates: 0, errors });
  }

  const params = [];
  const rows = [];
  let idx = 1;
  for (const e of events) {
    params.push(
      e.event_id,
      e.site,
      e.type,
      e.user_id,
      e.email,
      e.metadata,
      e.occurred_at
    );
    rows.push(
      `($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`
    );
  }

  const sql = `
    INSERT INTO events (event_id, site, type, user_id, email, metadata, occurred_at)
    VALUES ${rows.join(', ')}
    ON CONFLICT (site, event_id) DO NOTHING
    RETURNING id
  `;

  try {
    const { rows: inserted } = await pool.query(sql, params);

    const processed = events.length;
    const insertedCount = inserted.length;
    const duplicates = processed - insertedCount;

    res.status(201).json({
      processed,
      duplicates,
      errors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
}

