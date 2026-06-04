from pathlib import Path

repo = Path('/home/ubuntu/arcvane-studio')

# 1. Shared product type: optional in-memory/storefront fields only.
types_path = repo / 'lib/types.ts'
types = types_path.read_text()
if 'export type ProductTimeState =' not in types:
    types = types.replace(
        'export type ProductCategory =\n  | "Table Lamps"\n  | "Shade Sets"\n  | "Single Shades"\n  | "Coastal Forms"\n  | "Experimental Drops"\n  | "Accessories";\n',
        'export type ProductCategory =\n  | "Table Lamps"\n  | "Shade Sets"\n  | "Single Shades"\n  | "Coastal Forms"\n  | "Experimental Drops"\n  | "Accessories";\n\nexport type ProductTimeState =\n  | "dawn"\n  | "midday"\n  | "dusk"\n  | "evening"\n  | "dawn / midday"\n  | "dusk / evening";\n',
    )
if 'timeState?: ProductTimeState;' not in types:
    types = types.replace(
        '  description: string;\n  material: string;\n',
        '  description: string;\n  /** Optional storefront association for the time-state palette this product suits best. */\n  timeState?: ProductTimeState;\n  /** Optional one-line material/light behaviour note for restrained product cards. */\n  behaviourNote?: string;\n  material: string;\n',
    )
types_path.write_text(types)

# 2. Mock products: add timeState and behaviourNote after each description.
mock_path = repo / 'lib/mock-products.ts'
mock = mock_path.read_text()
replacements = {
    'description:\n      "A shell-ribbed shade that gathers the source into a soft perimeter glow, changing from quiet surface to luminous edge as the room darkens.",\n    material:': 'description:\n      "A shell-ribbed shade that gathers the source into a soft perimeter glow, changing from quiet surface to luminous edge as the room darkens.",\n    timeState: "dawn / midday",\n    behaviourNote: "Translucent ribs keep the source bright but softened.",\n    material:',
    'description:\n      "A veiled ribbed form that softens the source before it reaches the room, leaving a slow coral-like texture across nearby surfaces.",\n    material:': 'description:\n      "A veiled ribbed form that softens the source before it reaches the room, leaving a slow coral-like texture across nearby surfaces.",\n    timeState: "midday",\n    behaviourNote: "Fine ribs spread clear daylight into a quieter field.",\n    material:',
    'description:\n      "A striated dune shade whose close ribs temper glare and turn the source into bands of sand-coloured shadow and downward warmth.",\n    material:': 'description:\n      "A striated dune shade whose close ribs temper glare and turn the source into bands of sand-coloured shadow and downward warmth.",\n    timeState: "dawn",\n    behaviourNote: "Matte ridges hold glare down and make shadow legible.",\n    material:',
    'description:\n      "A complete table lamp pairing a limestone bloom shade with the tripod base, designed to pool low-heat LED light without exposing a hard source.",\n    material:': 'description:\n      "A complete table lamp pairing a limestone bloom shade with the tripod base, designed to pool low-heat LED light without exposing a hard source.",\n    timeState: "evening",\n    behaviourNote: "A complete lamp for low, settled room light.",\n    material:',
    'description:\n      "An organic pooling form that holds brightness near the socket and lets light drift through thicker and thinner tidepool-like edges.",\n    material:': 'description:\n      "An organic pooling form that holds brightness near the socket and lets light drift through thicker and thinner tidepool-like edges.",\n    timeState: "dusk / evening",\n    behaviourNote: "Variable walls turn the bulb into a slower gradient.",\n    material:',
    'description:\n      "A matte tripod stand with a weathered-post calm, giving compatible ArcVane shades a stable base and a grounded contrast to translucent finishes.",\n    material:': 'description:\n      "A matte tripod stand with a weathered-post calm, giving compatible ArcVane shades a stable base and a grounded contrast to translucent finishes.",\n    timeState: "midday",\n    behaviourNote: "A neutral base that lets shade material carry the light.",\n    material:',
    'description:\n      "A three-piece shade set tuned for additive domestic glow, allowing each layer to catch the LED differently as evening light settles in the room.",\n    material:': 'description:\n      "A three-piece shade set tuned for additive domestic glow, allowing each layer to catch the LED differently as evening light settles in the room.",\n    timeState: "dusk / evening",\n    behaviourNote: "Layered amber forms build warmth as the room dims.",\n    material:',
    'description:\n      "A five-piece shade set exploring shell, rib, dune, and tidepool surfaces, giving one shared E27 system a quiet range of optical behaviours.",\n    material:': 'description:\n      "A five-piece shade set exploring shell, rib, dune, and tidepool surfaces, giving one shared E27 system a quiet range of optical behaviours.",\n    timeState: "dawn / midday",\n    behaviourNote: "A shared system for testing translucent daylight behaviour.",\n    material:',
}
for old, new in replacements.items():
    if old in mock and new not in mock:
        mock = mock.replace(old, new)
