// components/admin-lite/bom-crud-controls.tsx
// Client-side controls for BOM component and product line CRUD. API routes enforce admin auth.

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  BOM_LINE_TYPES,
  COMPONENT_CATEGORIES,
  type BomComponent,
  type BomLineType,
  type ComponentCategory,
  type ProductBomLine,
} from "@/lib/bom-types";

type EditableComponent = BomComponent & {
  createdAt?: string;
  updatedAt?: string;
};

type EditableBomLine = ProductBomLine & {
  componentName?: string;
  componentCategory?: ComponentCategory;
  componentSupplier?: string | null;
  componentNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ComponentFormState = {
  id: string;
  name: string;
  category: ComponentCategory;
  unit: string;
  unitCost: string;
  supplier: string;
  notes: string;
};

type BomLineFormState = {
  id: string;
  componentId: string;
  lineType: BomLineType;
  quantity: string;
  wastagePercent: string;
  sortOrder: string;
  notes: string;
};

type ComponentApiResponse = {
  ok: boolean;
  error?: string;
};

type BomLineApiResponse = {
  ok: boolean;
  error?: string;
};

const emptyComponentForm: ComponentFormState = {
  id: "",
  name: "",
  category: "Printed part",
  unit: "each",
  unitCost: "0",
  supplier: "",
  notes: "",
};

function createEmptyBomLineForm(componentId: string, nextSortOrder: number): BomLineFormState {
  return {
    id: "",
    componentId,
    lineType: "material",
    quantity: "1",
    wastagePercent: "0",
    sortOrder: String(nextSortOrder),
    notes: "",
  };
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function componentToForm(component: EditableComponent): ComponentFormState {
  return {
    id: component.id,
    name: component.name,
    category: component.category,
    unit: component.unit,
    unitCost: String(component.unitCost),
    supplier: component.supplier ?? "",
    notes: component.notes ?? "",
  };
}

function lineToForm(line: EditableBomLine): BomLineFormState {
  return {
    id: line.id,
    componentId: line.componentId,
    lineType: line.lineType,
    quantity: String(line.quantity),
    wastagePercent: String(line.wastagePercent),
    sortOrder: String(line.sortOrder),
    notes: line.notes ?? "",
  };
}

async function parseJsonResponse<T extends { ok: boolean; error?: string }>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error ?? "BOM operation failed.");
  }

  return payload;
}

