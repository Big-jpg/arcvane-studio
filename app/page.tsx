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
    "Small-batch coastal lighting objects made with translucent PLA diffusers, matte tripod stands, warm LED hardware, and a shared E27 lighting system.",
};

const materialNotes = [
  {
    title: "Frosted shell diffusion",
    body: "Clear PLA is used for softness rather than glass-like transparency. Its value is in variable opacity, internal glow, and the way warm LED light gathers along thin shell-like edges.",
  },
  {
    title: "Intentional striation",
    body: "FDM layer lines are treated as natural texture: shell growth, sediment, coral ridges, and wind-cut dune surfaces. They are part of the optical language, not a defect to hide.",
  },
  {
    title: "Matte coastal hardware",
    body: "Tripods and stands are finished with a soft, practical tactility drawn from weathered beach posts, limestone paths, pale timber, and sun-faded coastal railings.",
  },
];

const paletteTones = [
  { name: "Shell", className: "bg-shell", note: "primary calm surface" },
  { name: "Sand", className: "bg-sand", note: "warm neutral body" },
  { name: "Limestone", className: "bg-limestone", note: "mineral shadow" },
  { name: "Weathered post", className: "bg-weathered-post", note: "matte stand reference" },
  { name: "Dune grass", className: "bg-dune-grass", note: "muted natural accent" },
  { name: "Coastal blue", className: "bg-coastal-blue", note: "hazy ocean light" },
  { name: "Warm amber", className: "bg-warm-amber", note: "low domestic glow" },
  { name: "Deep brown", className: "bg-deep-brown", note: "grounded contrast" },
];

const systemSteps = [
  {
    icon: Lightbulb,
    title: "Low-power LED source",
    body: "The lamp system is designed around a compatible included LED bulb, keeping the light warm, efficient, and intentionally low-output.",
  },
  {
    icon: Cable,
    title: "Shared E27 hardware",
    body: "A common cord and socket set gives the collection one simple electrical base instead of a wide adapter-first fitting workflow.",
  },
  {
    icon: Layers3,
    title: "Interchangeable shades",
    body: "Single diffusers and limited shade sets can move across the same E27 base, changing the room character without replacing the whole object.",
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-shell text-charcoal">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:py-40">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-weathered-post">
              ArcVane Studio · Western Australian coastal light
            </p>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-7xl">
              Small-batch lighting objects shaped by coastal forms,
              translucent materials, and warm domestic light.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-deep-brown/70 sm:text-xl sm:leading-9">
              Shell-like PLA diffusers, matte tripod stands, and limited-run shade sets
              designed around a shared E27 lighting system.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-deep-brown px-6 py-3 text-sm font-semibold text-shell transition-colors hover:bg-charcoal"
              >
                Shop current collection
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
                One warm E27 base. Limited shell-like shade sets.
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

      {/* Featured limited drop */}
      <section className="border-y border-limestone/35 bg-off-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Featured limited drop
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                A small current edit of diffusers, table forms, and shade sets.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                The catalogue is intentionally narrow: finished lighting objects and compatible shade
                sets drawn from shell, coral, dune, and limestone forms rather than an open-ended
                customisation workflow.
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

      {/* Material story */}
      <section className="bg-shell py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Material story
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Clear PLA is treated as frosted shell, sea glass, and translucent mineral.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                The material language is quiet and tactile. Diffusion, edge glow, surface striation,
                and matte contrast carry the object more than gloss, novelty, or visible technical
                performance.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {materialNotes.map((note) => (
                <article
                  key={note.title}
                  className="rounded-3xl border border-limestone/35 bg-off-white p-6"
                >
                  <Sparkles className="h-5 w-5 text-warm-amber" />
                  <h3 className="mt-5 text-base font-semibold text-charcoal">{note.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-deep-brown/65">{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modular system */}
      <section className="bg-deep-brown py-20 text-shell sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sand">
              Modular system
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              A simple shared E27 base, built for interchangeable coastal shades.
            </h2>
            <p className="mt-5 text-base leading-8 text-shell/70">
              The operating model is intentionally direct: one compatible lighting base, one socket
              language, and a rotating family of shade forms. The complexity sits in the studio, not
              in the customer fitting path.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {systemSteps.map((step) => (
              <article key={step.title} className="rounded-3xl border border-shell/15 bg-shell/5 p-7">
                <step.icon className="h-6 w-6 text-warm-amber" />
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-shell/68">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Coastal palette */}
      <section className="bg-off-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Coastal palette
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Product tones drawn from beach posts, limestone, dune grasses, and muted ocean light.
              </h2>
              <p className="mt-5 text-base leading-8 text-deep-brown/65">
                Colour is used as atmosphere rather than decoration: sun-bleached surfaces, mineral
                neutrals, hazy blue light, and a small amount of warm amber at the source.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paletteTones.map((tone) => (
                <div key={tone.name} className="rounded-3xl border border-limestone/35 bg-shell p-3">
                  <div className={`h-24 rounded-2xl ${tone.className}`} />
                  <p className="mt-4 text-sm font-semibold text-charcoal">{tone.name}</p>
                  <p className="mt-1 text-xs leading-5 text-weathered-post">{tone.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping model */}
      <section className="border-y border-limestone/35 bg-shell py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-[2rem] border border-limestone/40 bg-off-white p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
            <div>
              <PackageCheck className="h-8 w-8 text-warm-amber" />
              <p className="mt-6 text-xs font-medium uppercase tracking-[0.24em] text-weathered-post">
                Shipping model
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
                Designed around a 300 mm shipping cube.
              </h2>
            </div>

            <div>
              <p className="text-base leading-8 text-deep-brown/70">
                The collection is sized so finished shades, shade sets, and compact table-lamp parts
                can be packed efficiently inside a 300 × 300 × 300 mm cube for Australia-wide
                delivery. The constraint keeps the objects practical without making the product feel
                disposable or over-engineered.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-weathered-post">
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">300 mm</div>
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">300 mm</div>
                <div className="rounded-2xl border border-limestone/35 bg-shell py-5">300 mm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and hardware note */}
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
                  Low-power LED only, with compatible E27 hardware.
                </h2>
                <p className="mt-4 text-base leading-8 text-deep-brown/70">
                  ArcVane shades are intended for the supplied compatible low-power LED bulb and E27
                  hardware. Do not use incandescent, halogen, high-heat, or unknown lamps with PLA
                  diffusers. Follow the safety guidance supplied with the finished object.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet CTA */}
      <section className="bg-shell pb-24 pt-8 sm:pb-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Box className="mx-auto h-7 w-7 text-warm-amber" />
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-charcoal sm:text-4xl">
            Current pieces are released slowly, in small runs.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-deep-brown/65">
            Browse the current collection, register interest in the next limited drop, or contact the
            studio for a quiet production or material enquiry.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-deep-brown px-6 py-3 text-sm font-semibold text-shell transition-colors hover:bg-charcoal"
            >
              Shop current collection
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
