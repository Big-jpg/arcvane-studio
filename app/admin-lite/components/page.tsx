// app/admin-lite/components/page.tsx
// Full component registry management for Admin-Lite BOM costing.

import type { Metadata } from "next";
import Link from "next/link";
import { ComponentRegistryManager } from "@/components/admin-lite/bom-crud-controls";
import type { BomComponent } from "@/lib/bom-types";
import { requireAdmin } from "@/lib/admin-auth";
import { bomComponents } from "@/lib/mock-bom";
import { listBomComponents } from "@/server/db/bom-contracts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Components | Admin-Lite | ArcVane Studio",
  description: "BOM component registry management for ArcVane Studio.",
};

async function loadComponents(): Promise<{
  databaseAvailable: boolean;
  components: BomComponent[];
}> {
  try {
    return {
      databaseAvailable: true,
      components: await listBomComponents(),
    };
  } catch {
    return {
      databaseAvailable: false,
      components: bomComponents,
    };
  }
}

export default async function AdminLiteComponentsPage() {
  const admin = await requireAdmin();
  const { databaseAvailable, components } = await loadComponents();

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <section className="border-b border-charcoal/10 bg-warm-black py-10 text-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Admin-Lite</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold">Component registry</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-warm-white/70">
                Manage reusable cost components consumed by product BOM lines. This page is isolated from
                catalogue publishing and writes only through BOM stored procedures.
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
              className="rounded-full border border-warm-white/15 px-4 py-2 text-sm font-medium text-warm-white/80 transition hover:border-amber hover:text-amber"
            >
              BOMs
            </Link>
            <Link
              href="/admin-lite/components"
              className="rounded-full border border-amber px-4 py-2 text-sm font-medium text-amber"
            >
              Components
            </Link>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-charcoal">Components</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-charcoal/60">
              Add, edit, and delete registry entries used for database-backed BOM line costing. If the BOM
              schema has not been installed, the Phase 1 mock registry is shown read-only.
            </p>
          </div>
          <p className="text-sm text-charcoal/50">
            Data source: {databaseAvailable ? "database" : "mock fallback"} · {components.length} components
          </p>
        </div>

        <ComponentRegistryManager components={components} databaseAvailable={databaseAvailable} />
      </section>
    </main>
  );
}
