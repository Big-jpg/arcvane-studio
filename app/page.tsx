// app/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

import { ProductImage } from "@/components/product-image";
import { ApparatusScrollSequence } from "@/components/time-state/apparatus-scroll-sequence";
import { ChapterPanel } from "@/components/time-state/chapter-panel";
import { HomeTimeStateObserver } from "@/components/time-state/home-time-state-observer";
import { StartEveningButton } from "@/components/time-state/start-evening-button";
import { getProducts } from "@/lib/catalogue";
import { timeChapters } from "@/lib/time-chapters";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "ArcVane Studio",
  description:
    "Modular lighting apparatus for homes that value atmosphere, material, and restraint.",
};

export const dynamic = "force-dynamic";

function formatTimeState(timeState?: Product["timeState"]) {
  if (!timeState) {
    return null;
  }

  return timeState
    .split(" / ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

function formatPrice(product: Product) {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: product.currency || "AUD",
    }).format(product.price);
  } catch {
    return `$${product.price.toFixed(2)}`;
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const previewProducts = products.slice(0, 6);

  return (
    <main>
      <HomeTimeStateObserver />
      <section className="bg-ts-bg px-6 pb-20 pt-24 text-ts-text transition-colors duration-300 sm:px-8 sm:pt-28 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 text-center">
          <div className="max-w-4xl space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-ts-accent">
              ArcVane Studio
            </p>
            <h1 className="text-5xl font-medium tracking-[-0.055em] text-ts-text sm:text-6xl lg:text-8xl">
              Light, shaped for the room it enters.
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-ts-muted sm:text-xl sm:leading-9">
              ArcVane creates modular lighting apparatus for homes that value atmosphere,
              material, and restraint.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#chapter-dawn"
                className="inline-flex items-center justify-center rounded-full bg-ts-accent px-7 py-3 text-sm font-semibold text-ts-bg shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-ts-text hover:text-ts-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Explore the light
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-ts-accent/40 px-7 py-3 text-sm font-semibold text-ts-text transition duration-300 hover:-translate-y-0.5 hover:border-ts-text hover:bg-ts-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                View shades
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-4xl">
            <div className="absolute inset-x-12 bottom-0 top-16 rounded-full bg-ts-accent/20 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-ts-accent/20 bg-ts-surface/80 p-5 shadow-[0_36px_110px_rgba(0,0,0,0.18)] transition-colors duration-300 sm:p-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-ts-bg/70">
                <ProductImage
                  src="/products/product-01.png"
                  alt="ArcVane modular shade in a quiet domestic light field"
                  fill
                  priority
                  sizes="(min-width: 1024px) 72rem, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {timeChapters.map((chapter, index) => (
        <ChapterPanel key={chapter.key} chapter={chapter} index={index} />
      ))}

      <ApparatusScrollSequence />

      <section className="bg-ts-bg px-6 py-24 text-ts-text transition-colors duration-300 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">
            MATERIALS
          </p>
          <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
            Each material changes the light in its own way.
          </h2>
          <p className="text-lg leading-8 text-ts-muted sm:text-xl sm:leading-9">
            We do not choose materials for cost or convenience. {" "}
            <em className="text-ts-accent not-italic">Photoluminescent minerals</em>
            {" "}store and return light; {" "}
            <em className="text-ts-accent not-italic">UV-reactive pigments</em>
            {" "}reveal hidden colour at dusk; {" "}
            <em className="text-ts-accent not-italic">Copper silk</em> reads warmer and
            more geological under low light. Every finish is a deliberate decision about
            how light behaves in your room.
          </p>
          <Link
            href="/materials"
            className="inline-flex w-fit text-sm font-semibold text-ts-accent underline-offset-8 transition duration-300 hover:text-ts-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none"
          >
            Explore all finishes →
          </Link>
        </div>
      </section>

      <section className="bg-shell px-6 py-24 text-charcoal sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-warm-amber">
                Collection entry
              </p>
              <h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Shades selected by light behaviour.
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex w-fit items-center justify-center rounded-full border border-deep-brown/20 px-6 py-3 text-sm font-semibold text-deep-brown transition duration-300 hover:-translate-y-0.5 hover:border-deep-brown hover:bg-off-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-amber motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              View all shades
            </Link>
          </div>

          {previewProducts.length > 0 ? (
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {previewProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[2.25rem] border border-sand/50 bg-off-white shadow-[0_24px_80px_rgba(61,48,40,0.08)]"
                  >
                    <div className="relative aspect-[4/3] bg-horizon-blue/30">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(min-width: 1280px) 31vw, (min-width: 768px) 47vw, 100vw"
                        className="object-cover transition duration-700 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                      />
                    </div>
                    <div className="space-y-5 p-6 sm:p-7">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-warm-amber">
                          {formatTimeState(product.timeState) ?? product.category}
                        </p>
                        <h3 className="text-2xl font-medium tracking-[-0.03em] text-deep-brown">
                          {product.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-7 text-weathered-post">{product.behaviourNote ?? product.description}</p>
                      <div className="flex items-center justify-between gap-4 border-t border-sand/45 pt-5">
                        <p className="text-base font-semibold text-deep-brown">{formatPrice(product)}</p>
                        <Link
                          href={`/products/${product.handle}`}
                          className="inline-flex items-center justify-center rounded-full bg-deep-brown px-5 py-2.5 text-sm font-semibold text-off-white transition duration-300 hover:-translate-y-0.5 hover:bg-warm-amber hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm-amber motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          ) : (
            <div className="mt-14 rounded-[2rem] border border-dashed border-limestone bg-off-white/70 p-10 text-center text-weathered-post">
              The public catalogue is being prepared. Visit the collection again shortly for
              current shade availability.
            </div>
          )}
        </div>
      </section>

      <section className="bg-ts-bg px-6 py-24 text-ts-text transition-colors duration-300 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-ts-accent/20 bg-ts-surface/70 px-6 py-14 text-center shadow-[0_28px_95px_rgba(0,0,0,0.14)] transition-colors duration-300 sm:px-10 lg:px-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">
            Begin with atmosphere
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Choose the light first. The object follows.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-ts-accent px-6 py-3 text-sm font-semibold text-ts-bg shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-ts-text hover:text-ts-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Find your shade
            </Link>
            <StartEveningButton />
          </div>
        </div>
      </section>
    </main>
  );
}
