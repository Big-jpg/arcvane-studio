-- db/migrations/003_products_table.sql
-- ArcVane Studio — Admin-Lite product catalogue table.

BEGIN;

CREATE TABLE IF NOT EXISTS admin_products (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  material TEXT NOT NULL DEFAULT '',
  dimensions TEXT NOT NULL DEFAULT '',
  colours TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  adapters TEXT[] NOT NULL DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  design_family TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_products_handle ON admin_products(handle);
CREATE INDEX IF NOT EXISTS idx_admin_products_category ON admin_products(category);

COMMIT;
