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
    text: "Forms are built around domestic scale, shared E27 hardware, and practical delivery.",
  },
];

const timelines = [
  ["Production", "Usually completed within the 5-7 business day dispatch window."],
  ["Quality check", "Fit, finish, visible defects, and LED-only suitability are checked before packing."],
  ["Packing", "Orders are packed compactly, with the 300 mm cube as the guiding constraint where practical."],
  ["Dispatch", "Tracking is provided after carrier hand-off, or local pickup is arranged where available."],
];

export default function ProductionPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Studio production
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Made slowly, packed simply, released in small runs.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane pieces are made through a compact studio workflow: print,
            finish, check, pack, dispatch. No offshore catalogue. No sprawling
            custom process.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {productionSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8"
                >
                  <Icon className="h-6 w-6 text-weathered-post" />

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {step.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <PackageCheck className="h-7 w-7 text-weathered-post" />

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
                  A simple order path.
                </h2>

                <p className="mt-5 text-sm leading-7 text-deep-brown/70">
                  Most orders follow the same rhythm: make or finish the piece,
                  check the hardware fit, pack it properly, then send it out.
                </p>
              </div>

              <dl className="divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-off-white/80">
                {timelines.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[180px_1fr]"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-weathered-post">
                      {label}
                    </dt>

                    <dd className="text-sm leading-7 text-deep-brown/70">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Variation belongs to the work.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                Layer texture, small tonal shifts, and subtle diffusion
                differences are expected. Each piece should match the listing,
                but not feel anonymous or injection-moulded.
              </p>

              <p>
                For finish, hardware, or delivery questions, contact the studio
                before ordering. Custom design commissions are not the current
                focus.
              </p>
            </div>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
            >
              Contact the studio
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}