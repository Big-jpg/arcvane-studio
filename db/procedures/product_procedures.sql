-- db/procedures/product_procedures.sql
-- ArcVane Studio — Admin-Lite product catalogue stored procedures.
-- Fixed: resolved "column reference is ambiguous" error in upsert/append/toggle
-- functions by using SETOF record pattern with explicit column selection.

BEGIN;

-- ---------------------------------------------------------------------------
-- list_admin_products: return all products ordered by category, title
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- get_admin_product: get single product by id
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- get_admin_product_by_handle: get single product by handle
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- upsert_admin_product: insert or update a product
-- Fixed: use a CTE to avoid PL/pgSQL variable name collision with RETURNING
-- ---------------------------------------------------------------------------
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
#variable_conflict use_column
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
    COALESCE(p_colours, ARRAY[]::TEXT[]),
    COALESCE(p_images, ARRAY[]::TEXT[]),
    COALESCE(p_adapters, ARRAY[]::TEXT[]),
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

-- ---------------------------------------------------------------------------
-- append_admin_product_image: add an image URL to a product's image list
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION append_admin_product_image(p_id TEXT, p_image TEXT)
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
#variable_conflict use_column
DECLARE
  normalised_image TEXT := NULLIF(btrim(COALESCE(p_image, '')), '');
BEGIN
  IF p_id IS NULL OR btrim(p_id) = '' THEN
    RAISE EXCEPTION 'Product id is required.' USING ERRCODE = 'P0001';
  END IF;

  IF normalised_image IS NULL THEN
    RAISE EXCEPTION 'Product image URL or path is required.' USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
  UPDATE admin_products
  SET images = CASE
        WHEN COALESCE(admin_products.images, ARRAY[]::TEXT[]) @> ARRAY[normalised_image]::TEXT[] THEN COALESCE(admin_products.images, ARRAY[]::TEXT[])
        ELSE array_append(COALESCE(admin_products.images, ARRAY[]::TEXT[]), normalised_image)
      END,
      updated_at = now()
  WHERE admin_products.id = btrim(p_id)
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

-- ---------------------------------------------------------------------------
-- delete_admin_product: delete a product by id
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_admin_product(p_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM admin_products WHERE admin_products.id = p_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

-- ---------------------------------------------------------------------------
-- toggle_admin_product_stock: quick stock toggle
-- ---------------------------------------------------------------------------
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
#variable_conflict use_column
BEGIN
  RETURN QUERY
  UPDATE admin_products
  SET in_stock = COALESCE(p_in_stock, admin_products.in_stock),
      updated_at = now()
  WHERE admin_products.id = p_id
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

COMMIT;
