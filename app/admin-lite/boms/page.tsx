// app/admin-lite/boms/page.tsx
// Phase 2 BOM admin: database-backed CRUD with mock seed fallback when persisted data is absent.

import type { Metadata } from "next";
import Link from "next/link";
import { BomLineManager, ComponentRegistryManager } from "@/components/admin-lite/bom-crud-controls";
import { calculateBomLineCost, calculateBomTotal, calculateGrossMargin } from "@/lib/bom-calculations";
import type { BomComponent, ProductBomLine } from "@/lib/bom-types";
import { requireAdmin } from "@/lib/admin-auth";
import { bomComponents, getBomComponent, getBomLinesForProduct } from "@/lib/mock-bom";
import { products } from "@/lib/mock-products";
import { getProductBom, listBomComponents } from "@/server/db/bom-contracts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BOMs | Admin-Lite | ArcVane Studio",
  description: "Database-backed product bill of materials management for ArcVane Studio.",
};

type AdminLiteBomsPageProps = {
  searchParams: Promise<{ productId?: string }>;
};

type DataSource = "database" | "mock";

type DisplayBomLine = ProductBomLine & {
  componentName?: string;
  componentCategory?: BomComponent["category"];
  componentSupplier?: string | null;
  componentNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ProductBomState = {
  productId: string;
  lines: DisplayBomLine[];
  dataSource: DataSource;
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

async function loadBomStates(): Promise<{
  databaseAvailable: boolean;
  databaseComponents: BomComponent[];
  productBomStates: ProductBomState[];
}> {
  let databaseComponents: BomComponent[] = [];
  let databaseLinesByProduct = new Map<string, DisplayBomLine[]>();
  let databaseAvailable = true;

  try {
    databaseComponents = await listBomComponents();
    const databaseLineEntries = await Promise.all(
      products.map(async (product) => [product.id, await getProductBom(product.id)] as const),
    );
    databaseLinesByProduct = new Map(databaseLineEntries);
  } catch {
    databaseAvailable = false;
  }

  const productBomStates = products.map<ProductBomState>((product) => {
    const databaseLines = databaseAvailable ? databaseLinesByProduct.get(product.id) ?? [] : [];

    if (databaseLines.length > 0) {
      return {
        productId: product.id,
        lines: databaseLines,
        dataSource: "database",
      };
    }

    return {
      productId: product.id,
      lines: getBomLinesForProduct(product.id),
      dataSource: "mock",
    };
  });

  return { databaseAvailable, databaseComponents, productBomStates };
}

function resolveComponent(line: DisplayBomLine): Pick<BomComponent, "name" | "category"> | null {
  if (line.componentName && line.componentCategory) {
    return {
      name: line.componentName,
      category: line.componentCategory,
    };
  }

  const mockComponent = getBomComponent(line.componentId);

  if (!mockComponent) return null;

  return {
    name: mockComponent.name,
    category: mockComponent.category,
  };
}

export default async function AdminLiteBomsPage({ searchParams }: AdminLiteBomsPageProps) {
  const admin = await requireAdmin();
  const { productId } = await searchParams;
  const { databaseAvailable, databaseComponents, productBomStates } = await loadBomStates();

  const stateByProduct = new Map(productBomStates.map((state) => [state.productId, state]));
  const productsWithBom = products.filter((product) => (stateByProduct.get(product.id)?.lines.length ?? 0) > 0);
  const fallbackProduct = productsWithBom[0] ?? products[0] ?? null;
  const selectedProduct = products.find((product) => product.id === productId) ?? fallbackProduct;

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

  const selectedBomState = stateByProduct.get(selectedProduct.id) ?? {
    productId: selectedProduct.id,
    lines: [],
    dataSource: "mock" as const,
  };
  const bomLines = selectedBomState.lines;
  const totalCost = calculateBomTotal(bomLines);
  const grossProfit = selectedProduct.price - totalCost;
  const grossMarginPercent = calculateGrossMargin(selectedProduct.price, totalCost);
  const selectedProductHasBom = bomLines.length > 0;
  const registryForDisplay = databaseAvailable ? databaseComponents : bomComponents;

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-warm-black py-10 text-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Admin-Lite</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold">Product BOM foundation</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-warm-white/70">
                Database-backed component and product BOM management. Persisted BOM data takes priority;
                seeded TypeScript mock data remains available as read-only fallback.
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
            <h2 className="font-serif text-3xl font-semibold text-charcoal">BOMs</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
              Select a product to inspect its effective BOM. The selected view is labelled as database or
              mock so cost outputs remain traceable during migration.
            </p>
          </div>
          <div className="text-sm text-charcoal/50 sm:text-right">
            <p>
              {productsWithBom.length} of {products.length} products have effective BOM data
            </p>
            <p className="mt-1">
              Database: {databaseAvailable ? `${databaseComponents.length} components loaded` : "unavailable"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                Product selector
              </h3>
              <div className="mt-4 space-y-2">
                {products.map((product) => {
                  const productState = stateByProduct.get(product.id);
                  const lineCount = productState?.lines.length ?? 0;
                  const isSelected = product.id === selectedProduct.id;
                  const sourceLabel = productState?.dataSource === "database" ? "DB" : "mock";

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
                        {product.id} · {lineCount > 0 ? `${lineCount} ${sourceLabel} lines` : "No BOM data"}
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
                <p className="mt-1 text-xs text-charcoal/50">
                  Calculated from {selectedBomState.dataSource === "database" ? "database" : "mock"} lines
                </p>
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

            <div
              className={`rounded-2xl border px-5 py-4 text-sm ${
                selectedBomState.dataSource === "database"
                  ? "border-emerald-900/15 bg-emerald-50 text-emerald-950"
                  : "border-amber/30 bg-amber/10 text-charcoal"
              }`}
            >
              <p className="font-semibold">
                Data source: {selectedBomState.dataSource === "database" ? "database" : "mock fallback"}
              </p>
              <p className="mt-1 leading-6 opacity-75">
                {selectedBomState.dataSource === "database"
                  ? "Persisted BOM lines exist for this product and override seeded mock data."
                  : "No persisted BOM lines exist for this product, so the Phase 1 mock seed remains in use."}
              </p>
            </div>

            <section className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm">
              <div className="border-b border-charcoal/10 px-5 py-4">
                <h3 className="font-serif text-2xl font-semibold text-charcoal">BOM lines</h3>
                <p className="mt-1 text-sm text-charcoal/60">
                  Component data is resolved from the database when persisted lines are present, otherwise
                  from the local TypeScript seed registry.
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
                          No BOM exists for this product yet.
                        </td>
                      </tr>
                    ) : (
                      bomLines.map((line) => {
                        const component = resolveComponent(line);
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

            <BomLineManager
              productId={selectedProduct.id}
              components={databaseComponents}
              bomLines={bomLines}
              dataSource={selectedBomState.dataSource}
              databaseAvailable={databaseAvailable}
            />

            <ComponentRegistryManager
              components={registryForDisplay}
              databaseAvailable={databaseAvailable}
              compact
            />
          </div>
        </div>
      </section>
    </main>
  );
}
