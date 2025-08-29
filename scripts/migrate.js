const fs = require('fs');
const path = require('path');
const { pool } = require('../lib/db');
async function run() {
  const client = await pool.connect();
  try {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    await client.query(`CREATE TABLE IF NOT EXISTS migrations_run (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, ran_at TIMESTAMPTZ DEFAULT now());`);
    const res = await client.query('SELECT name FROM migrations_run');
    const run = new Set(res.rows.map(r => r.name));
    for (const file of files) {
      if (run.has(file)) continue;
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log('Running', file);
      await client.query(sql);
      await client.query('INSERT INTO migrations_run (name) VALUES ($1)', [file]);
    }
    console.log('Migrations finished');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}
run();