// lib/types.ts

export type AdapterType = "E27" | "B22" | "Other / not sure";

export type ProductCategory =
  | "Lighting Objects"
  | "Table Lamps"
  | "Shade Sets"
  | "Single Shades"
  | "Coastal Forms"
  | "Experimental Drops"
  | "Accessories";

export type ProductTimeState =
  | "dawn"
  | "midday"
  | "dusk"
  | "evening"
  | "dawn / midday"
  | "dusk / evening";

export type ProductStatus = "draft" | "active" | "archived";
export type ProductMediaRole = "hero" | "gallery" | "detail" | "lifestyle";
export type ProductLightingState = "unlit" | "illuminated";

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string | null;
  title: string;
  finish: string;
  price: number | null;
  currency: string;
  adapters: AdapterType[];
  inStock: boolean;
  inventoryQuantity: number | null;
  sortOrder: number;
}

export interface ProductMedia {
  id: string;
  productId: string;
  variantId: string | null;
  blobUrl: string;
  blobPath: string | null;
  altText: string;
  role: ProductMediaRole;
  lightingState: ProductLightingState | null;
  sortOrder: number;
  isPrimary: boolean;
  width: number | null;
  height: number | null;
  byteSize: number | null;
  mimeType: string | null;
  checksumSha256: string | null;
}

/**
 * Future-ready metadata fields from the branding doc.
 * These are optional and populated from Shopify metafields when available.
 */
export interface ProductMetadata {
  market_event_id?: string;
  market_source?: string;
  qr_campaign?: string;
  display_sample_id?: string;
  production_queue_status?: string;
  filament_material?: string;
  filament_colour?: string;
  print_profile?: string;
}

export type ProductSupplyModel =
  | "decorative-components-only"
  | "certified-electrical-kit"
  | "complete-assembled-system";

export interface ProductComponentScope {
  /** Current supply model for this listing; defaults to decorative-components-only. */
  supplyModel?: ProductSupplyModel;
  /** Physical ArcVane components supplied with the product. */
  included: string[];
  /** Certified electrical components supplied by ArcVane, reserved for future kit/system listings. */
  electricalIncluded?: string[];
  /** Electrical or system components intentionally not supplied by ArcVane for this listing. */
  notIncluded: string[];
  /** Components the customer must source separately for intended illuminated use. */
  customerSupplied: string[];
  /** Practical fit note for this product's intended E27-compatible use. */
  compatibility: string;
}

export interface Product {
  /** App-level product ID. For Shopify products, this is the Shopify global ID. */
  id: string;
  /** URL-safe product handle (slug). */
  handle: string;
  title: string;
  price: number;
  currency: string;
  category: ProductCategory;
  description: string;
  /** Optional storefront association for the time-state palette this product suits best. */
  timeState?: ProductTimeState;
  /** Optional one-line material/light behaviour note for restrained product cards. */
  behaviourNote?: string;
  material: string;
  dimensions: string;
  colours: string[];
  images: string[];
  /** Normalized purchasable finishes. colours is derived from these for legacy components. */
  variants?: ProductVariant[];
  /** Normalized media records. images is derived from these for legacy components. */
  media?: ProductMedia[];
  /** Compatible adapter types for this product. E27 is the primary/default system. */
  adapters: AdapterType[];
  /** Explicit separation between ArcVane physical components and customer-supplied electrical components. */
  componentScope?: ProductComponentScope | null;
  inStock: boolean;
  status?: ProductStatus;

  // --- Shopify-specific identifiers (preserved for downstream use) ---

  /** Shopify global product ID, e.g. "gid://shopify/Product/123". Null for mock data. */
  shopifyProductId?: string | null;
  /** Shopify global variant ID for the default/base variant. Null for mock data. */
  shopifyVariantId?: string | null;

  // --- Extended catalogue fields ---

  /** Design family grouping, e.g. "Shell Fan", "Coral Veil". */
  designFamily?: string | null;
  /** Compatible adapters as raw strings from Shopify (before normalisation). */
  compatibleAdapters?: string[] | null;
  /** Production notes from Shopify metafield. */
  productionNotes?: string | null;

  // --- Future-ready metadata ---

  metadata?: ProductMetadata | null;
}
