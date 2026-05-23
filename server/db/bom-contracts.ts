// server/db/bom-contracts.ts
// ArcVane Studio — typed BOM database contract layer.
// Application code calls stored procedures only; no inline table writes are performed here.

import type { BomComponent, BomLineType, ComponentCategory, ProductBomLine } from "@/lib/bom-types";
import { queryOne, queryRows } from "./client";

export interface BomComponentRecord extends BomComponent {
  createdAt: string;
  updatedAt: string;
}

export interface ProductBomLineWithComponent extends ProductBomLine {
  componentName: string;
  componentCategory: ComponentCategory;
  componentSupplier?: string | null;
  componentNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBomComponentParams {
  id?: string | null;
  name: string;
  category: ComponentCategory;
  unit: string;
  unitCost: number;
  supplier?: string | null;
  notes?: string | null;
}

export interface UpsertBomLineParams {
  id?: string | null;
  productId: string;
  componentId: string;
  lineType: BomLineType;
  quantity: number;
  wastagePercent: number;
  notes?: string | null;
  sortOrder: number;
}

interface BomComponentRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  unit_cost: string | number;
  supplier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductBomLineRow {
  id: string;
  product_id: string;
  component_id: string;
  line_type: string;
  quantity: string | number;
  unit: string;
  unit_cost: string | number;
  wastage_percent: string | number;
  sort_order: number;
  notes: string | null;
  component_name: string;
  component_category: string;
  component_supplier: string | null;
  component_notes: string | null;
  created_at: string;
  updated_at: string;
}

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapBomComponent(row: BomComponentRow): BomComponentRecord {
  return {
    id: row.id,
    name: row.name,
    category: row.category as ComponentCategory,
    unit: row.unit,
    unitCost: toNumber(row.unit_cost),
    currency: "AUD",
    supplier: row.supplier,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProductBomLine(row: ProductBomLineRow): ProductBomLineWithComponent {
  return {
    id: row.id,
    productId: row.product_id,
    componentId: row.component_id,
    lineType: row.line_type as BomLineType,
    quantity: toNumber(row.quantity),
    unit: row.unit,
    unitCost: toNumber(row.unit_cost),
    wastagePercent: toNumber(row.wastage_percent),
    sortOrder: row.sort_order,
    notes: row.notes,
    componentName: row.component_name,
    componentCategory: row.component_category as ComponentCategory,
    componentSupplier: row.component_supplier,
    componentNotes: row.component_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listBomComponents(): Promise<BomComponentRecord[]> {
  const rows = await queryRows<BomComponentRow>(`SELECT * FROM list_bom_components()`);
  return rows.map(mapBomComponent);
}

export async function upsertBomComponent(
  params: UpsertBomComponentParams,
): Promise<BomComponentRecord | null> {
  const row = await queryOne<BomComponentRow>(
    `SELECT * FROM upsert_bom_component($1, $2, $3, $4, $5, $6, $7)`,
    [
      params.id ?? null,
      params.name,
      params.category,
      params.unit,
      params.unitCost,
      params.supplier ?? null,
      params.notes ?? null,
    ],
  );

  return row ? mapBomComponent(row) : null;
}

export async function deleteBomComponent(id: string): Promise<boolean> {
  const row = await queryOne<{ delete_bom_component: boolean }>(
    `SELECT delete_bom_component($1)`,
    [id],
  );
  return row?.delete_bom_component ?? false;
}

export async function getProductBom(productId: string): Promise<ProductBomLineWithComponent[]> {
  const rows = await queryRows<ProductBomLineRow>(`SELECT * FROM get_product_bom($1)`, [productId]);
  return rows.map(mapProductBomLine);
}

export async function upsertBomLine(
  params: UpsertBomLineParams,
): Promise<ProductBomLineWithComponent | null> {
  const row = await queryOne<ProductBomLineRow>(
    `SELECT * FROM upsert_bom_line($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      params.id ?? null,
      params.productId,
      params.componentId,
      params.lineType,
      params.quantity,
      params.wastagePercent,
      params.notes ?? null,
      params.sortOrder,
    ],
  );

  return row ? mapProductBomLine(row) : null;
}

export async function deleteBomLine(id: string): Promise<boolean> {
  const row = await queryOne<{ delete_bom_line: boolean }>(`SELECT delete_bom_line($1)`, [id]);
  return row?.delete_bom_line ?? false;
}
