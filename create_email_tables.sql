CREATE TABLE email_lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  active_subscribers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  historical_subscriber_counts INTEGER[] DEFAULT '{}'
);

CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  status TEXT CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')) NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_engagement TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  list_ids TEXT[] NOT NULL,
  engagement_score INTEGER DEFAULT 0
);

CREATE INDEX idx_subscribers_list_ids ON subscribers USING GIN (list_ids);
