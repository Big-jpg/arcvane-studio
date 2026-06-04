// app/products/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { ProductImage } from "@/components/product-image";
import { getProducts, getCategories } from "@/lib/catalogue";
import type { Product, ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Lighting Collection",
  description:
    "Explore ArcVane Studio lighting objects, shade systems, and material finishes shaped for changing domestic light.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "ArcVane Studio Lighting Collection",
    description:
      "Lighting objects and interchangeable shade systems made with deliberate materials for changing rooms.",
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

function formatTimeState(timeState?: Product["timeState"]) {
  if (!timeState) {
    return null;
  }

  return timeState
    .split(" / ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
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
      <section className="bg-ts-bg py-20 text-ts-text transition-colors duration-300 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ts-accent">
              Lighting collection
            </p>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ts-text sm:text-6xl">
              Objects for shaping domestic light.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-ts-muted sm:text-lg">
              A lighting system, not a single object: shades, diffusers, stands, and finishes designed
              to change with the room from dawn to evening.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 border-y border-ts-accent/20 py-6 text-sm text-ts-muted sm:grid-cols-3">
            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-ts-muted">
                Apparatus
              </span>
              Shared E27 base, diffuser, shade, and low-heat LED source.
            </p>

            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-ts-muted">
                Materials
              </span>
              Photoluminescent minerals, UV-reactive pigments, and copper silk finishes.
            </p>

            <p>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-ts-muted">
                Production
              </span>
              Atelier-scale batches, made with restraint rather than volume.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-ts-accent/20 bg-ts-surface/80 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 overflow-x-auto py-5 scrollbar-none">
            <Link
              href="/products"
              className={
                activeCategory === null
                  ? "shrink-0 rounded-full bg-ts-text px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ts-bg"
                  : "shrink-0 rounded-full border border-ts-accent/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted transition-colors hover:border-ts-accent/45 hover:text-ts-text"
              }
            >
              All objects
            </Link>

            {categories.map((category) => (
              <Link
                key={category}
                href={categoryHref(category)}
                className={
                  activeCategory === category
                    ? "shrink-0 rounded-full bg-ts-text px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ts-bg"
                    : "shrink-0 rounded-full border border-ts-accent/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted transition-colors hover:border-ts-accent/45 hover:text-ts-text"
                }
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ts-bg py-16 text-ts-text transition-colors duration-300 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ts-muted">
                {activeCategory ?? "Full collection"}
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ts-text sm:text-3xl">
                {activeCategory
                  ? `${visibleProducts.length} ${
                      visibleProducts.length === 1 ? "piece" : "pieces"
                    } in ${activeCategory}`
                  : "Lighting objects, diffusers, and shade systems"}
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-ts-muted">
              Each listing belongs to the same modular lighting system. Finish, opacity, and
              reflected colour may shift with material, LED temperature, and time of day.
            </p>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="rounded-[1.75rem] border border-ts-accent/20 bg-ts-surface/65 p-8">
              <p className="max-w-xl text-sm leading-7 text-ts-muted">
                No objects are currently published in this view. The next considered release will
                appear here when it is ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.handle}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-ts-accent/20 bg-ts-surface/70 shadow-sm ">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-8 transition duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ts-muted">
                        {formatTimeState(product.timeState) ?? product.category}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-ts-text">
                        {product.title}
                      </h3>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-ts-text">
                      ${product.price}{" "}
                      <span className="font-normal text-ts-muted">{product.currency}</span>
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-ts-muted">
                    {product.behaviourNote ?? product.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.colours.slice(0, 3).map((colour) => (
                      <span
                        key={colour}
                        className="rounded-full border border-ts-accent/20 px-3 py-1 text-xs text-ts-muted"
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
