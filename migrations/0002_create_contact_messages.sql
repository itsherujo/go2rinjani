-- Migration: Create contact_messages table for contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name    TEXT    NOT NULL,
  last_name     TEXT    NOT NULL,
  email         TEXT    NOT NULL,
  phone         TEXT    NOT NULL,
  message       TEXT,
  submitted_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  locale        TEXT
);
