// app/admin-lite/products/page.tsx
// Admin-Lite product catalogue management page.

import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalogueManager } from "@/components/admin-lite/product-catalogue-manager";
import { getCatalogueSource } from "@/lib/catalogue";
import { requireAdmin } from "@/lib/admin-auth";
import { products as mockProducts } from "@/lib/mock-products";
import type { Product } from "@/lib/types";
import { listAdminProducts } from "@/server/db/product-contracts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | Admin-Lite | ArcVane Studio",
  description: "Product catalogue management for ArcVane Studio.",
};

type CatalogueSource = "shopify" | "database" | "mock";

async function loadProductState(): Promise<{
  databaseAvailable: boolean;
  catalogueSource: CatalogueSource;
  products: Product[];
}> {
  try {
    const [products, catalogueSource] = await Promise.all([listAdminProducts(), getCatalogueSource()]);

    return {
      databaseAvailable: true,
      catalogueSource,
      products,
    };
  } catch {
    return {
      databaseAvailable: false,
      catalogueSource: "mock",
      products: mockProducts,
    };
  }
}

export default async function AdminLiteProductsPage() {
  const admin = await requireAdmin();
  const { databaseAvailable, catalogueSource, products } = await loadProductState();

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-warm-black py-10 text-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Admin-Lite</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold">Product catalogue</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-warm-white/70">
                Manage internal product records that can become the live catalogue once database rows exist. Shopify
                still takes precedence when the Shopify Storefront environment is configured.
              </p>
            </div>
            <p className="text-sm text-warm-white/60">Signed in as {admin.email}</p>
          </div>
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Admin navigation">
            <Link
              href="/admin"
              className="rounded-full border border-warm-white/15 px-4 py-2 text-sm font-medium text-warm-white/80 transition hover:border-amber hover:text-amber"
            >
              Overview
            </Link>
            <Link
              href="/admin-lite/products"
              className="rounded-full border border-amber px-4 py-2 text-sm font-medium text-amber"
            >
              Products
            </Link>
            <Link
              href="/admin-lite/boms"
              className="rounded-full border border-warm-white/15 px-4 py-2 text-sm font-medium text-warm-white/80 transition hover:border-amber hover:text-amber"
            >
              BOMs
            </Link>
            <Link
              href="/admin-lite/components"
              className="rounded-full border border-warm-white/15 px-4 py-2 text-sm font-medium text-warm-white/80 transition hover:border-amber hover:text-amber"
            >
              Components
            </Link>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-charcoal">Products</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
              Create and maintain product rows using raw SQL-backed stored procedures. If the product schema has not
              been installed, the static mock catalogue remains visible here as read-only fallback data.
            </p>
          </div>
          <p className="text-sm text-charcoal/50">
            Catalogue source: {catalogueSource} · Data layer: {databaseAvailable ? "database writable" : "mock read-only"} · {products.length} products
          </p>
        </div>

        {!databaseAvailable ? (
          <div className="mb-6 rounded-2xl border border-amber/40 bg-amber/10 p-4 text-sm leading-6 text-charcoal">
            Product database objects are not installed or not reachable. Public catalogue pages continue to use the
            existing mock fallback, and this page disables writes until the migration and procedures are applied.
          </div>
        ) : catalogueSource === "mock" ? (
          <div className="mb-6 rounded-2xl border border-charcoal/10 bg-white p-4 text-sm leading-6 text-charcoal/60">
            The product table is available but empty, so the public catalogue still reads from mock products. Adding
            the first database product will switch the non-Shopify catalogue source to database rows.
          </div>
        ) : null}

        <ProductCatalogueManager
          products={products}
          databaseAvailable={databaseAvailable}
          catalogueSource={catalogueSource}
        />
      </section>
    </main>
  );
}
