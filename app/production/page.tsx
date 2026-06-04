// app/production/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Box, Clock, Factory, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Production",
  description:
    "How ArcVane Studio makes small-run coastal lighting pieces in Western Australia, with made-after-order timing, compact packing, and controlled finish variation.",
};

const productionSteps = [
  {
    icon: Factory,
    title: "Made locally",
    text: "Designed, printed, finished, checked, and packed through one small Western Australian studio workflow.",
  },
  {
    icon: Clock,
    title: "Made after order",
    text: "Most pieces are produced or finished after purchase, keeping stock deliberate and runs small.",
  },
  {
    icon: Box,
    title: "Compact by design",
    text: "Forms are built around domestic scale, modular ArcVane components, and practical delivery.",
  },
];

const timelines = [
  ["Production", "Usually completed within the 5-7 business day dispatch window."],
  [
    "Quality check",
    "Fit, finish, visible defects, and compatibility notes are checked before packing.",
  ],
  [
    "Packing",
    "Orders are packed compactly, with the 300 mm cube as the guiding constraint where practical.",
  ],
  [
    "Dispatch",
    "Tracking is provided after carrier hand-off, or local pickup is arranged where available.",
  ],
];

export default function ProductionPage() {
  return (
    <>
      <section className="bg-ts-bg py-20 text-ts-text transition-colors duration-300 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ts-accent">
            Studio production
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-ts-text sm:text-6xl">
            Made slowly, packed simply, released in small runs.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-ts-muted sm:text-lg">
            ArcVane pieces are made through a compact studio workflow: print, finish, check, pack,
            dispatch. No offshore catalogue. No sprawling options matrix.
          </p>
        </div>
      </section>

      <section className="bg-ts-bg py-16 text-ts-text transition-colors duration-300 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {productionSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-ts-accent/20 bg-ts-surface/65 p-6 shadow-sm sm:p-8"
                >
                  <Icon className="h-6 w-6 text-ts-muted" />

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ts-text">
                    {step.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-ts-muted">{step.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-ts-accent/20 bg-ts-surface/70 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <PackageCheck className="h-7 w-7 text-ts-muted" />

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ts-text">
                  A simple order path.
                </h2>

                <p className="mt-5 text-sm leading-7 text-ts-muted">
                  Most orders follow the same rhythm: make or finish the piece, check the supplied
                  component fit, pack it properly, then send it out.
                </p>
              </div>

              <dl className="divide-y divide-ts-accent/15 rounded-2xl border border-ts-accent/20 bg-ts-bg/55">
                {timelines.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[180px_1fr]"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted">
                      {label}
                    </dt>

                    <dd className="text-sm leading-7 text-ts-muted">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-ts-accent/20 bg-ts-surface/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-ts-text">
              Variation belongs to the work.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-ts-muted">
              <p>
                Layer texture, small tonal shifts, and subtle diffusion differences are expected.
                Each piece should match the listing, but not feel anonymous or injection-moulded.
              </p>

              <p>
                For finish, component fit, or delivery questions, contact the studio before ordering. The
                current focus is a curated collection of decorative components and compatible shade systems.
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-full bg-ts-text px-5 py-3 text-sm font-semibold text-ts-bg transition-colors hover:bg-ts-accent"
            >
              Contact the studio
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
