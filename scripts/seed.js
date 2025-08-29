const { pool } = require('../lib/db');
const { deterministicId } = require('../lib/hash');
async function seed() {
  const client = await pool.connect();
  try {
    const events = [
  {
    site: 'siteA',
    type: 'sent',
    user_id: 'u1',
    email: 'user1@example.com',
    timestamp: new Date().toISOString(),
    metadata: { campaign: 'camp123' }
  },
  {
    site: 'siteA',
    type: 'open',
    user_id: 'u1',
    email: 'user1@example.com',
    timestamp: new Date().toISOString(),
    metadata: { ip: '127.0.0.1' }
  }
];

    const values = [];
    const params = [];
    let idx = 1;
    for (const e of events) {
      const event_id = deterministicId(e);
      params.push(event_id, e.site, e.type, e.user_id, e.timestamp);
      values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
    }
    const q = `INSERT INTO events (event_id, site, type, user_id, occurred_at) VALUES ${values.join(', ')} ON CONFLICT (site, event_id) DO NOTHING`;
    await client.query(q, params);
    console.log('Seed done');
  } finally {
    client.release();
    await pool.end();
  }
}
seed().catch(err => { console.error(err); process.exit(1); });