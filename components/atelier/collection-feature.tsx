import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/types";

export function CollectionFeature({ products }: { products: Product[] }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <div className="flex flex-col justify-between gap-6 border-y border-limestone/45 py-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-weathered-post">
            Available pieces
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-deep-brown/68">
            Prices are shown here, after the system has been introduced. Each listing is a finished
            object or compatible component within the same lighting language.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-deep-brown transition-colors hover:text-charcoal"
        >
          Full collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {featuredProducts.length === 0 ? (
        <div className="mt-8 border-t border-limestone/45 pt-8">
          <p className="max-w-xl text-sm leading-7 text-deep-brown/62">
            The public catalogue is being prepared. The atelier story remains available while the
            current release is arranged.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group block border-t border-limestone/45 pt-5"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-shell/75">
                <ProductImage
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-weathered-post">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-charcoal">
                    {product.title}
                  </h3>
                </div>
                <p className="shrink-0 text-sm font-semibold text-charcoal">
                  ${product.price}{" "}
                  <span className="text-xs font-normal text-weathered-post">
                    {product.currency}
                  </span>
                </p>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-deep-brown/65">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
