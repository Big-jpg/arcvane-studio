-- ArcVane Studio — Catalogue V2 stored contracts.

CREATE OR REPLACE FUNCTION catalogue_product_payload(p admin_products)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'id', p.id,
    'handle', p.handle,
    'title', p.title,
    'price', p.price,
    'currency', p.currency,
    'category', p.category,
    'description', p.description,
    'material', p.material,
    'dimensions', p.dimensions,
    'adapters', p.adapters,
    'in_stock', p.in_stock,
    'design_family', p.design_family,
    'status', p.status,
    'time_state', p.time_state,
    'behaviour_note', p.behaviour_note,
    'component_scope', p.component_scope,
    'metadata', p.metadata,
    'archived_at', p.archived_at,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'variants', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', v.id,
        'product_id', v.product_id,
        'sku', v.sku,
        'title', v.title,
        'finish', v.finish,
        'price', v.price,
        'currency', v.currency,
        'adapters', v.adapters,
        'in_stock', v.in_stock,
        'inventory_quantity', v.inventory_quantity,
        'sort_order', v.sort_order
      ) ORDER BY v.sort_order, v.finish)
      FROM product_variants v
      WHERE v.product_id = p.id AND v.archived_at IS NULL
    ), '[]'::jsonb),
    'media', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', m.id,
        'product_id', m.product_id,
        'variant_id', m.variant_id,
        'blob_url', m.blob_url,
        'blob_path', m.blob_path,
        'alt_text', m.alt_text,
        'role', m.role,
        'lighting_state', m.lighting_state,
        'sort_order', m.sort_order,
        'is_primary', m.is_primary,
        'width', m.width,
        'height', m.height,
        'byte_size', m.byte_size,
        'mime_type', m.mime_type,
        'checksum_sha256', m.checksum_sha256,
        'created_at', m.created_at,
        'updated_at', m.updated_at
      ) ORDER BY m.sort_order, m.created_at)
      FROM product_media m
      WHERE m.product_id = p.id AND m.archived_at IS NULL
    ), '[]'::jsonb)
  );
$$;

CREATE OR REPLACE FUNCTION list_catalogue_products_v2(p_include_non_active BOOLEAN DEFAULT false)
RETURNS SETOF JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT catalogue_product_payload(p)
  FROM admin_products p
  WHERE p.archived_at IS NULL
    AND (p_include_non_active OR (p.status = 'active' AND p.in_stock))
  ORDER BY p.created_at, p.title;
$$;

