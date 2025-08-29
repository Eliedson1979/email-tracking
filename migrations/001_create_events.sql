CREATE TABLE IF NOT EXISTS migrations_run (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  ran_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  site TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sent','open','click')),
  user_id TEXT,
  email TEXT,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_events_site_eventid ON events (site, event_id);
CREATE INDEX IF NOT EXISTS ix_events_occurred_at ON events (occurred_at);
CREATE INDEX IF NOT EXISTS ix_events_site ON events (site);