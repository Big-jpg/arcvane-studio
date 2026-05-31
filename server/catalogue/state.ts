import { products as mockProducts } from "@/lib/mock-products";
import type { Product } from "@/lib/types";
import { listAdminProducts } from "@/server/db/product-contracts";

export type CatalogueSource = "database" | "shopify" | "mock";

export type CatalogueState = {
  source: CatalogueSource;
  databaseAvailable: boolean;
  editable: boolean;
  productCount: number;
  shopifyConfigured: boolean;
  mockFallbackEnabled: boolean;
  warnings: string[];
};

type DatabaseProductState = {
  available: boolean;
  products: Product[];
};

function hasRealEnvValue(value: string | undefined): value is string {
  if (!value) return false;

  const normalised = value.trim().toLowerCase();

  return !["null", "undefined", "none", "nil", "false", "0", ""].includes(normalised);
}

function isExplicitlyEnabled(value: string | undefined): boolean {
  return hasRealEnvValue(value) && ["1", "true", "yes"].includes(value.trim().toLowerCase());
}

export function isShopifyCatalogueConfigured(): boolean {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();

  return (
    hasRealEnvValue(domain) &&
    !domain.startsWith("http://") &&
    !domain.startsWith("https://") &&
    hasRealEnvValue(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
  );
}

export function isMockCatalogueFallbackEnabled(): boolean {
  return (
    isExplicitlyEnabled(process.env.ENABLE_MOCK_CATALOGUE_FALLBACK) ||
    process.env.NODE_ENV !== "production"
  );
}

export function configuredCatalogueSource(): CatalogueSource {
  const configured = process.env.CATALOGUE_SOURCE?.trim().toLowerCase();

  if (configured === "database" || configured === "shopify" || configured === "mock") {
    return configured;
  }

  return "database";
}

async function loadDatabaseProducts(): Promise<DatabaseProductState> {
  try {
    return {
      available: true,
      products: await listAdminProducts(),
    };
  } catch {
    return {
      available: false,
      products: [],
    };
  }
}

async function loadShopifyProducts(): Promise<Product[]> {
  const { shopifyGetProducts } = await import("@/lib/shopify");
  return shopifyGetProducts();
}

async function loadShopifyProductByHandle(handle: string): Promise<Product | null> {
  const { shopifyGetProductByHandle } = await import("@/lib/shopify");
  return shopifyGetProductByHandle(handle);
}

function stateFor({
  source,
  database,
  productCount,
  warnings,
}: {
  source: CatalogueSource;
  database: DatabaseProductState;
  productCount: number;
  warnings: string[];
}): CatalogueState {
  return {
    source,
    databaseAvailable: database.available,
    editable: source === "database" && database.available,
    productCount,
    shopifyConfigured: isShopifyCatalogueConfigured(),
    mockFallbackEnabled: isMockCatalogueFallbackEnabled(),
    warnings,
  };
}

async function resolveDatabaseCatalogue(database: DatabaseProductState): Promise<{
  products: Product[];
  state: CatalogueState;
}> {
  const warnings: string[] = [];

  if (database.available && database.products.length > 0) {
    return {
      products: database.products,
      state: stateFor({
        source: "database",
        database,
        productCount: database.products.length,
        warnings,
      }),
    };
  }

  if (!database.available) {
    warnings.push("Product database objects are not installed or not reachable.");
  } else {
    warnings.push("Product database is available but has no catalogue rows.");
  }

  if (isMockCatalogueFallbackEnabled()) {
    warnings.push("Serving local mock products because mock catalogue fallback is enabled.");
    return {
      products: mockProducts,
      state: stateFor({
        source: "mock",
        database,
        productCount: mockProducts.length,
        warnings,
      }),
    };
  }

  return {
    products: [],
    state: stateFor({
      source: "database",
      database,
      productCount: 0,
      warnings,
    }),
  };
}

export async function getPublicCatalogueProducts(): Promise<Product[]> {
  const configuredSource = configuredCatalogueSource();
  const database = await loadDatabaseProducts();

  if (configuredSource === "shopify") {
    if (!isShopifyCatalogueConfigured()) return [];
    return loadShopifyProducts();
  }

  if (configuredSource === "mock") {
    return isMockCatalogueFallbackEnabled() ? mockProducts : [];
  }

  return (await resolveDatabaseCatalogue(database)).products;
}

export async function getPublicCatalogueProductByHandle(handle: string): Promise<Product | null> {
  const configuredSource = configuredCatalogueSource();
  const database = await loadDatabaseProducts();

  if (configuredSource === "shopify") {
    if (!isShopifyCatalogueConfigured()) return null;
    return loadShopifyProductByHandle(handle);
  }

  if (configuredSource === "mock") {
    return isMockCatalogueFallbackEnabled()
      ? (mockProducts.find((product) => product.handle === handle) ?? null)
      : null;
  }

  const products = (await resolveDatabaseCatalogue(database)).products;
  return products.find((product) => product.handle === handle) ?? null;
}

export async function getCatalogueState(): Promise<CatalogueState> {
  const configuredSource = configuredCatalogueSource();
  const database = await loadDatabaseProducts();

  if (configuredSource === "shopify") {
    const warnings = isShopifyCatalogueConfigured()
      ? ["Public catalogue is using Shopify; Admin-Lite Neon edits will not publish publicly."]
      : ["CATALOGUE_SOURCE=shopify is set, but Shopify storefront credentials are incomplete."];
    const productCount = isShopifyCatalogueConfigured() ? (await loadShopifyProducts()).length : 0;

    return stateFor({
      source: "shopify",
      database,
      productCount,
      warnings,
    });
  }

  if (configuredSource === "mock") {
    const warnings = isMockCatalogueFallbackEnabled()
      ? ["Public catalogue is using local mock products by explicit configuration."]
      : ["CATALOGUE_SOURCE=mock is set, but mock fallback is disabled in this environment."];

    return stateFor({
      source: "mock",
      database,
      productCount: isMockCatalogueFallbackEnabled() ? mockProducts.length : 0,
      warnings,
    });
  }

  return (await resolveDatabaseCatalogue(database)).state;
}

export async function getAdminCatalogueProducts(): Promise<Product[]> {
  const database = await loadDatabaseProducts();
  return database.available ? database.products : mockProducts;
}
