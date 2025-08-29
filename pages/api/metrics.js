const { pool } = require('../../lib/db');
const { requireApiKey } = require('../../lib/auth');
export default async function handler(req, res) {
  if (!requireApiKey(req, res)) return;
  try {
    const [{ count }] = (await pool.query('SELECT count(*) FROM events')).rows;
    const [{ count: today }] = (await pool.query("SELECT count(*) FROM events WHERE occurred_at >= date_trunc('day', now())")).rows;
    res.json({ total_events: Number(count), events_today: Number(today) });
  } catch (err) {
    res.status(500).json({ error: 'db error' });
  }
}