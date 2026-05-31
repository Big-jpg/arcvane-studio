// app/admin-lite/products/page.tsx
// Admin-Lite product catalogue management page.

import type { Metadata } from "next";
import Link from "next/link";
import { ProductCatalogueManager } from "@/components/admin-lite/product-catalogue-manager";
import { requireAdmin } from "@/lib/admin-auth";
import type { Product } from "@/lib/types";
import {
  getAdminCatalogueProducts,
  getCatalogueState,
  type CatalogueState,
} from "@/server/catalogue/state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | Admin-Lite | ArcVane Studio",
  description: "Product catalogue management for ArcVane Studio.",
};

async function loadProductState(): Promise<{
  catalogueState: CatalogueState;
  products: Product[];
}> {
  const [catalogueState, products] = await Promise.all([
    getCatalogueState(),
    getAdminCatalogueProducts(),
  ]);

  return { catalogueState, products };
}

export default async function AdminLiteProductsPage() {
  const admin = await requireAdmin();
  const { catalogueState, products } = await loadProductState();

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-warm-black py-10 text-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Admin-Lite</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold">Product catalogue</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-warm-white/70">
                Manage the Neon catalogue that publishes ArcVane&apos;s public collection, with
                draft rows held out of stock until they are ready.
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
              Create and maintain product rows, review public-facing listing quality, and capture
              optional share copy without changing the database contract. Public visibility is
              governed by catalogue source and readiness diagnostics below.
            </p>
          </div>
          <p className="text-sm text-charcoal/50">
            Public source: {catalogueState.source} ·{" "}
            {catalogueState.editable ? "Neon editable" : "Neon not publishing"} ·{" "}
            {catalogueState.productCount} public products
          </p>
        </div>

        {catalogueState.warnings.length > 0 ? (
          <div className="mb-6 grid gap-2">
            {catalogueState.warnings.map((warning) => (
              <p
                key={warning}
                className="rounded-2xl border border-amber/40 bg-amber/10 p-4 text-sm leading-6 text-charcoal"
              >
                {warning}
              </p>
            ))}
          </div>
        ) : null}

        <ProductCatalogueManager
          products={products}
          databaseAvailable={catalogueState.databaseAvailable}
          catalogueSource={catalogueState.source}
        />
      </section>
    </main>
  );
}
