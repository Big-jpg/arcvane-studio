// app/products/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { ProductImage } from "@/components/product-image";
import { getProducts, getCategories } from "@/lib/catalogue";
import type { ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Explore ArcVane Studio coastal lighting pieces, shade sets, table lamps, and E27 accessories made in Western Australia.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "ArcVane Studio Collection",
    description:
      "Small-run coastal lighting pieces, clear PLA diffusers, matte stands, and interchangeable shade sets.",
    url: "/products",
    images: [
      {
        url: "/og-product-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "ArcVane Studio coastal lighting collection",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

function isProductCategory(
  value: string | undefined,
  categories: ProductCategory[],
): value is ProductCategory {
  return typeof value === "string" && categories.includes(value as ProductCategory);
}

function categoryHref(category: ProductCategory): string {
  return `/products?category=${encodeURIComponent(category)}`;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts();
  const categories = getCategories();
  const params = searchParams ? await searchParams : {};
  const activeCategory = isProductCategory(params.category, categories) ? params.category : null;

  const visibleProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
              Current collection
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
              Coastal lighting pieces, released in small runs.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
              Translucent diffusers, matte tripod stands, shade sets, and compact table forms shaped
              by Western Australian coastal light.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 border-y border-charcoal/10 py-6 text-sm text-deep-brown/65 sm:grid-cols-3">
            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-weathered-post">
                System
              </span>
              Shared E27 hardware. Low-power LED only.
            </p>

            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-weathered-post">
                Materials
              </span>
              Clear PLA glow, matte PLA bodies, subtle batch variation.
            </p>

            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-weathered-post">
                Scale
              </span>
              Compact pieces designed for real rooms and practical delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-charcoal/10 bg-off-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-5 scrollbar-none">
            <Link
              href="/products"
              className={
                activeCategory === null
                  ? "shrink-0 rounded-full bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-off-white"
                  : "shrink-0 rounded-full border border-charcoal/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-deep-brown/60 transition-colors hover:border-charcoal/30 hover:text-charcoal"
              }
            >
              All pieces
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={categoryHref(category)}
                className={
                  activeCategory === category
                    ? "shrink-0 rounded-full bg-charcoal px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-off-white"
                    : "shrink-0 rounded-full border border-charcoal/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-deep-brown/60 transition-colors hover:border-charcoal/30 hover:text-charcoal"
                }
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-weathered-post">
                {activeCategory ?? "Full collection"}
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                {activeCategory
                  ? `${visibleProducts.length} ${
                      visibleProducts.length === 1 ? "piece" : "pieces"
                    } in ${activeCategory}`
                  : "Finished lamps, diffusers, and shade systems"}
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-deep-brown/65">
              Each listing is a finished object or compatible shade set. Surface, opacity, and
              colour may vary slightly between batches.
            </p>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-8">
              <p className="max-w-xl text-sm leading-7 text-deep-brown/65">
                No pieces are currently published in this view. The next small-run release will
                appear here when it is ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.handle}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-charcoal/10 bg-shell/70 shadow-sm shadow-charcoal/5">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-8 transition duration-500 group-hover:scale-[1.025]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-weathered-post">
                        {product.category}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-charcoal">
                        {product.title}
                      </h3>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-charcoal">
                      ${product.price}{" "}
                      <span className="font-normal text-deep-brown/45">{product.currency}</span>
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-deep-brown/65">
                    {product.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.colours.slice(0, 3).map((colour) => (
                      <span
                        key={colour}
                        className="rounded-full border border-charcoal/10 px-3 py-1 text-xs text-deep-brown/55"
                      >
                        {colour}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
