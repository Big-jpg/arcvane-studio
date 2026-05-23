-- db/procedures/product_procedures.sql
-- ArcVane Studio — Admin-Lite product catalogue stored procedures.

BEGIN;

CREATE OR REPLACE FUNCTION list_admin_products()
RETURNS TABLE (
  id TEXT,
  handle TEXT,
  title TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  category TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  colours TEXT[],
  images TEXT[],
  adapters TEXT[],
  in_stock BOOLEAN,
  design_family TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.handle,
    p.title,
    p.price,
    p.currency,
    p.category,
    p.description,
    p.material,
    p.dimensions,
    p.colours,
    p.images,
    p.adapters,
    p.in_stock,
    p.design_family,
    p.created_at,
    p.updated_at
  FROM admin_products p
  ORDER BY p.category ASC, p.title ASC;
$$;

CREATE OR REPLACE FUNCTION get_admin_product(p_id TEXT)
RETURNS TABLE (
  id TEXT,
  handle TEXT,
  title TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  category TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  colours TEXT[],
  images TEXT[],
  adapters TEXT[],
  in_stock BOOLEAN,
  design_family TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.handle,
    p.title,
    p.price,
    p.currency,
    p.category,
    p.description,
    p.material,
    p.dimensions,
    p.colours,
    p.images,
    p.adapters,
    p.in_stock,
    p.design_family,
    p.created_at,
    p.updated_at
  FROM admin_products p
  WHERE p.id = p_id;
$$;

CREATE OR REPLACE FUNCTION get_admin_product_by_handle(p_handle TEXT)
RETURNS TABLE (
  id TEXT,
  handle TEXT,
  title TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  category TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  colours TEXT[],
  images TEXT[],
  adapters TEXT[],
  in_stock BOOLEAN,
  design_family TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.handle,
    p.title,
    p.price,
    p.currency,
    p.category,
    p.description,
    p.material,
    p.dimensions,
    p.colours,
    p.images,
    p.adapters,
    p.in_stock,
    p.design_family,
    p.created_at,
    p.updated_at
  FROM admin_products p
  WHERE p.handle = p_handle;
$$;

CREATE OR REPLACE FUNCTION upsert_admin_product(
  p_id TEXT,
  p_handle TEXT,
  p_title TEXT,
  p_price NUMERIC,
  p_currency TEXT,
  p_category TEXT,
  p_description TEXT,
  p_material TEXT,
  p_dimensions TEXT,
  p_colours TEXT[],
  p_images TEXT[],
  p_adapters TEXT[],
  p_in_stock BOOLEAN,
  p_design_family TEXT
)
RETURNS TABLE (
  id TEXT,
  handle TEXT,
  title TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  category TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  colours TEXT[],
  images TEXT[],
  adapters TEXT[],
  in_stock BOOLEAN,
  design_family TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_id IS NULL OR btrim(p_id) = '' THEN
    RAISE EXCEPTION 'Product id is required.' USING ERRCODE = 'P0001';
  END IF;

  IF p_handle IS NULL OR btrim(p_handle) = '' THEN
    RAISE EXCEPTION 'Product handle is required.' USING ERRCODE = 'P0001';
  END IF;

  IF p_title IS NULL OR btrim(p_title) = '' THEN
    RAISE EXCEPTION 'Product title is required.' USING ERRCODE = 'P0001';
  END IF;

  IF p_price IS NULL OR p_price < 0 THEN
    RAISE EXCEPTION 'Product price must be non-negative.' USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
  INSERT INTO admin_products (
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
  VALUES (
    btrim(p_id),
    btrim(p_handle),
    btrim(p_title),
    p_price,
    upper(COALESCE(NULLIF(btrim(p_currency), ''), 'AUD')),
    btrim(p_category),
    COALESCE(p_description, ''),
    COALESCE(p_material, ''),
    COALESCE(p_dimensions, ''),
    COALESCE(p_colours, '{}'),
    COALESCE(p_images, '{}'),
    COALESCE(p_adapters, '{}'),
    COALESCE(p_in_stock, true),
    NULLIF(btrim(COALESCE(p_design_family, '')), '')
  )
  ON CONFLICT (id) DO UPDATE SET
    handle = EXCLUDED.handle,
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    colours = EXCLUDED.colours,
    images = EXCLUDED.images,
    adapters = EXCLUDED.adapters,
    in_stock = EXCLUDED.in_stock,
    design_family = EXCLUDED.design_family,
    updated_at = now()
  RETURNING
    admin_products.id,
    admin_products.handle,
    admin_products.title,
    admin_products.price,
    admin_products.currency,
    admin_products.category,
    admin_products.description,
    admin_products.material,
    admin_products.dimensions,
    admin_products.colours,
    admin_products.images,
    admin_products.adapters,
    admin_products.in_stock,
    admin_products.design_family,
    admin_products.created_at,
    admin_products.updated_at;
END;
$$;

CREATE OR REPLACE FUNCTION delete_admin_product(p_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM admin_products p WHERE p.id = p_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

CREATE OR REPLACE FUNCTION toggle_admin_product_stock(p_id TEXT, p_in_stock BOOLEAN)
RETURNS TABLE (
  id TEXT,
  handle TEXT,
  title TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  category TEXT,
  description TEXT,
  material TEXT,
  dimensions TEXT,
  colours TEXT[],
  images TEXT[],
  adapters TEXT[],
  in_stock BOOLEAN,
  design_family TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE admin_products p
  SET in_stock = COALESCE(p_in_stock, p.in_stock),
      updated_at = now()
  WHERE p.id = p_id
  RETURNING
    p.id,
    p.handle,
    p.title,
    p.price,
    p.currency,
    p.category,
    p.description,
    p.material,
    p.dimensions,
    p.colours,
    p.images,
    p.adapters,
    p.in_stock,
    p.design_family,
    p.created_at,
    p.updated_at;
END;
$$;

COMMIT;
