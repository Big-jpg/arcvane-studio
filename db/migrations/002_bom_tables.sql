-- ArcVane Studio — BOM Tables
-- Run after the initial schema: psql $DATABASE_URL -f db/migrations/002_bom_tables.sql
-- Requires PostgreSQL 13+ (gen_random_uuid())

BEGIN;

-- =============================================================================
-- Extension
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Components registry
-- =============================================================================

CREATE TABLE IF NOT EXISTS bom_components (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  category    text NOT NULL,
  unit        text NOT NULL DEFAULT 'each',
  unit_cost   numeric(10,2) NOT NULL DEFAULT 0,
  supplier    text,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- Product BOM lines
-- =============================================================================

CREATE TABLE IF NOT EXISTS bom_lines (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       text NOT NULL,
  component_id     uuid NOT NULL REFERENCES bom_components(id) ON DELETE CASCADE,
  line_type        text NOT NULL DEFAULT 'material',
  quantity         numeric(10,4) NOT NULL DEFAULT 1,
  wastage_percent  numeric(5,2) NOT NULL DEFAULT 0,
  notes            text,
  sort_order       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_bom_lines_product ON bom_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_bom_lines_component ON bom_lines(component_id);

COMMIT;
