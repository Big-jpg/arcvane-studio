-- db/migrations/004_accessories.sql
-- ArcVane Studio — Accessory products (LED bulbs, cords).
-- These are sold at cost as enablers, not profit centres.
BEGIN;

CREATE TABLE IF NOT EXISTS accessories (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  colour_temp TEXT,
  kelvin INTEGER,
  specs TEXT[] NOT NULL DEFAULT '{}',
  benefit TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  fitting TEXT NOT NULL DEFAULT 'E27',
  source_ref TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accessories_handle ON accessories(handle);
CREATE INDEX IF NOT EXISTS idx_accessories_fitting ON accessories(fitting);

-- Seed the three DiCUNO E27 corn bulb variants
INSERT INTO accessories (id, handle, title, subtitle, price, currency, colour_temp, kelvin, specs, benefit, image, fitting, source_ref, in_stock)
VALUES
  (
    'acc-bulb-2700k',
    'led-corn-bulb-e27-2700k',
    'LED Corn Bulb — Warm White',
    '2700K · Soft evening glow',
    9.00,
    'AUD',
    'Warm White',
    2700,
    ARRAY['10W', '1400lm', '84 LEDs', '360° beam', 'CRI 85+', 'E27']::text[],
    'Soft amber tone that complements evening and dusk time-states. Uniform diffusion through translucent shade surfaces.',
    '/accessories/bulb-2700k.svg',
    'E27',
    'DiCUNO E27 10W 2700K (Amazon AU)',
    true
  ),
  (
    'acc-bulb-4000k',
    'led-corn-bulb-e27-4000k',
    'LED Corn Bulb — Natural White',
    '4000K · Balanced daylight clarity',
    9.00,
    'AUD',
    'Natural White',
    4000,
    ARRAY['10W', '1400lm', '84 LEDs', '360° beam', 'CRI 85+', 'E27']::text[],
    'Neutral tone that reveals true material colour. Ideal for midday time-states and showcasing finish detail.',
    '/accessories/bulb-4000k.svg',
    'E27',
    'DiCUNO E27 10W 4000K (Amazon AU)',
    true
  ),
  (
    'acc-bulb-6000k',
    'led-corn-bulb-e27-6000k',
    'LED Corn Bulb — Daylight White',
    '6000K · Stark bright clarity',
    9.00,
    'AUD',
    'Daylight White',
    6000,
    ARRAY['10W', '1400lm', '84 LEDs', '360° beam', 'CRI 85+', 'E27']::text[],
    'Crisp white that maximises contrast through patterned shades. Best for task lighting and dawn time-states.',
    '/accessories/bulb-6000k.svg',
    'E27',
    'DiCUNO E27 10W 6000K (Amazon AU)',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  price = EXCLUDED.price,
  colour_temp = EXCLUDED.colour_temp,
  kelvin = EXCLUDED.kelvin,
  specs = EXCLUDED.specs,
  benefit = EXCLUDED.benefit,
  image = EXCLUDED.image,
  fitting = EXCLUDED.fitting,
  source_ref = EXCLUDED.source_ref,
  in_stock = EXCLUDED.in_stock,
  updated_at = now();

COMMIT;
