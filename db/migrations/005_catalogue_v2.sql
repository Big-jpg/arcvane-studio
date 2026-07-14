-- ArcVane Studio — Catalogue V2: publish state, variants, normalized media, and order lineage.
-- This migration is additive and preserves the existing admin_products identifiers and image arrays.

BEGIN;

ALTER TABLE admin_products
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS time_state TEXT,
  ADD COLUMN IF NOT EXISTS behaviour_note TEXT,
  ADD COLUMN IF NOT EXISTS component_scope JSONB,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

UPDATE admin_products
SET status = CASE WHEN in_stock THEN 'active' ELSE 'draft' END
WHERE status = 'draft' AND archived_at IS NULL;

WITH product_content(handle, time_state, behaviour_note) AS (
  VALUES
    ('shell-fan', 'dawn / midday', 'Translucent ribs keep a compatible LED bright but softened.'),
    ('coral-veil', 'midday', 'Fine ribs spread clear daylight into a quieter field.'),
    ('dune-rib', 'dawn', 'Matte ridges hold glare down and make shadow legible.'),
    ('limestone-bloom', 'evening', 'A shade-and-stand form for low, settled room light.'),
    ('tidepool-diffuser', 'dusk / evening', 'Variable walls turn a compatible LED bulb into a slower gradient.'),
    ('beach-post-tripod', 'midday', 'A neutral base that lets shade material carry the light.'),
    ('amber-ember-set', 'dusk / evening', 'Layered amber forms build warmth as the room dims.'),
    ('clear-pla-coastal-set', 'dawn / midday', 'A shared shade set for testing translucent daylight behaviour.')
)
UPDATE admin_products p
SET time_state = COALESCE(p.time_state, product_content.time_state),
    behaviour_note = COALESCE(p.behaviour_note, product_content.behaviour_note)
FROM product_content
WHERE p.handle = product_content.handle;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_products_status_check'
  ) THEN
    ALTER TABLE admin_products
      ADD CONSTRAINT admin_products_status_check
      CHECK (status IN ('draft', 'active', 'archived'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_products_time_state_check'
  ) THEN
    ALTER TABLE admin_products
      ADD CONSTRAINT admin_products_time_state_check
      CHECK (
        time_state IS NULL OR time_state IN (
          'dawn', 'midday', 'dusk', 'evening', 'dawn / midday', 'dusk / evening'
        )
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_products_status ON admin_products(status);

CREATE TABLE IF NOT EXISTS product_variants (
  id                  TEXT PRIMARY KEY,
  product_id          TEXT NOT NULL REFERENCES admin_products(id) ON DELETE CASCADE,
  sku                 TEXT UNIQUE,
  title               TEXT NOT NULL,
  finish              TEXT NOT NULL,
  price               NUMERIC(10,2),
  currency            TEXT NOT NULL DEFAULT 'AUD',
  adapters            TEXT[] NOT NULL DEFAULT '{}',
  in_stock            BOOLEAN NOT NULL DEFAULT true,
  inventory_quantity  INTEGER,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  archived_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, finish)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id
  ON product_variants(product_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_variants_in_stock
  ON product_variants(in_stock);

CREATE TABLE IF NOT EXISTS product_media (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        TEXT NOT NULL REFERENCES admin_products(id) ON DELETE CASCADE,
  variant_id        TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  blob_url          TEXT NOT NULL UNIQUE,
  blob_path         TEXT,
  alt_text          TEXT NOT NULL,
  role              TEXT NOT NULL DEFAULT 'gallery',
  lighting_state    TEXT,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  is_primary        BOOLEAN NOT NULL DEFAULT false,
  width             INTEGER,
  height            INTEGER,
  byte_size         BIGINT,
  mime_type         TEXT,
  checksum_sha256   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at       TIMESTAMPTZ,
  CONSTRAINT product_media_role_check
    CHECK (role IN ('hero', 'gallery', 'detail', 'lifestyle')),
  CONSTRAINT product_media_lighting_state_check
    CHECK (lighting_state IS NULL OR lighting_state IN ('unlit', 'illuminated')),
  CONSTRAINT product_media_dimensions_check
    CHECK ((width IS NULL OR width > 0) AND (height IS NULL OR height > 0)),
  CONSTRAINT product_media_byte_size_check
    CHECK (byte_size IS NULL OR byte_size > 0)
);

CREATE INDEX IF NOT EXISTS idx_product_media_product
  ON product_media(product_id, sort_order)
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_media_variant
  ON product_media(variant_id, sort_order)
  WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_product_media_checksum
  ON product_media(checksum_sha256)
  WHERE checksum_sha256 IS NOT NULL;

INSERT INTO product_variants (
  id, product_id, sku, title, finish, price, currency, adapters, in_stock, sort_order
)
SELECT
  p.id || '-finish-' || finish.ordinality::text,
  p.id,
  upper(regexp_replace(p.handle, '[^a-zA-Z0-9]+', '-', 'g')) || '-' ||
    upper(regexp_replace(finish.value, '[^a-zA-Z0-9]+', '-', 'g')),
  finish.value,
  finish.value,
  p.price,
  p.currency,
  p.adapters,
  p.in_stock,
  finish.ordinality::integer * 10
FROM admin_products p
CROSS JOIN LATERAL unnest(p.colours) WITH ORDINALITY AS finish(value, ordinality)
ON CONFLICT (product_id, finish) DO NOTHING;

INSERT INTO product_media (
  product_id, variant_id, blob_url, alt_text, role, lighting_state, sort_order, is_primary
)
SELECT
  p.id,
  v.id,
  image.value,
  p.title || ' — ' || COALESCE(v.finish, 'product') || ' — ' ||
    CASE WHEN image.ordinality % 2 = 1 THEN 'unlit' ELSE 'illuminated' END,
  CASE WHEN image.ordinality = 1 THEN 'hero' ELSE 'gallery' END,
  CASE WHEN image.ordinality % 2 = 1 THEN 'unlit' ELSE 'illuminated' END,
  image.ordinality::integer * 10,
  image.ordinality = 1
FROM admin_products p
CROSS JOIN LATERAL unnest(p.images) WITH ORDINALITY AS image(value, ordinality)
LEFT JOIN product_variants v
  ON v.product_id = p.id
 AND v.sort_order = (((image.ordinality - 1) / 2) + 1)::integer * 10
WHERE NULLIF(btrim(image.value), '') IS NOT NULL
ON CONFLICT (blob_url) DO NOTHING;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS catalogue_product_id TEXT REFERENCES admin_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS catalogue_variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_media_id UUID REFERENCES product_media(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_handle TEXT,
  ADD COLUMN IF NOT EXISTS sku TEXT;

CREATE INDEX IF NOT EXISTS idx_order_items_catalogue_product_id
  ON order_items(catalogue_product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_catalogue_variant_id
  ON order_items(catalogue_variant_id);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS refunded_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

COMMIT;
