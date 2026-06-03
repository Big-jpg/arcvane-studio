-- ArcVane Studio — B4 mock coastal product seed data.
--
-- Run against Neon after migrations and product procedures are installed:
--   psql "$DATABASE_URL" -f db/migrations/003_products_table.sql
--   psql "$DATABASE_URL" -f db/procedures/product_procedures.sql
--   psql "$DATABASE_URL" -f db/seed-products.sql
--
-- The current admin_products schema has no metadata/time_state column and the existing
-- upsert_admin_product procedure does not accept one. This seed therefore uses the
-- existing procedure exactly, then applies a guarded future-compatible update that
-- writes timeState only when a metadata JSONB or time_state text column exists.

BEGIN;

WITH seeded_products AS (
  SELECT * FROM (
    VALUES
      (
        'prod-01',
        'shell-fan',
        'Shell Fan',
        90.00::numeric,
        'AUD',
        'Single Shades',
        'A shell-ribbed shade that gathers the source into a soft perimeter glow, changing from quiet surface to luminous edge as the room darkens.',
        'Translucent shell finish with fine rib diffusion',
        'Ø 280mm × H 210mm',
        ARRAY['Clear PLA', 'Shell']::text[],
        ARRAY[
          'https://placehold.co/800x800/f5e6c8/2a1f0f?text=Shell+Fan',
          'https://placehold.co/800x800/d8ecf0/2a1f0f?text=Soft+Perimeter'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Shell Fan',
        'dawn / midday'
      ),
      (
        'prod-02',
        'coral-veil',
        'Coral Veil',
        90.00::numeric,
        'AUD',
        'Single Shades',
        'A veiled ribbed form that softens the source before it reaches the room, leaving a slow coral-like texture across nearby surfaces.',
        'Translucent ribbed diffusion finish',
        'Ø 270mm × H 220mm',
        ARRAY['Clear PLA', 'Coastal Blue']::text[],
        ARRAY[
          'https://placehold.co/800x800/d8ecf0/22343a?text=Coral+Veil',
          'https://placehold.co/800x800/f7f0df/22343a?text=Ribbed+Light'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Coral Veil',
        'midday'
      ),
      (
        'prod-03',
        'dune-rib',
        'Dune Rib',
        90.00::numeric,
        'AUD',
        'Single Shades',
        'A striated dune shade whose close ribs temper glare and turn the source into bands of sand-coloured shadow and downward warmth.',
        'Matte striated dune finish',
        'Ø 260mm × H 190mm',
        ARRAY['Sand', 'Limestone']::text[],
        ARRAY[
          'https://placehold.co/800x800/e8d7bd/2f271d?text=Dune+Rib',
          'https://placehold.co/800x800/f3ead9/2f271d?text=Matte+Ridges'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Dune Rib',
        'dawn'
      ),
      (
        'prod-04',
        'limestone-bloom',
        'Limestone Bloom',
        140.00::numeric,
        'AUD',
        'Table Lamps',
        'A complete table lamp pairing a limestone bloom shade with the tripod base, designed to pool low-heat LED light without exposing a hard source.',
        'Limestone-toned diffuser with matte tripod stand',
        'Ø 240mm × H 340mm',
        ARRAY['Limestone', 'Shell', 'Warm Amber']::text[],
        ARRAY[
          'https://placehold.co/800x800/f0e6d2/2a1f0f?text=Limestone+Bloom',
          'https://placehold.co/800x800/d7a85f/2a1f0f?text=Low+Room+Light'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Limestone Bloom',
        'evening'
      ),
      (
        'prod-05',
        'tidepool-diffuser',
        'Tidepool Diffuser',
        90.00::numeric,
        'AUD',
        'Single Shades',
        'An organic pooling form that holds brightness near the socket and lets light drift through thicker and thinner tidepool-like edges.',
        'Variable-opacity organic diffusion finish',
        'Ø 255mm × H 175mm',
        ARRAY['Clear PLA', 'Shell', 'Coastal Blue']::text[],
        ARRAY[
          'https://placehold.co/800x800/c7d7d2/1f2d2f?text=Tidepool+Diffuser',
          'https://placehold.co/800x800/40515b/f7f0df?text=Dusk+Gradient'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Tidepool Diffuser',
        'dusk / evening'
      ),
      (
        'prod-06',
        'beach-post-tripod',
        'Beach Post Tripod',
        55.00::numeric,
        'AUD',
        'Accessories',
        'A matte tripod stand with a weathered-post calm, giving compatible ArcVane shades a stable base and a grounded contrast to translucent finishes.',
        'Matte soft-touch tripod stand finish',
        'Ø 180mm footprint × H 165mm',
        ARRAY['Sand', 'Limestone']::text[],
        ARRAY[
          'https://placehold.co/800x800/e8d7bd/30261d?text=Beach+Post',
          'https://placehold.co/800x800/f5efe2/30261d?text=Tripod+Base'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Beach Post Tripod',
        'midday'
      ),
      (
        'prod-07',
        'amber-ember-set',
        'Amber Ember Set',
        120.00::numeric,
        'AUD',
        'Shade Sets',
        'A three-piece shade set tuned for additive domestic glow, allowing each layer to catch the LED differently as evening light settles in the room.',
        'Warm amber translucent diffusion finish',
        '3 shades, each approx. Ø 220–260mm × H 160–200mm',
        ARRAY['Warm Amber', 'Sand', 'Shell']::text[],
        ARRAY[
          'https://placehold.co/800x800/d99752/2a1f0f?text=Amber+Ember',
          'https://placehold.co/800x800/5a3624/f6ead5?text=Layered+Glow'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Amber Ember Set',
        'dusk / evening'
      ),
      (
        'prod-08',
        'clear-pla-coastal-set',
        'Clear PLA Coastal Set',
        150.00::numeric,
        'AUD',
        'Shade Sets',
        'A five-piece shade set exploring shell, rib, dune, and tidepool surfaces, giving one shared E27 system a quiet range of optical behaviours.',
        'Mixed translucent coastal diffusion finishes',
        '5 shades, each approx. Ø 200–280mm × H 150–220mm',
        ARRAY['Clear PLA', 'Shell', 'Limestone']::text[],
        ARRAY[
          'https://placehold.co/800x800/f7f0df/2a1f0f?text=Coastal+Set',
          'https://placehold.co/800x800/d8ecf0/2a1f0f?text=Shared+System'
        ]::text[],
        ARRAY['E27']::text[],
        true,
        'Clear PLA Coastal Set',
        'dawn / midday'
      )
  ) AS v(
    id,
    handle,
    title,
    price,
    currency,
    category,
    description,
    material,
    dimensions,
    colours,
    images,
    adapters,
    in_stock,
    design_family,
    time_state
  )
), upserted AS (
  SELECT
    upsert_admin_product(
      id,
      handle,
      title,
      price,
      currency,
      category,
      description,
      material,
      dimensions,
      colours,
      images,
      adapters,
      in_stock,
      design_family
    )
  FROM seeded_products
)
SELECT count(*) AS seeded_product_count FROM upserted;

DO $$
DECLARE
  has_metadata boolean;
  has_time_state boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_products'
      AND column_name = 'metadata'
  ) INTO has_metadata;

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_products'
      AND column_name = 'time_state'
  ) INTO has_time_state;

  IF has_metadata THEN
    EXECUTE $sql$
      WITH time_states(handle, time_state) AS (
        VALUES
          ('shell-fan', 'dawn / midday'),
          ('coral-veil', 'midday'),
          ('dune-rib', 'dawn'),
          ('limestone-bloom', 'evening'),
          ('tidepool-diffuser', 'dusk / evening'),
          ('beach-post-tripod', 'midday'),
          ('amber-ember-set', 'dusk / evening'),
          ('clear-pla-coastal-set', 'dawn / midday')
      )
      UPDATE admin_products p
      SET metadata = jsonb_set(
        COALESCE(p.metadata, '{}'::jsonb),
        '{timeState}',
        to_jsonb(ts.time_state),
        true
      )
      FROM time_states ts
      WHERE p.handle = ts.handle
    $sql$;
  END IF;

  IF has_time_state THEN
    EXECUTE $sql$
      WITH time_states(handle, time_state) AS (
        VALUES
          ('shell-fan', 'dawn / midday'),
          ('coral-veil', 'midday'),
          ('dune-rib', 'dawn'),
          ('limestone-bloom', 'evening'),
          ('tidepool-diffuser', 'dusk / evening'),
          ('beach-post-tripod', 'midday'),
          ('amber-ember-set', 'dusk / evening'),
          ('clear-pla-coastal-set', 'dawn / midday')
      )
      UPDATE admin_products p
      SET time_state = ts.time_state
      FROM time_states ts
      WHERE p.handle = ts.handle
    $sql$;
  END IF;
END $$;

COMMIT;