export function ComponentRegistryManager({
  components,
  databaseAvailable,
  compact = false,
}: {
  components: EditableComponent[];
  databaseAvailable: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ComponentFormState>(emptyComponentForm);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setForm(emptyComponentForm);
  }

  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-charcoal">Component registry</h3>
          <p className="mt-1 text-sm leading-6 text-charcoal/60">
            {databaseAvailable
              ? "Create and maintain reusable cost components used by product BOM lines."
              : "Database tables are not available; seeded mock components are shown read-only."}
          </p>
        </div>
        {form.id ? (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber"
          >
            New component
          </button>
        ) : null}
      </div>

      <form
        className="mt-5 grid gap-3 rounded-xl border border-charcoal/10 bg-ivory/40 p-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(null);

          if (!databaseAvailable) {
            setMessage("Install the BOM migration and procedures before editing components.");
            return;
          }

          startTransition(async () => {
            try {
              await parseJsonResponse<ComponentApiResponse>(
                await fetch("/api/admin/components", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: form.id || null,
                    name: form.name,
                    category: form.category,
                    unit: form.unit,
                    unitCost: Number(form.unitCost),
                    supplier: form.supplier || null,
                    notes: form.notes || null,
                  }),
                }),
              );
              setMessage(form.id ? "Component updated." : "Component created.");
              resetForm();
              router.refresh();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Component save failed.");
            }
          });
        }}
      >
        <label className="block text-sm font-semibold text-charcoal">
          Name
          <input
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Category
          <select
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value as ComponentCategory,
              }))
            }
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          >
            {COMPONENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Unit
          <input
            value={form.unit}
            onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Unit cost
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.unitCost}
            onChange={(event) =>
              setForm((current) => ({ ...current, unitCost: event.target.value }))
            }
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Supplier
          <input
            value={form.supplier}
            onChange={(event) =>
              setForm((current) => ({ ...current, supplier: event.target.value }))
            }
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal md:col-span-2">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            disabled={!databaseAvailable || isPending}
            className="mt-1 min-h-24 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={!databaseAvailable || isPending}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-warm-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : form.id ? "Update component" : "Add component"}
          </button>
          {message ? <p className="text-sm text-charcoal/70">{message}</p> : null}
        </div>
      </form>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full divide-y divide-charcoal/10 text-left text-sm">
          <thead className="bg-ivory/70 text-xs uppercase tracking-[0.14em] text-charcoal/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
              <th className="px-4 py-3 font-semibold">Unit cost</th>
              {!compact ? <th className="px-4 py-3 font-semibold">Supplier</th> : null}
              {!compact ? <th className="px-4 py-3 font-semibold">Notes</th> : null}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {components.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-charcoal/60" colSpan={compact ? 5 : 7}>
                  No database components exist yet.
                </td>
              </tr>
            ) : (
              components.map((component) => (
                <tr key={component.id} className="align-top transition hover:bg-ivory/50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-charcoal">{component.name}</p>
                    <p className="mt-1 text-xs text-charcoal/45">{component.id}</p>
                  </td>
                  <td className="px-4 py-4 text-charcoal/70">{component.category}</td>
                  <td className="px-4 py-4 text-charcoal/70">{component.unit}</td>
                  <td className="px-4 py-4 text-charcoal/70">
                    {formatCurrency(component.unitCost, component.currency)}
                  </td>
                  {!compact ? (
                    <td className="px-4 py-4 text-charcoal/70">{component.supplier ?? "—"}</td>
                  ) : null}
                  {!compact ? (
                    <td className="max-w-sm px-4 py-4 text-charcoal/70">{component.notes ?? "—"}</td>
                  ) : null}
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setForm(componentToForm(component))}
                        disabled={!databaseAvailable || isPending}
                        className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-amber disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={!databaseAvailable || isPending}
                        onClick={() => {
                          if (!confirm(`Delete component ${component.name}? Dependent BOM lines will be removed.`)) {
                            return;
                          }

                          setMessage(null);
                          startTransition(async () => {
                            try {
                              await parseJsonResponse<ComponentApiResponse>(
                                await fetch(`/api/admin/components/${component.id}`, {
                                  method: "DELETE",
                                }),
                              );
                              setMessage("Component deleted.");
                              resetForm();
                              router.refresh();
                            } catch (error) {
                              setMessage(
                                error instanceof Error ? error.message : "Component delete failed.",
                              );
                            }
                          });
                        }}
                        className="rounded-full border border-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-900 transition hover:border-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function BomLineManager({
  productId,
  components,
  bomLines,
  dataSource,
  databaseAvailable,
}: {
  productId: string;
  components: EditableComponent[];
  bomLines: EditableBomLine[];
  dataSource: "database" | "mock";
  databaseAvailable: boolean;
}) {
  const router = useRouter();
  const nextSortOrder = useMemo(() => {
    const maxSortOrder = bomLines.reduce((max, line) => Math.max(max, line.sortOrder), 0);
    return maxSortOrder + 10;
  }, [bomLines]);
  const defaultComponentId = components[0]?.id ?? "";
  const [form, setForm] = useState<BomLineFormState>(
    createEmptyBomLineForm(defaultComponentId, nextSortOrder),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canWrite = databaseAvailable && components.length > 0;

  function resetForm() {
    setForm(createEmptyBomLineForm(defaultComponentId, nextSortOrder));
  }

  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-charcoal">BOM line editor</h3>
          <p className="mt-1 text-sm leading-6 text-charcoal/60">
            {dataSource === "database"
              ? "Add, update, or remove persisted lines for the selected product."
              : "Current displayed lines are mock fallback data. Create database lines to take priority."}
          </p>
        </div>
        {form.id ? (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber"
          >
            New BOM line
          </button>
        ) : null}
      </div>

      <form
        className="mt-5 grid gap-3 rounded-xl border border-charcoal/10 bg-ivory/40 p-4 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(null);

          if (!canWrite) {
            setMessage("Create database components before editing BOM lines.");
            return;
          }

          startTransition(async () => {
            try {
              await parseJsonResponse<BomLineApiResponse>(
                await fetch("/api/admin/bom-lines", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: form.id || null,
                    productId,
                    componentId: form.componentId,
                    lineType: form.lineType,
                    quantity: Number(form.quantity),
                    wastagePercent: Number(form.wastagePercent),
                    sortOrder: Number(form.sortOrder),
                    notes: form.notes || null,
                  }),
                }),
              );
              setMessage(form.id ? "BOM line updated." : "BOM line created.");
              resetForm();
              router.refresh();
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "BOM line save failed.");
            }
          });
        }}
      >
        <label className="block text-sm font-semibold text-charcoal md:col-span-2">
          Component
          <select
            value={form.componentId}
            onChange={(event) =>
              setForm((current) => ({ ...current, componentId: event.target.value }))
            }
            disabled={!canWrite || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          >
            {components.length === 0 ? <option value="">No database components</option> : null}
            {components.map((component) => (
              <option key={component.id} value={component.id}>
                {component.category} · {component.name} ({component.unit})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Line type
          <select
            value={form.lineType}
            onChange={(event) =>
              setForm((current) => ({ ...current, lineType: event.target.value as BomLineType }))
            }
            disabled={!canWrite || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          >
            {BOM_LINE_TYPES.map((lineType) => (
              <option key={lineType} value={lineType}>
                {lineType}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Quantity
          <input
            type="number"
            min="0.0001"
            step="0.0001"
            value={form.quantity}
            onChange={(event) =>
              setForm((current) => ({ ...current, quantity: event.target.value }))
            }
            disabled={!canWrite || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
            required
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Wastage %
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.wastagePercent}
            onChange={(event) =>
              setForm((current) => ({ ...current, wastagePercent: event.target.value }))
            }
            disabled={!canWrite || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal">
          Sort order
          <input
            type="number"
            step="1"
            value={form.sortOrder}
            onChange={(event) =>
              setForm((current) => ({ ...current, sortOrder: event.target.value }))
            }
            disabled={!canWrite || isPending}
            className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          />
        </label>
        <label className="block text-sm font-semibold text-charcoal md:col-span-3">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            disabled={!canWrite || isPending}
            className="mt-1 min-h-24 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-3">
          <button
            type="submit"
            disabled={!canWrite || isPending}
            className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-warm-white transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : form.id ? "Update BOM line" : "Add BOM line"}
          </button>
          {message ? <p className="text-sm text-charcoal/70">{message}</p> : null}
        </div>
      </form>

      {dataSource === "database" && bomLines.length > 0 ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-charcoal/10 text-left text-sm">
            <thead className="bg-ivory/70 text-xs uppercase tracking-[0.14em] text-charcoal/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Component</th>
                <th className="px-4 py-3 font-semibold">Line type</th>
                <th className="px-4 py-3 font-semibold">Quantity</th>
                <th className="px-4 py-3 font-semibold">Sort</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {bomLines.map((line) => (
                <tr key={line.id} className="align-top transition hover:bg-ivory/50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-charcoal">{line.componentName ?? line.componentId}</p>
                    <p className="mt-1 text-xs text-charcoal/45">{line.componentId}</p>
                  </td>
                  <td className="px-4 py-4 text-charcoal/70">{line.lineType}</td>
                  <td className="px-4 py-4 text-charcoal/70">
                    {line.quantity} {line.unit}
                  </td>
                  <td className="px-4 py-4 text-charcoal/70">{line.sortOrder}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setForm(lineToForm(line))}
                        disabled={!canWrite || isPending}
                        className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-amber disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={!canWrite || isPending}
                        onClick={() => {
                          if (!confirm(`Delete BOM line ${line.componentName ?? line.id}?`)) return;

                          setMessage(null);
                          startTransition(async () => {
                            try {
                              await parseJsonResponse<BomLineApiResponse>(
                                await fetch(`/api/admin/bom-lines/${line.id}`, { method: "DELETE" }),
                              );
                              setMessage("BOM line deleted.");
                              resetForm();
                              router.refresh();
                            } catch (error) {
                              setMessage(error instanceof Error ? error.message : "BOM line delete failed.");
                            }
                          });
                        }}
                        className="rounded-full border border-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-900 transition hover:border-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
