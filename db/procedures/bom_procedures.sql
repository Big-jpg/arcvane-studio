-- ArcVane Studio — BOM Stored Procedures
-- Run after BOM migration: psql $DATABASE_URL -f db/procedures/bom_procedures.sql

BEGIN;

-- =============================================================================
-- Component registry
-- =============================================================================

CREATE OR REPLACE FUNCTION upsert_bom_component(
  p_id uuid,
  p_name text,
  p_category text,
  p_unit text DEFAULT 'each',
  p_unit_cost numeric DEFAULT 0,
  p_supplier text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  unit text,
  unit_cost numeric,
  supplier text,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF NULLIF(trim(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Component name is required.';
  END IF;

  IF NULLIF(trim(p_category), '') IS NULL THEN
    RAISE EXCEPTION 'Component category is required.';
  END IF;

  IF NULLIF(trim(coalesce(p_unit, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Component unit is required.';
  END IF;

  IF coalesce(p_unit_cost, 0) < 0 THEN
    RAISE EXCEPTION 'Component unit cost cannot be negative.';
  END IF;

  IF p_id IS NULL THEN
    RETURN QUERY
    INSERT INTO bom_components (
      name,
      category,
      unit,
      unit_cost,
      supplier,
      notes
    )
    VALUES (
      trim(p_name),
      trim(p_category),
      trim(p_unit),
      coalesce(p_unit_cost, 0),
      NULLIF(trim(coalesce(p_supplier, '')), ''),
      NULLIF(trim(coalesce(p_notes, '')), '')
    )
    RETURNING
      bom_components.id,
      bom_components.name,
      bom_components.category,
      bom_components.unit,
      bom_components.unit_cost,
      bom_components.supplier,
      bom_components.notes,
      bom_components.created_at,
      bom_components.updated_at;
  END IF;

  RETURN QUERY
  UPDATE bom_components
  SET
    name = trim(p_name),
    category = trim(p_category),
    unit = trim(p_unit),
    unit_cost = coalesce(p_unit_cost, 0),
    supplier = NULLIF(trim(coalesce(p_supplier, '')), ''),
    notes = NULLIF(trim(coalesce(p_notes, '')), ''),
    updated_at = now()
  WHERE bom_components.id = p_id
  RETURNING
    bom_components.id,
    bom_components.name,
    bom_components.category,
    bom_components.unit,
    bom_components.unit_cost,
    bom_components.supplier,
    bom_components.notes,
    bom_components.created_at,
    bom_components.updated_at;
END;
$$;

CREATE OR REPLACE FUNCTION delete_bom_component(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM bom_components
  WHERE bom_components.id = p_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count > 0;
END;
$$;

CREATE OR REPLACE FUNCTION list_bom_components()
RETURNS TABLE (
  id uuid,
  name text,
  category text,
  unit text,
  unit_cost numeric,
  supplier text,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    bom_components.id,
    bom_components.name,
    bom_components.category,
    bom_components.unit,
    bom_components.unit_cost,
    bom_components.supplier,
    bom_components.notes,
    bom_components.created_at,
    bom_components.updated_at
  FROM bom_components
  ORDER BY bom_components.category ASC, bom_components.name ASC;
$$;

-- =============================================================================
-- Product BOM lines
-- =============================================================================

CREATE OR REPLACE FUNCTION upsert_bom_line(
  p_id uuid,
  p_product_id text,
  p_component_id uuid,
  p_line_type text DEFAULT 'material',
  p_quantity numeric DEFAULT 1,
  p_wastage_percent numeric DEFAULT 0,
  p_notes text DEFAULT NULL,
  p_sort_order integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  product_id text,
  component_id uuid,
  line_type text,
  quantity numeric,
  unit text,
  unit_cost numeric,
  wastage_percent numeric,
  sort_order integer,
  notes text,
  component_name text,
  component_category text,
  component_supplier text,
  component_notes text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF NULLIF(trim(p_product_id), '') IS NULL THEN
    RAISE EXCEPTION 'Product id is required.';
  END IF;

  IF p_component_id IS NULL THEN
    RAISE EXCEPTION 'Component id is required.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM bom_components WHERE bom_components.id = p_component_id) THEN
    RAISE EXCEPTION 'Component id % does not exist.', p_component_id;
  END IF;

  IF NULLIF(trim(coalesce(p_line_type, '')), '') IS NULL THEN
    RAISE EXCEPTION 'BOM line type is required.';
  END IF;

  IF coalesce(p_quantity, 0) <= 0 THEN
    RAISE EXCEPTION 'BOM line quantity must be greater than zero.';
  END IF;

  IF coalesce(p_wastage_percent, 0) < 0 THEN
    RAISE EXCEPTION 'BOM line wastage percent cannot be negative.';
  END IF;

  IF p_id IS NULL THEN
    RETURN QUERY
    WITH inserted AS (
      INSERT INTO bom_lines (
        product_id,
        component_id,
        line_type,
        quantity,
        wastage_percent,
        notes,
        sort_order
      )
      VALUES (
        trim(p_product_id),
        p_component_id,
        trim(p_line_type),
        coalesce(p_quantity, 1),
        coalesce(p_wastage_percent, 0),
        NULLIF(trim(coalesce(p_notes, '')), ''),
        coalesce(p_sort_order, 0)
      )
      RETURNING *
    )
    SELECT
      inserted.id,
      inserted.product_id,
      inserted.component_id,
      inserted.line_type,
      inserted.quantity,
      bom_components.unit,
      bom_components.unit_cost,
      inserted.wastage_percent,
      inserted.sort_order,
      inserted.notes,
      bom_components.name AS component_name,
      bom_components.category AS component_category,
      bom_components.supplier AS component_supplier,
      bom_components.notes AS component_notes,
      inserted.created_at,
      inserted.updated_at
    FROM inserted
    INNER JOIN bom_components ON bom_components.id = inserted.component_id;
  END IF;

  RETURN QUERY
  WITH updated AS (
    UPDATE bom_lines
    SET
      product_id = trim(p_product_id),
      component_id = p_component_id,
      line_type = trim(p_line_type),
      quantity = coalesce(p_quantity, 1),
      wastage_percent = coalesce(p_wastage_percent, 0),
      notes = NULLIF(trim(coalesce(p_notes, '')), ''),
      sort_order = coalesce(p_sort_order, 0),
      updated_at = now()
    WHERE bom_lines.id = p_id
    RETURNING *
  )
  SELECT
    updated.id,
    updated.product_id,
    updated.component_id,
    updated.line_type,
    updated.quantity,
    bom_components.unit,
    bom_components.unit_cost,
    updated.wastage_percent,
    updated.sort_order,
    updated.notes,
    bom_components.name AS component_name,
    bom_components.category AS component_category,
    bom_components.supplier AS component_supplier,
    bom_components.notes AS component_notes,
    updated.created_at,
    updated.updated_at
  FROM updated
  INNER JOIN bom_components ON bom_components.id = updated.component_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_bom_line(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM bom_lines
  WHERE bom_lines.id = p_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count > 0;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_bom(p_product_id text)
RETURNS TABLE (
  id uuid,
  product_id text,
  component_id uuid,
  line_type text,
  quantity numeric,
  unit text,
  unit_cost numeric,
  wastage_percent numeric,
  sort_order integer,
  notes text,
  component_name text,
  component_category text,
  component_supplier text,
  component_notes text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    bom_lines.id,
    bom_lines.product_id,
    bom_lines.component_id,
    bom_lines.line_type,
    bom_lines.quantity,
    bom_components.unit,
    bom_components.unit_cost,
    bom_lines.wastage_percent,
    bom_lines.sort_order,
    bom_lines.notes,
    bom_components.name AS component_name,
    bom_components.category AS component_category,
    bom_components.supplier AS component_supplier,
    bom_components.notes AS component_notes,
    bom_lines.created_at,
    bom_lines.updated_at
  FROM bom_lines
  INNER JOIN bom_components ON bom_components.id = bom_lines.component_id
  WHERE bom_lines.product_id = p_product_id
  ORDER BY bom_lines.sort_order ASC, bom_components.name ASC;
$$;

COMMIT;
