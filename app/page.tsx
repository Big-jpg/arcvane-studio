import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Box,
  Cable,
  Layers3,
  Lightbulb,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ProductImage } from "@/components/product-image";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "ArcVane Studio",
  description:
    "Small-run coastal lighting pieces made with translucent PLA diffusers, matte stands, warm LED hardware, and interchangeable E27 shade sets.",
};

const materialNotes = [
  {
    title: "Frosted glow",
    body: "Clear PLA is used for softness, edge light, and quiet internal diffusion.",
  },
  {
    title: "Natural texture",
    body: "Layer lines become shell growth, coral ridges, limestone grain, and wind-cut sand.",
  },
  {
    title: "Matte contrast",
    body: "Tripods and stands stay tactile, practical, and calm against the illuminated shade.",
  },
];

const paletteTones = [
  { name: "Shell", className: "bg-shell", note: "soft base" },
  { name: "Sand", className: "bg-sand", note: "warm neutral" },
  { name: "Limestone", className: "bg-limestone", note: "mineral shade" },
  { name: "Weathered post", className: "bg-weathered-post", note: "matte timber" },
  { name: "Dune grass", className: "bg-dune-grass", note: "muted accent" },
  { name: "Coastal blue", className: "bg-coastal-blue", note: "hazy light" },
  { name: "Warm amber", className: "bg-warm-amber", note: "source glow" },
  { name: "Deep brown", className: "bg-deep-brown", note: "grounding tone" },
];

const systemSteps = [
  {
    icon: Lightbulb,
    title: "Warm LED source",
    body: "Low-power light, chosen for glow rather than glare.",
  },
  {
    icon: Cable,
    title: "Shared E27 base",
    body: "One simple hardware language across the collection.",
  },
  {
    icon: Layers3,
    title: "Interchangeable shades",
    body: "Change the atmosphere without replacing the whole object.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-shell text-charcoal">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-40">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-weathered-post">
              ArcVane Studio · Western Australian coastal light
            </p>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-7xl">
              Small-run lighting pieces for warm, quiet rooms.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-deep-brown/70 sm:text-xl sm:leading-9">
              Shell-like diffusers, matte tripod stands, and interchangeable
              shades inspired by Western Australian coastlines.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-deep-brown px-6 py-3 text-sm font-semibold text-shell transition-colors hover:bg-charcoal"
              >
                Shop current pieces
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-limestone/70 px-6 py-3 text-sm font-semibold text-deep-brown transition-colors hover:border-weathered-post hover:bg-off-white"
              >
                Join next drop
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block" aria-hidden="true">
            <div className="absolute right-0 top-0 h-72 w-72 rounded-[42%_58%_54%_46%] border border-limestone/40 bg-off-white shadow-2xl shadow-deep-brown/5" />
            <div className="absolute bottom-0 left-0 h-80 w-64 rounded-[54%_46%_38%_62%] border border-sand/70 bg-horizon-blue/35" />
            <div className="absolute left-12 top-20 h-72 w-72 rounded-full border border-shell bg-sand/35 p-8 shadow-xl shadow-deep-brown/5">
              <div className="h-full w-full rounded-full border border-limestone/50 bg-shell/70" />
            </div>

            <div className="absolute bottom-24 right-8 w-72 rounded-3xl border border-limestone/45 bg-off-white/90 p-6 shadow-xl shadow-deep-brown/8 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-weathered-post">
                Current system
              </p>
              <p className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-charcoal">
                One warm base. A rotating family of shade forms.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-full bg-shell ring-1 ring-limestone/50" />
                <div className="h-20 rounded-full bg-horizon-blue/50 ring-1 ring-coastal-blue/40" />
                <div className="h-20 rounded-full bg-warm-amber/25 ring-1 ring-warm-amber/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-limestone/35 bg-off-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Current pieces
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                A small edit of lamps, diffusers, and shade sets.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                Limited runs, made around a simple shared lighting system.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-deep-brown transition-colors hover:text-warm-amber"
            >
              View full collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group overflow-hidden rounded-3xl border border-limestone/35 bg-shell transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-deep-brown/5"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-off-white">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-weathered-post">
                    {product.category}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-charcoal">
                    {product.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-deep-brown/65">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-limestone/35 pt-4">
                    <p className="text-sm font-semibold text-charcoal">
                      ${product.price}{" "}
                      <span className="text-xs font-normal text-weathered-post">
                        {product.currency}
                      </span>
                    </p>

                    <span className="text-xs font-semibold text-weathered-post transition-colors group-hover:text-warm-amber">
                      View piece
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-shell py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Material language
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Clear PLA, treated like frosted shell and sea glass.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                The objects rely on glow, texture, edge light, and matte contrast
                rather than gloss or novelty.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {materialNotes.map((note) => (
                <article
                  key={note.title}
                  className="rounded-3xl border border-limestone/35 bg-off-white p-6"
                >
                  <Sparkles className="h-5 w-5 text-warm-amber" />
                  <h3 className="mt-5 text-base font-semibold text-charcoal">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-deep-brown/65">
                    {note.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-deep-brown py-20 text-shell sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sand">
              Lighting system
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              One base. Many moods.
            </h2>
            <p className="mt-5 text-base leading-8 text-shell/70">
              The E27 base stays simple. The shades change the room: warmer,
              softer, darker, brighter, or more sculptural.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {systemSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-3xl border border-shell/15 bg-shell/5 p-7"
              >
                <step.icon className="h-6 w-6 text-warm-amber" />
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-shell/68">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Coastal palette
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Shell, sand, limestone, dune grass, weathered timber, hazy blue,
                amber, and deep brown.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                Colour is used for atmosphere, not decoration.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paletteTones.map((tone) => (
                <div
                  key={tone.name}
                  className="rounded-3xl border border-limestone/35 bg-shell p-3"
                >
                  <div className={`h-24 rounded-2xl ${tone.className}`} />
                  <p className="mt-4 text-sm font-semibold text-charcoal">
                    {tone.name}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-weathered-post">
                    {tone.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-limestone/35 bg-shell py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-[2rem] border border-limestone/40 bg-off-white p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
            <div>
              <PackageCheck className="h-8 w-8 text-warm-amber" />
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Practical by design
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Sized for a 300 mm shipping cube.
              </h2>
            </div>

            <div>
              <p className="text-base leading-8 text-deep-brown/70">
                Finished shades, shade sets, and compact lamp parts are designed
                for practical packing, storage, and Australia-wide delivery.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-weathered-post">
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                  300 mm
                </div>
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                  300 mm
                </div>
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                  300 mm
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-limestone/40 bg-shell p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deep-brown text-shell">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                  Safety and hardware
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-charcoal sm:text-3xl">
                  Low-power LED only.
                </h2>
                <p className="mt-4 text-base leading-8 text-deep-brown/70">
                  ArcVane shades are designed for compatible E27 hardware and
                  low-heat LED bulbs. Do not use incandescent, halogen, or
                  unknown high-heat lamps with PLA diffusers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-shell pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Box className="mx-auto h-7 w-7 text-warm-amber" />
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
            Released slowly, in small runs.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-deep-brown/65">
            Browse the current collection or register interest in the next
            drop.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-deep-brown px-6 py-3 text-sm font-semibold text-shell transition-colors hover:bg-charcoal"
            >
              Shop current pieces
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-limestone/70 px-6 py-3 text-sm font-semibold text-deep-brown transition-colors hover:border-weathered-post hover:bg-off-white"
            >
              Join next drop
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-6 py-3 text-sm font-semibold text-weathered-post transition-colors hover:text-deep-brown"
            >
              Contact studio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}