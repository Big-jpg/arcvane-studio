// components/product-fulfilment-details.tsx
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
};

export function ProductFulfilmentDetails({
  product,
  componentScope,
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

  const quietFacts = [normaliseDimensions(product.dimensions), product.material, productionStatus(product)];

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

      <p className="mt-4 text-xs leading-6 text-ts-muted/70">{quietFacts.join(" · ")}</p>
    </div>
  );
}
