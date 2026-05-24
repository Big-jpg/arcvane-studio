// server/db/product-contracts.ts
// ArcVane Studio — typed product catalogue database contract layer.
// Application code calls stored procedures only; no inline table writes are performed here.

import type { AdapterType, Product, ProductCategory } from "@/lib/types";
import { queryOne, queryRows } from "./client";

export interface AdminProductRecord extends Product {
  createdAt: string;
  updatedAt: string;
}

export interface UpsertAdminProductParams {
  id: string;
  handle: string;
  title: string;
  price: number;
  currency: string;
  category: ProductCategory;
  description: string;
  material: string;
  dimensions: string;
  colours: string[];
  images: string[];
  adapters: AdapterType[];
  inStock: boolean;
  designFamily?: string | null;
}

interface AdminProductRow {
  id: string;
  handle: string;
  title: string;
  price: string | number;
  currency: string;
  category: string;
  description: string;
  material: string;
  dimensions: string;
  colours: string[] | null;
  images: string[] | null;
  adapters: string[] | null;
  in_stock: boolean;
  design_family: string | null;
  created_at: string;
  updated_at: string;
}

export function isProductDatabaseUnavailableError(error: unknown): boolean {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;
  return code === "42P01" || code === "42883";
}

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : Number(value);
}

function mapAdminProduct(row: AdminProductRow): AdminProductRecord {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    price: toNumber(row.price),
    currency: row.currency,
    category: row.category as ProductCategory,
    description: row.description,
    material: row.material,
    dimensions: row.dimensions,
    colours: row.colours ?? [],
    images: row.images ?? [],
    adapters: (row.adapters ?? []) as AdapterType[],
    inStock: row.in_stock,
    shopifyProductId: null,
    shopifyVariantId: null,
    designFamily: row.design_family,
    compatibleAdapters: row.adapters ?? [],
    productionNotes: null,
    metadata: null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAdminProducts(): Promise<AdminProductRecord[]> {
  const rows = await queryRows<AdminProductRow>(`SELECT * FROM list_admin_products()`);
  return rows.map(mapAdminProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProductRecord | null> {
  const row = await queryOne<AdminProductRow>(`SELECT * FROM get_admin_product($1)`, [id]);
  return row ? mapAdminProduct(row) : null;
}

export async function getAdminProductByHandle(handle: string): Promise<AdminProductRecord | null> {
  const row = await queryOne<AdminProductRow>(`SELECT * FROM get_admin_product_by_handle($1)`, [handle]);
  return row ? mapAdminProduct(row) : null;
}

export async function upsertAdminProduct(
  params: UpsertAdminProductParams,
): Promise<AdminProductRecord | null> {
  // Ensure arrays are never undefined/null — pg serializes [] as NULL which
  // the stored procedure handles via COALESCE, but we normalise here defensively.
  const colours = params.colours.length > 0 ? params.colours : [];
  const images = params.images.length > 0 ? params.images : [];
  const adapters = params.adapters.length > 0 ? params.adapters : [];

  const row = await queryOne<AdminProductRow>(
    `SELECT * FROM upsert_admin_product($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::text[], $11::text[], $12::text[], $13, $14)`,
    [
      params.id,
      params.handle,
      params.title,
      String(params.price),
      params.currency,
      params.category,
      params.description,
      params.material,
      params.dimensions,
      colours.length > 0 ? colours : null,
      images.length > 0 ? images : null,
      adapters.length > 0 ? adapters : null,
      params.inStock,
      params.designFamily ?? null,
    ],
  );

  return row ? mapAdminProduct(row) : null;
}

export async function appendAdminProductImage(
  id: string,
  imageUrl: string,
): Promise<AdminProductRecord | null> {
  const row = await queryOne<AdminProductRow>(
    `SELECT * FROM append_admin_product_image($1, $2)`,
    [id, imageUrl],
  );

  return row ? mapAdminProduct(row) : null;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const row = await queryOne<{ delete_admin_product: boolean }>(
    `SELECT delete_admin_product($1)`,
    [id],
  );
  return row?.delete_admin_product ?? false;
}

export async function toggleAdminProductStock(
  id: string,
  inStock: boolean,
): Promise<AdminProductRecord | null> {
  const row = await queryOne<AdminProductRow>(`SELECT * FROM toggle_admin_product_stock($1, $2)`, [
    id,
    inStock,
  ]);
  return row ? mapAdminProduct(row) : null;
}
