// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Shell, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "ArcVane Studio is a small Western Australian design studio producing coastal E27 lighting objects in clear and matte PLA.",
};

const principles = [
  {
    icon: Waves,
    title: "Western Australian coastal light",
    text: "The collection draws from limestone edges, shell striation, dune ribs, tidepools, washed timber, and the softened blue-grey horizon of the coast.",
  },
  {
    icon: MapPin,
    title: "Small studio, local production",
    text: "Objects are designed, produced, finished, and checked through a local small-batch workflow rather than separated from the studio that defines them.",
  },
  {
    icon: Shell,
    title: "PLA as material language",
    text: "Clear PLA and matte PLA are used intentionally: for glow, opacity, touch, layer rhythm, and the quiet surface character that belongs to the ArcVane system.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            About ArcVane
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Coastal lighting objects from a small Western Australian studio.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane Studio designs compact E27 lighting objects shaped by coastal forms, clear PLA
            diffusion, and local small-batch production. The work is quiet, tactile, and restrained.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article
                  key={principle.title}
                  className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8"
                >
                  <Icon className="h-6 w-6 text-weathered-post" />
                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {principle.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">{principle.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="max-w-3xl space-y-5 text-sm leading-7 text-deep-brown/72">
              <p>
                ArcVane is not built around parametric novelty for its own sake. The design language
                starts with coastal references and works backward into forms that can hold warm LED
                light, show material texture, and sit calmly in domestic rooms.
              </p>
              <p>
                The studio uses PLA because it suits the intended objects. Clear PLA can glow with a
                shell-like softness; matte PLA can give bases and stands a weathered, handled quality;
                visible layer lines can read as striation rather than manufacturing apology.
              </p>
              <p>
                The current collection is deliberately compact: finished objects, shade packs, and
                accessories designed around the shared E27 system. Custom design is no longer the main
                offer; the focus is a clearer, more coherent studio collection.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                View the collection
              </Link>
              <Link
                href="/materials"
                className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                Read material story
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