CREATE OR REPLACE FUNCTION get_catalogue_product_v2(p_id TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT catalogue_product_payload(p)
  FROM admin_products p
  WHERE p.id = p_id AND p.archived_at IS NULL;
$$;

CREATE OR REPLACE FUNCTION get_catalogue_product_by_handle_v2(p_handle TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT catalogue_product_payload(p)
  FROM admin_products p
  WHERE p.handle = p_handle AND p.archived_at IS NULL;
$$;

CREATE OR REPLACE FUNCTION sync_product_variants(
  p_product_id TEXT,
  p_finishes TEXT[],
  p_price NUMERIC,
  p_currency TEXT,
  p_adapters TEXT[],
  p_in_stock BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  finish_value TEXT;
  finish_index INTEGER;
  variant_id TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'Product not found.' USING ERRCODE = 'P0001';
  END IF;

  UPDATE product_variants
  SET archived_at = now(), in_stock = false, updated_at = now()
  WHERE product_id = p_product_id
    AND archived_at IS NULL
    AND NOT (finish = ANY(COALESCE(p_finishes, ARRAY[]::TEXT[])));

  FOR finish_value, finish_index IN
    SELECT value, ordinality::integer
    FROM unnest(COALESCE(p_finishes, ARRAY[]::TEXT[])) WITH ORDINALITY AS f(value, ordinality)
  LOOP
    variant_id := p_product_id || '-finish-' || finish_index::text;

    INSERT INTO product_variants (
      id, product_id, sku, title, finish, price, currency, adapters, in_stock, sort_order, archived_at
    ) VALUES (
      variant_id,
      p_product_id,
      upper(regexp_replace(p_product_id, '[^a-zA-Z0-9]+', '-', 'g')) || '-' ||
        upper(regexp_replace(finish_value, '[^a-zA-Z0-9]+', '-', 'g')),
      finish_value,
      finish_value,
      p_price,
      upper(COALESCE(NULLIF(btrim(p_currency), ''), 'AUD')),
      COALESCE(p_adapters, ARRAY[]::TEXT[]),
      p_in_stock,
      finish_index * 10,
      NULL
    )
    ON CONFLICT (product_id, finish) DO UPDATE SET
      title = EXCLUDED.title,
      price = EXCLUDED.price,
      currency = EXCLUDED.currency,
      adapters = EXCLUDED.adapters,
      in_stock = EXCLUDED.in_stock,
      sort_order = EXCLUDED.sort_order,
      archived_at = NULL,
      updated_at = now();
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_catalogue_product_v2(
  p_id TEXT,
  p_handle TEXT,
  p_title TEXT,
  p_price NUMERIC,
  p_currency TEXT,
  p_category TEXT,
  p_description TEXT,
  p_material TEXT,
  p_dimensions TEXT,
  p_finishes TEXT[],
  p_adapters TEXT[],
  p_in_stock BOOLEAN,
  p_design_family TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'draft',
  p_time_state TEXT DEFAULT NULL,
  p_behaviour_note TEXT DEFAULT NULL,
  p_component_scope JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NULLIF(btrim(p_id), '') IS NULL OR NULLIF(btrim(p_handle), '') IS NULL OR NULLIF(btrim(p_title), '') IS NULL THEN
    RAISE EXCEPTION 'Product id, handle, and title are required.' USING ERRCODE = 'P0001';
  END IF;

  IF p_status NOT IN ('draft', 'active', 'archived') THEN
    RAISE EXCEPTION 'Invalid product status.' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO admin_products (
    id, handle, title, price, currency, category, description, material, dimensions,
    colours, images, adapters, in_stock, design_family, status, time_state,
    behaviour_note, component_scope, metadata, archived_at
  ) VALUES (
    btrim(p_id), btrim(p_handle), btrim(p_title), p_price,
    upper(COALESCE(NULLIF(btrim(p_currency), ''), 'AUD')), btrim(p_category),
    COALESCE(p_description, ''), COALESCE(p_material, ''), COALESCE(p_dimensions, ''),
    COALESCE(p_finishes, ARRAY[]::TEXT[]), ARRAY[]::TEXT[], COALESCE(p_adapters, ARRAY[]::TEXT[]),
    COALESCE(p_in_stock, false), NULLIF(btrim(COALESCE(p_design_family, '')), ''), p_status,
    NULLIF(btrim(COALESCE(p_time_state, '')), ''),
    NULLIF(btrim(COALESCE(p_behaviour_note, '')), ''), p_component_scope,
    COALESCE(p_metadata, '{}'::jsonb), CASE WHEN p_status = 'archived' THEN now() ELSE NULL END
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
    adapters = EXCLUDED.adapters,
    in_stock = EXCLUDED.in_stock,
    design_family = EXCLUDED.design_family,
    status = EXCLUDED.status,
    time_state = EXCLUDED.time_state,
    behaviour_note = EXCLUDED.behaviour_note,
    component_scope = EXCLUDED.component_scope,
    metadata = EXCLUDED.metadata,
    archived_at = EXCLUDED.archived_at,
    updated_at = now();

  PERFORM sync_product_variants(
    p_id, p_finishes, p_price, p_currency, p_adapters, p_in_stock AND p_status = 'active'
  );

  SELECT get_catalogue_product_v2(p_id) INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION add_product_media(
  p_product_id TEXT,
  p_variant_id TEXT,
  p_blob_url TEXT,
  p_blob_path TEXT,
  p_alt_text TEXT,
  p_role TEXT,
  p_lighting_state TEXT,
  p_sort_order INTEGER,
  p_is_primary BOOLEAN,
  p_width INTEGER DEFAULT NULL,
  p_height INTEGER DEFAULT NULL,
  p_byte_size BIGINT DEFAULT NULL,
  p_mime_type TEXT DEFAULT NULL,
  p_checksum_sha256 TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  inserted product_media;
BEGIN
  IF p_variant_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM product_variants WHERE id = p_variant_id AND product_id = p_product_id AND archived_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Variant does not belong to product.' USING ERRCODE = 'P0001';
  END IF;

  IF p_is_primary THEN
    UPDATE product_media
    SET is_primary = false, updated_at = now()
    WHERE product_id = p_product_id AND archived_at IS NULL;
  END IF;

  INSERT INTO product_media (
    product_id, variant_id, blob_url, blob_path, alt_text, role, lighting_state,
    sort_order, is_primary, width, height, byte_size, mime_type, checksum_sha256
  ) VALUES (
    p_product_id, p_variant_id, p_blob_url, p_blob_path, p_alt_text, p_role, p_lighting_state,
    COALESCE(p_sort_order, 0), COALESCE(p_is_primary, false), p_width, p_height,
    p_byte_size, p_mime_type, p_checksum_sha256
  )
  ON CONFLICT (blob_url) DO UPDATE SET
    variant_id = EXCLUDED.variant_id,
    blob_path = EXCLUDED.blob_path,
    alt_text = EXCLUDED.alt_text,
    role = EXCLUDED.role,
    lighting_state = EXCLUDED.lighting_state,
    sort_order = EXCLUDED.sort_order,
    is_primary = EXCLUDED.is_primary,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    byte_size = EXCLUDED.byte_size,
    mime_type = EXCLUDED.mime_type,
    checksum_sha256 = EXCLUDED.checksum_sha256,
    archived_at = NULL,
    updated_at = now()
  RETURNING * INTO inserted;

  RETURN to_jsonb(inserted);
END;
$$;

CREATE OR REPLACE FUNCTION archive_product_media(p_media_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE product_media
  SET archived_at = now(), is_primary = false, updated_at = now()
  WHERE id = p_media_id AND archived_at IS NULL;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION archive_catalogue_product(p_product_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE admin_products
  SET status = 'archived', in_stock = false, archived_at = now(), updated_at = now()
  WHERE id = p_product_id AND archived_at IS NULL;

  UPDATE product_variants
  SET in_stock = false, archived_at = COALESCE(archived_at, now()), updated_at = now()
  WHERE product_id = p_product_id;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION create_order_item_v2(
  p_order_id UUID,
  p_catalogue_product_id TEXT,
  p_catalogue_variant_id TEXT,
  p_product_media_id UUID,
  p_product_handle TEXT,
  p_sku TEXT,
  p_shopify_product_id TEXT,
  p_shopify_variant_id TEXT,
  p_title TEXT,
  p_variant_title TEXT,
  p_quantity INTEGER,
  p_unit_amount INTEGER,
  p_total_amount INTEGER,
  p_image_url TEXT,
  p_selected_adapter TEXT,
  p_bulb_type_confirmed BOOLEAN,
  p_fixture_notes TEXT,
  p_customisation_notes TEXT,
  p_material TEXT,
  p_colour TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  result UUID;
BEGIN
  INSERT INTO order_items (
    order_id, catalogue_product_id, catalogue_variant_id, product_media_id, product_handle, sku,
    shopify_product_id, shopify_variant_id, title, variant_title, quantity, unit_amount,
    total_amount, image_url, selected_adapter, bulb_type_confirmed, fixture_notes,
    customisation_notes, material, colour, metadata
  ) VALUES (
    p_order_id, p_catalogue_product_id, p_catalogue_variant_id, p_product_media_id,
    p_product_handle, p_sku, p_shopify_product_id, p_shopify_variant_id, p_title,
    p_variant_title, p_quantity, p_unit_amount, p_total_amount, p_image_url,
    p_selected_adapter, p_bulb_type_confirmed, p_fixture_notes, p_customisation_notes,
    p_material, p_colour, COALESCE(p_metadata, '{}'::jsonb)
  ) RETURNING id INTO result;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION mark_order_payment_state(
  p_payment_intent_id TEXT,
  p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE orders
  SET status = p_status,
      paid_at = CASE WHEN p_status = 'paid' THEN COALESCE(paid_at, now()) ELSE paid_at END,
      updated_at = now()
  WHERE stripe_payment_intent_id = p_payment_intent_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION record_order_refund(
  p_payment_intent_id TEXT,
  p_refunded_amount INTEGER,
  p_fully_refunded BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE orders
  SET refunded_amount = GREATEST(COALESCE(p_refunded_amount, 0), 0),
      status = CASE WHEN p_fully_refunded THEN 'refunded' ELSE 'partially_refunded' END,
      refunded_at = now(),
      updated_at = now()
  WHERE stripe_payment_intent_id = p_payment_intent_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION get_sales_summary(
  p_from TIMESTAMPTZ DEFAULT now() - interval '30 days',
  p_to TIMESTAMPTZ DEFAULT now()
)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  WITH eligible_orders AS (
    SELECT * FROM orders
    WHERE created_at >= p_from AND created_at < p_to
      AND status IN ('paid', 'partially_refunded', 'refunded')
  ), totals AS (
    SELECT count(*) AS order_count,
           COALESCE(sum(total_amount), 0) AS gross_amount,
           COALESCE(sum(refunded_amount), 0) AS refunded_amount
    FROM eligible_orders
  ), item_totals AS (
    SELECT COALESCE(sum(oi.quantity), 0) AS units_sold
    FROM order_items oi JOIN eligible_orders o ON o.id = oi.order_id
  ), product_sales AS (
    SELECT oi.catalogue_product_id, oi.product_handle, max(oi.title) AS title,
           max(oi.image_url) AS image_url, sum(oi.quantity) AS units,
           sum(oi.total_amount) AS gross_amount
    FROM order_items oi JOIN eligible_orders o ON o.id = oi.order_id
    GROUP BY oi.catalogue_product_id, oi.product_handle
  )
  SELECT jsonb_build_object(
    'order_count', totals.order_count,
    'units_sold', item_totals.units_sold,
    'gross_amount', totals.gross_amount,
    'refunded_amount', totals.refunded_amount,
    'net_amount', totals.gross_amount - totals.refunded_amount,
    'average_order_value', CASE WHEN totals.order_count = 0 THEN 0 ELSE round(totals.gross_amount::numeric / totals.order_count) END,
    'products', COALESCE((SELECT jsonb_agg(jsonb_build_object(
      'catalogue_product_id', catalogue_product_id, 'handle', product_handle, 'title', title,
      'image_url', image_url, 'units', units, 'gross_amount', gross_amount
    ) ORDER BY gross_amount DESC) FROM product_sales), '[]'::jsonb)
  )
  FROM totals CROSS JOIN item_totals;
$$;

CREATE OR REPLACE FUNCTION list_accessories_v2()
RETURNS SETOF JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_build_object(
    'id', a.id, 'handle', a.handle, 'title', a.title, 'subtitle', a.subtitle,
    'price', a.price, 'currency', a.currency, 'colour_temp', a.colour_temp,
    'kelvin', a.kelvin, 'specs', a.specs, 'benefit', a.benefit, 'image', a.image,
    'fitting', a.fitting, 'source_ref', a.source_ref, 'in_stock', a.in_stock
  )
  FROM accessories a
  WHERE a.in_stock
  ORDER BY a.kelvin, a.title;
$$;