mock_path.write_text(mock)

# 3. Product listing: add time-state formatter and restrained card metadata.
products_path = repo / 'app/products/page.tsx'
products_page = products_path.read_text()
if 'function formatTimeState' not in products_page:
    products_page = products_page.replace(
        'function formatPrice(product: Product) {\n',
        'function formatTimeState(timeState?: Product["timeState"]) {\n  if (!timeState) {\n    return null;\n  }\n\n  return timeState\n    .split(" / ")\n    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))\n    .join(" / ");\n}\n\nfunction formatPrice(product: Product) {\n',
    )
# Robust text replacements for existing cards.
products_page = products_page.replace('{product.category}', '{formatTimeState(product.timeState) ?? product.category}')
products_page = products_page.replace('{product.description}', '{product.behaviourNote ?? product.description}')
products_path.write_text(products_page)

# 4. Homepage preview grid: remove synthetic notes and read per-product fields.
home_path = repo / 'app/page.tsx'
home = home_path.read_text()
start = home.find('const productPreviewNotes = [')
if start != -1:
    end = home.find('];', start) + 3
    home = home[:start] + 'function formatTimeState(timeState?: Product["timeState"]) {\n  if (!timeState) {\n    return null;\n  }\n\n  return timeState\n    .split(" / ")\n    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))\n    .join(" / ");\n}\n\n' + home[end:].lstrip('\n')
home = home.replace('              {previewProducts.map((product, index) => {\n                const note = productPreviewNotes[index % productPreviewNotes.length];\n\n                return (\n', '              {previewProducts.map((product) => (\n')
home = home.replace('                  </article>\n                );\n              })}', '                  </article>\n                ))}')
home = home.replace('{note.timeState}', '{formatTimeState(product.timeState) ?? product.category}')
home = home.replace('{note.behaviour}', '{product.behaviourNote ?? product.description}')
home_path.write_text(home)

# 5. Product detail: add formatter and a quiet badge near product title if optional value exists.
detail_path = repo / 'components/product-detail.tsx'
detail = detail_path.read_text()
if 'function formatTimeState' not in detail:
    detail = detail.replace(
        'function formatPrice(product: Product) {\n',
        'function formatTimeState(timeState?: Product["timeState"]) {\n  if (!timeState) {\n    return null;\n  }\n\n  return timeState\n    .split(" / ")\n    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))\n    .join(" / ");\n}\n\nfunction formatPrice(product: Product) {\n',
    )
if 'const productTimeState = formatTimeState(product.timeState);' not in detail:
    detail = detail.replace(
        '  const primaryImage = product.images[0];\n',
        '  const primaryImage = product.images[0];\n  const productTimeState = formatTimeState(product.timeState);\n',
    )
# Insert after category pill if not present.
if 'Best in {productTimeState}' not in detail:
    detail = detail.replace(
        '              {product.category}\n            </span>\n',
        '              {product.category}\n            </span>\n            {productTimeState ? (\n              <span className="inline-flex rounded-full border border-ts-accent/25 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-ts-muted">\n                Best in {productTimeState}\n              </span>\n            ) : null}\n',
    )
detail_path.write_text(detail)

# 6. Seed SQL: existing procedure only; timeState stored via guarded future-compatible metadata/time_state updates.
seed_path = repo / 'db/seed-products.sql'
seed = """-- ArcVane Studio — B4 mock coastal product seed data.
--
-- Run against Neon after migrations and product procedures are installed:
--   psql \"$DATABASE_URL\" -f db/migrations/003_products_table.sql
--   psql \"$DATABASE_URL\" -f db/procedures/product_procedures.sql
--   psql \"$DATABASE_URL\" -f db/seed-products.sql
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
"""
seed_path.write_text(seed)
