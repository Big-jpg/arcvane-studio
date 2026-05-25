// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Shell, Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "ArcVane Studio is a small Western Australian design studio making coastal lighting pieces with PLA, warm LED light, and shared E27 hardware.",
};

const principles = [
  {
    icon: Waves,
    title: "Coastal light",
    text: "Limestone edges, shell striation, dune ribs, tidepools, washed timber, and the blue-grey horizon.",
  },
  {
    icon: MapPin,
    title: "Small-run production",
    text: "Designed, printed, finished, checked, and packed through one compact studio workflow.",
  },
  {
    icon: Shell,
    title: "Material character",
    text: "Clear and matte PLA are used for glow, opacity, touch, rhythm, and surface texture.",
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
            Coastal lighting from a small Western Australian studio.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane makes compact lighting pieces shaped by shell, limestone,
            dune, and tidepool forms. Warm light, quiet texture, small runs.
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

                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">
                    {principle.text}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="max-w-3xl space-y-5 text-sm leading-7 text-deep-brown/72">
              <p>
                ArcVane works from coastal references into finished lighting
                objects: shell-like diffusion, matte stands, warm LED glow, and
                forms that sit calmly in domestic rooms.
              </p>

              <p>
                PLA is used because it suits the work. Clear PLA softens light
                like frosted shell or sea glass. Matte PLA gives bases and
                stands a quieter, handled surface.
              </p>

              <p>
                The collection is intentionally narrow: finished lamps, shade
                sets, and accessories built around a shared E27 system.
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