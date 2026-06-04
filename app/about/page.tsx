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
      <section className="bg-ts-bg py-20 text-ts-text transition-colors duration-300 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ts-accent">
            About ArcVane
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-ts-text sm:text-6xl">
            Coastal lighting from a small Western Australian studio.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-ts-muted sm:text-lg">
            ArcVane makes compact lighting pieces shaped by shell, limestone,
            dune, and tidepool forms. Warm light, quiet texture, small runs.
          </p>
        </div>
      </section>

      <section className="bg-ts-bg py-16 text-ts-text transition-colors duration-300 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className="rounded-[1.75rem] border border-ts-accent/20 bg-ts-surface/65 p-6 shadow-sm sm:p-8"
                >
                  <Icon className="h-6 w-6 text-ts-muted" />

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ts-text">
                    {principle.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-ts-muted">
                    {principle.text}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-ts-accent/20 bg-ts-surface/70 p-6 sm:p-10">
            <div className="max-w-3xl space-y-5 text-sm leading-7 text-ts-muted">
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
                className="rounded-full bg-ts-text px-5 py-3 text-center text-sm font-semibold text-ts-bg transition-colors hover:bg-ts-accent"
              >
                View the collection
              </Link>

              <Link
                href="/materials"
                className="rounded-full border border-ts-accent/25 px-5 py-3 text-center text-sm font-semibold text-ts-text transition-colors hover:border-ts-accent/50"
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