-- Migration: Create subscribers table for newsletter subscriptions
CREATE TABLE IF NOT EXISTS subscribers (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT    NOT NULL,
  email            TEXT    NOT NULL UNIQUE,
  destinations     TEXT,                              -- JSON array: ["Rinjani", "Gili"]
  newsletter_types TEXT,                              -- JSON array: ["Promotions", "Updates"]
  privacy_accepted INTEGER NOT NULL DEFAULT 0,        -- boolean: 1 = accepted
  subscribed_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  ip_address       TEXT,                              -- optional: for rate limiting / audit
  locale           TEXT                               -- language at time of subscription
);

-- Index for fast duplicate checks
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
