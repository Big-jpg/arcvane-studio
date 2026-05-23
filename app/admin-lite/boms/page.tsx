// app/admin-lite/boms/page.tsx
// Phase 1 read-only BOM visibility. No product or BOM persistence is performed here.

import type { Metadata } from "next";
import Link from "next/link";
import { calculateBomLineCost, calculateBomTotal, calculateGrossMargin } from "@/lib/bom-calculations";
import { products } from "@/lib/mock-products";
import { getBomComponent, getBomLinesForProduct } from "@/lib/mock-bom";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BOMs | Admin-Lite | ArcVane Studio",
  description: "Read-only product bill of materials visibility for ArcVane Studio.",
};

type AdminLiteBomsPageProps = {
  searchParams: Promise<{ productId?: string }>;
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    style: "percent",
  }).format(value / 100);
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 3,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export default async function AdminLiteBomsPage({ searchParams }: AdminLiteBomsPageProps) {
  const admin = await requireAdmin();
  const { productId } = await searchParams;

  const productsWithBom = products.filter((product) => getBomLinesForProduct(product.id).length > 0);
  const fallbackProduct = productsWithBom[0] ?? products[0] ?? null;
  const selectedProduct =
    products.find((product) => product.id === productId) ?? fallbackProduct;

  if (!selectedProduct) {
    return (
      <main className="min-h-screen bg-ivory px-4 py-10 text-charcoal sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl font-semibold">Product BOMs</h1>
          <p className="mt-3 text-sm text-charcoal/60">
            No local mock products are available for BOM visibility.
          </p>
        </div>
      </main>
    );
  }

  const bomLines = getBomLinesForProduct(selectedProduct.id);
  const totalCost = calculateBomTotal(bomLines);
  const grossProfit = selectedProduct.price - totalCost;
  const grossMarginPercent = calculateGrossMargin(selectedProduct.price, totalCost);

  const selectedProductHasBom = bomLines.length > 0;

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-warm-black py-10 text-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Admin-Lite</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold">Product BOM foundation</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-warm-white/70">
                Read-only bill of materials visibility backed by local TypeScript seed data. This
                phase does not write to the catalogue, Shopify, or the database.
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
              href="/admin/products"
              className="rounded-full border border-warm-white/15 px-4 py-2 text-sm font-medium text-warm-white/80 transition hover:border-amber hover:text-amber"
            >
              Products
            </Link>
            <Link
              href="/admin-lite/boms"
              className="rounded-full border border-amber px-4 py-2 text-sm font-medium text-amber"
            >
              BOMs
            </Link>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-charcoal">BOMs</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
              Select a local mock product to inspect its seeded component lines, calculated BOM cost,
              and gross margin using the catalogue price. This is intentionally read-only for Phase 1.
            </p>
          </div>
          <p className="text-sm text-charcoal/50">
            {productsWithBom.length} of {products.length} products have seeded BOMs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                Product selector
              </h3>
              <div className="mt-4 space-y-2">
                {products.map((product) => {
                  const lineCount = getBomLinesForProduct(product.id).length;
                  const isSelected = product.id === selectedProduct.id;

                  return (
                    <Link
                      key={product.id}
                      href={`/admin-lite/boms?productId=${encodeURIComponent(product.id)}`}
                      className={`block rounded-xl border px-4 py-3 transition ${
                        isSelected
                          ? "border-charcoal bg-charcoal text-warm-white"
                          : "border-charcoal/10 bg-ivory/40 text-charcoal hover:border-charcoal/30 hover:bg-ivory"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{product.title}</span>
                      <span
                        className={`mt-1 block text-xs ${
                          isSelected ? "text-warm-white/65" : "text-charcoal/50"
                        }`}
                      >
                        {product.id} · {lineCount > 0 ? `${lineCount} BOM lines` : "No seeded BOM"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  Product
                </p>
                <p className="mt-2 text-lg font-semibold text-charcoal">{selectedProduct.title}</p>
                <p className="mt-1 text-xs text-charcoal/50">{selectedProduct.handle}</p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  Catalogue price
                </p>
                <p className="mt-2 text-lg font-semibold text-charcoal">
                  {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                </p>
                <p className="mt-1 text-xs text-charcoal/50">{selectedProduct.currency}</p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  Total BOM cost
                </p>
                <p className="mt-2 text-lg font-semibold text-charcoal">
                  {formatCurrency(totalCost, selectedProduct.currency)}
                </p>
                <p className="mt-1 text-xs text-charcoal/50">Calculated from seeded lines</p>
              </div>
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  Gross margin
                </p>
                <p className="mt-2 text-lg font-semibold text-charcoal">
                  {formatPercent(grossMarginPercent)}
                </p>
                <p className="mt-1 text-xs text-charcoal/50">
                  Gross profit {formatCurrency(grossProfit, selectedProduct.currency)}
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm">
              <div className="border-b border-charcoal/10 px-5 py-4">
                <h3 className="font-serif text-2xl font-semibold text-charcoal">BOM lines</h3>
                <p className="mt-1 text-sm text-charcoal/60">
                  Component registry data is joined in-memory from local TypeScript seed files.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-charcoal/10 text-left text-sm">
                  <thead className="bg-ivory/70 text-xs uppercase tracking-[0.14em] text-charcoal/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Component</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Line type</th>
                      <th className="px-4 py-3 font-semibold">Quantity</th>
                      <th className="px-4 py-3 font-semibold">Unit cost</th>
                      <th className="px-4 py-3 font-semibold">Wastage</th>
                      <th className="px-4 py-3 text-right font-semibold">Extended cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/10">
                    {!selectedProductHasBom ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-charcoal/60" colSpan={7}>
                          No seeded BOM exists for this product yet.
                        </td>
                      </tr>
                    ) : (
                      bomLines.map((line) => {
                        const component = getBomComponent(line.componentId);
                        const extendedCost = calculateBomLineCost(
                          line.unitCost,
                          line.quantity,
                          line.wastagePercent,
                        );

                        return (
                          <tr key={line.id} className="align-top transition hover:bg-ivory/50">
                            <td className="px-4 py-4">
                              <p className="font-semibold text-charcoal">
                                {component?.name ?? "Missing component"}
                              </p>
                              <p className="mt-1 text-xs text-charcoal/45">{line.componentId}</p>
                              {line.notes ? (
                                <p className="mt-2 max-w-xs text-xs leading-5 text-charcoal/55">
                                  {line.notes}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-4 py-4 text-charcoal/70">
                              {component?.category ?? "Unknown"}
                            </td>
                            <td className="px-4 py-4 text-charcoal/70">{line.lineType}</td>
                            <td className="px-4 py-4 text-charcoal/70">
                              {formatQuantity(line.quantity)} {line.unit}
                            </td>
                            <td className="px-4 py-4 text-charcoal/70">
                              {formatCurrency(line.unitCost, selectedProduct.currency)} / {line.unit}
                            </td>
                            <td className="px-4 py-4 text-charcoal/70">
                              {formatPercent(line.wastagePercent)}
                            </td>
                            <td className="px-4 py-4 text-right font-semibold text-charcoal">
                              {formatCurrency(extendedCost, selectedProduct.currency)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {selectedProductHasBom ? (
                    <tfoot className="border-t border-charcoal/10 bg-ivory/50 text-sm">
                      <tr>
                        <td className="px-4 py-4 font-semibold text-charcoal" colSpan={6}>
                          Total BOM cost
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-charcoal">
                          {formatCurrency(totalCost, selectedProduct.currency)}
                        </td>
                      </tr>
                    </tfoot>
                  ) : null}
                </table>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
