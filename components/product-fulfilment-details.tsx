// components/product-fulfilment-details.tsx
import { CheckCircle2 } from "lucide-react";
import type { Product, ProductComponentScope } from "@/lib/types";

function normaliseDimensions(dimensions: string): string {
  const trimmed = dimensions.trim();
  return trimmed.length > 0 ? trimmed : "Ø —mm × H —mm";
}

function productionStatus(product: Product): string {
  if (product.productionNotes?.trim()) {
    return product.productionNotes.trim();
  }

  if (product.inStock) {
    return "Available in the current small-batch run; fulfilment timing is confirmed after order.";
  }

  return "Made to order or held for the next small-batch release.";
}

function formatList(values: string[]): string {
  return values.join(", ");
}

type ProductFulfilmentDetailsProps = {
  product: Product;
  componentScope: ProductComponentScope;
  primaryAdapter: string;
};

export function ProductFulfilmentDetails({
  product,
  componentScope,
  primaryAdapter,
}: ProductFulfilmentDetailsProps) {
  const practicalGroups = [
    {
      title: "Included",
      values: componentScope.included,
    },
    {
      title: "Not included",
      values: componentScope.notIncluded,
    },
    {
      title: "Required",
      values: componentScope.customerSupplied,
    },
  ];

  const factRows = [
    ["Dimensions", normaliseDimensions(product.dimensions)],
    ["Material", product.material],
    ["Compatible use", componentScope.compatibility],
    [
      "Safety constraints",
      "Indoor use only. Low-heat LED bulbs only; not for incandescent, halogen, heat lamp, appliance bulb, or unknown high-temperature use.",
    ],
    [
      "Care guidance",
      "Dust with a soft dry cloth. Keep away from heat, moisture, abrasive cleaners, and prolonged direct heat exposure.",
    ],
    ["Made / supplied", productionStatus(product)],
  ] as const;

  const trustAnchors = [
    "Made in small batches",
    "Indoor use only",
    "Low-heat LED only",
    "Designed and produced by ArcVane Studio",
    "Small additive-production variations are expected",
  ];

  return (
    <div className="mt-8 border-t border-ts-accent/20 pt-7">
      <h2 className="text-sm font-semibold text-ts-text">In the box and setup</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {practicalGroups.map((group) => (
          <div key={group.title} className="rounded-2xl border border-ts-accent/20 bg-ts-bg p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted">
              {group.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-ts-muted">{formatList(group.values)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-ts-accent/20 bg-ts-bg">
        <dl className="divide-y divide-ts-accent/15">
          {factRows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]">
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted">
                {label}
              </dt>
              <dd className="text-sm leading-7 text-ts-muted">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Product trust and safety markers">
        {trustAnchors.map((anchor) => (
          <span
            key={anchor}
            className="inline-flex items-center gap-1.5 rounded-full border border-ts-accent/20 bg-ts-surface/60 px-3 py-1.5 text-xs text-ts-muted"
          >
            <CheckCircle2 className="h-3 w-3 text-ts-accent" />
            {anchor}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs leading-6 text-ts-muted">
        The {primaryAdapter} compatibility note describes the intended mechanical and dimensional fit; it
        does not mean ArcVane supplies or modifies the customer&apos;s electrical assembly.
      </p>
    </div>
  );
}
