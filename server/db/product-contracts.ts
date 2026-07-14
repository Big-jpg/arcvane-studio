// ArcVane Studio — Catalogue V2 typed database contracts.

import type {
  AdapterType,
  Product,
  ProductCategory,
  ProductComponentScope,
  ProductLightingState,
  ProductMedia,
  ProductMediaRole,
  ProductMetadata,
  ProductStatus,
  ProductTimeState,
  ProductVariant,
} from "@/lib/types";
import { queryOne, queryRows } from "./client";

export interface AdminProductRecord extends Product {
  status: ProductStatus;
  variants: ProductVariant[];
  media: ProductMedia[];
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
  images?: string[];
  adapters: AdapterType[];
  inStock: boolean;
  designFamily?: string | null;
  status?: ProductStatus;
  timeState?: ProductTimeState | null;
  behaviourNote?: string | null;
  componentScope?: ProductComponentScope | null;
  metadata?: ProductMetadata | null;
}

type RawVariant = {
  id: string;
  product_id: string;
  sku: string | null;
  title: string;
  finish: string;
  price: string | number | null;
  currency: string;
  adapters: string[] | null;
  in_stock: boolean;
  inventory_quantity: number | null;
  sort_order: number;
};

type RawMedia = {
  id: string;
  product_id: string;
  variant_id: string | null;
  blob_url: string;
  blob_path: string | null;
  alt_text: string;
  role: ProductMediaRole;
  lighting_state: ProductLightingState | null;
  sort_order: number;
  is_primary: boolean;
  width: number | null;
  height: number | null;
  byte_size: string | number | null;
  mime_type: string | null;
  checksum_sha256: string | null;
};

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  price: string | number;
  currency: string;
  category: string;
  description: string;
  material: string;
  dimensions: string;
  adapters: string[] | null;
  in_stock: boolean;
  design_family: string | null;
  status: ProductStatus;
  time_state: ProductTimeState | null;
  behaviour_note: string | null;
  component_scope: ProductComponentScope | null;
  metadata: ProductMetadata | null;
  variants: RawVariant[] | null;
  media: RawMedia[] | null;
  created_at: string;
  updated_at: string;
};

export type AddProductMediaParams = {
  productId: string;
  variantId: string | null;
  blobUrl: string;
  blobPath: string | null;
  altText: string;
  role: ProductMediaRole;
  lightingState: ProductLightingState | null;
  sortOrder: number;
  isPrimary: boolean;
  width?: number | null;
  height?: number | null;
  byteSize?: number | null;
  mimeType?: string | null;
  checksumSha256?: string | null;
};

export function isProductDatabaseUnavailableError(error: unknown): boolean {
  const code =
    typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;
  return code === "42P01" || code === "42883" || code === "42703";
}

function numberOrNull(value: string | number | null): number | null {
  return value == null ? null : typeof value === "number" ? value : Number(value);
}

function mapVariant(row: RawVariant): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    sku: row.sku,
    title: row.title,
    finish: row.finish,
    price: numberOrNull(row.price),
    currency: row.currency,
    adapters: (row.adapters ?? []) as AdapterType[],
    inStock: row.in_stock,
    inventoryQuantity: row.inventory_quantity,
    sortOrder: row.sort_order,
  };
}

function mapMedia(row: RawMedia): ProductMedia {
  return {
    id: row.id,
    productId: row.product_id,
    variantId: row.variant_id,
    blobUrl: row.blob_url,
    blobPath: row.blob_path,
    altText: row.alt_text,
    role: row.role,
    lightingState: row.lighting_state,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
    width: row.width,
    height: row.height,
    byteSize: numberOrNull(row.byte_size),
    mimeType: row.mime_type,
    checksumSha256: row.checksum_sha256,
  };
}

