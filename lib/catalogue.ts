// lib/catalogue.ts
//
// Product data source abstraction.
// Checks data sources at runtime:
//   - If SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set → Shopify Storefront API
//   - Else if admin_products exists and contains rows → database catalogue
//   - Otherwise → local mock catalogue
//
// All exports are async where source selection requires I/O.

import type { Product, ProductCategory } from "./types";

// ---------------------------------------------------------------------------
// Data source detection
// ---------------------------------------------------------------------------

function hasRealEnvValue(value: string | undefined): value is string {
  if (!value) return false;

  const normalised = value.trim().toLowerCase();

  return !["null", "undefined", "none", "nil", "false", "0", ""].includes(normalised);
}

function isShopifyConfigured(): boolean {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();

  return (
    hasRealEnvValue(domain) &&
    !domain.startsWith("http://") &&
    !domain.startsWith("https://") &&
    hasRealEnvValue(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
  );
}

// ---------------------------------------------------------------------------
// Lazy data source imports
// ---------------------------------------------------------------------------

async function getMockModule() {
  return await import("./mock-products");
}

async function getDatabaseProducts(): Promise<Product[] | null> {
  try {
    const { listAdminProducts } = await import("@/server/db/product-contracts");
    const products = await listAdminProducts();
    return products.length > 0 ? products : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public catalogue API
// ---------------------------------------------------------------------------

/**
 * Returns all products from the active data source.
 * Server-side only — do not import in client components.
 */
export async function getProducts(): Promise<Product[]> {
  if (isShopifyConfigured()) {
    const { shopifyGetProducts } = await import("./shopify");
    return shopifyGetProducts();
  }

  const databaseProducts = await getDatabaseProducts();
  if (databaseProducts) {
    return databaseProducts;
  }

  const mock = await getMockModule();
  return mock.products;
}

/**
 * Returns a single product by its URL handle, or null if not found.
 * Server-side only — do not import in client components.
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isShopifyConfigured()) {
    const { shopifyGetProductByHandle } = await import("./shopify");
    return shopifyGetProductByHandle(handle);
  }

  const databaseProducts = await getDatabaseProducts();
  if (databaseProducts) {
    return databaseProducts.find((product) => product.handle === handle) ?? null;
  }

  const mock = await getMockModule();
  return mock.getProductByHandle(handle) ?? null;
}

/**
 * Returns the list of product categories.
 * Categories are static and shared between all data sources.
 */
export function getCategories(): ProductCategory[] {
  return [
    "Pleated shades",
    "Faceted / geometric shades",
    "Floral / petal shades",
    "Textured diffuser shades",
    "Starfield / perforated shades",
    "Experimental prototypes",
  ];
}

/**
 * Returns the current catalogue data source name for diagnostics.
 */
export async function getCatalogueSource(): Promise<"shopify" | "database" | "mock"> {
  if (isShopifyConfigured()) {
    return "shopify";
  }

  return (await getDatabaseProducts()) ? "database" : "mock";
}