function mapProduct(row: RawProduct): AdminProductRecord {
  const variants = (row.variants ?? []).map(mapVariant);
  const media = (row.media ?? []).map(mapMedia);
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    price: Number(row.price),
    currency: row.currency,
    category: row.category as ProductCategory,
    description: row.description,
    timeState: row.time_state ?? undefined,
    behaviourNote: row.behaviour_note ?? undefined,
    material: row.material,
    dimensions: row.dimensions,
    colours: variants.map((variant) => variant.finish),
    images: media.map((item) => item.blobUrl),
    variants,
    media,
    adapters: (row.adapters ?? []) as AdapterType[],
    componentScope: row.component_scope,
    inStock: row.in_stock,
    status: row.status,
    shopifyProductId: null,
    shopifyVariantId: null,
    designFamily: row.design_family,
    compatibleAdapters: row.adapters ?? [],
    productionNotes: null,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function productRows(includeNonActive: boolean): Promise<AdminProductRecord[]> {
  const rows = await queryRows<{ product: RawProduct }>(
    `SELECT list_catalogue_products_v2($1) AS product`,
    [includeNonActive],
  );
  return rows.map((row) => mapProduct(row.product));
}

export async function listAdminProducts(): Promise<AdminProductRecord[]> {
  return productRows(true);
}

export async function listPublicProducts(): Promise<AdminProductRecord[]> {
  return productRows(false);
}

export async function getAdminProduct(id: string): Promise<AdminProductRecord | null> {
  const row = await queryOne<{ product: RawProduct | null }>(
    `SELECT get_catalogue_product_v2($1) AS product`,
    [id],
  );
  return row?.product ? mapProduct(row.product) : null;
}

export async function getAdminProductByHandle(handle: string): Promise<AdminProductRecord | null> {
  const row = await queryOne<{ product: RawProduct | null }>(
    `SELECT get_catalogue_product_by_handle_v2($1) AS product`,
    [handle],
  );
  return row?.product ? mapProduct(row.product) : null;
}

export async function upsertAdminProduct(
  params: UpsertAdminProductParams,
): Promise<AdminProductRecord | null> {
  const row = await queryOne<{ product: RawProduct | null }>(
    `SELECT upsert_catalogue_product_v2(
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::text[], $11::text[], $12,
      $13, $14, $15, $16, $17::jsonb, $18::jsonb
    ) AS product`,
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
      params.colours,
      params.adapters,
      params.inStock,
      params.designFamily ?? null,
      params.status ?? (params.inStock ? "active" : "draft"),
      params.timeState ?? null,
      params.behaviourNote ?? null,
      JSON.stringify(params.componentScope ?? null),
      JSON.stringify(params.metadata ?? {}),
    ],
  );
  return row?.product ? mapProduct(row.product) : null;
}

export async function addProductMedia(params: AddProductMediaParams): Promise<ProductMedia | null> {
  const row = await queryOne<{ media: RawMedia | null }>(
    `SELECT add_product_media(
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    ) AS media`,
    [
      params.productId,
      params.variantId,
      params.blobUrl,
      params.blobPath,
      params.altText,
      params.role,
      params.lightingState,
      params.sortOrder,
      params.isPrimary,
      params.width ?? null,
      params.height ?? null,
      params.byteSize ?? null,
      params.mimeType ?? null,
      params.checksumSha256 ?? null,
    ],
  );
  return row?.media ? mapMedia(row.media) : null;
}

export async function archiveProductMedia(mediaId: string): Promise<boolean> {
  const row = await queryOne<{ archived: boolean }>(
    `SELECT archive_product_media($1::uuid) AS archived`,
    [mediaId],
  );
  return row?.archived ?? false;
}

// Compatibility wrappers retained while the admin routes migrate to explicit media records.
export async function appendAdminProductImage(
  id: string,
  imageUrl: string,
): Promise<AdminProductRecord | null> {
  const product = await getAdminProduct(id);
  if (!product) return null;
  await addProductMedia({
    productId: id,
    variantId: product.variants[0]?.id ?? null,
    blobUrl: imageUrl,
    blobPath: null,
    altText: `${product.title} product image`,
    role: product.media.length === 0 ? "hero" : "gallery",
    lightingState: null,
    sortOrder: (product.media.at(-1)?.sortOrder ?? 0) + 10,
    isPrimary: product.media.length === 0,
  });
  return getAdminProduct(id);
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const row = await queryOne<{ archived: boolean }>(
    `SELECT archive_catalogue_product($1) AS archived`,
    [id],
  );
  return row?.archived ?? false;
}

export async function toggleAdminProductStock(
  id: string,
  inStock: boolean,
): Promise<AdminProductRecord | null> {
  const product = await getAdminProduct(id);
  if (!product) return null;
  return upsertAdminProduct({
    ...product,
    colours: product.variants.map((variant) => variant.finish),
    inStock,
    status: product.status,
  });
}
