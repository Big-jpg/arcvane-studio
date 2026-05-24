// app/production/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Box, Clock, Factory, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Production",
  description:
    "How ArcVane Studio produces small-batch E27 lighting objects locally, with made-after-order timing, compact 300mm cube packaging, and controlled finish variation.",
};

const productionSteps = [
  {
    icon: Factory,
    title: "Small studio, local production",
    text: "ArcVane objects are produced in a small Western Australian studio workflow rather than ordered from an offshore catalogue. Production stays close to design decisions, material behaviour, and final finishing.",
  },
  {
    icon: Clock,
    title: "Made after order",
    text: "Most pieces are produced or finished after an order is placed. This keeps stock deliberate, supports small runs, and avoids treating the collection as disposable inventory.",
  },
  {
    icon: Box,
    title: "Compact product system",
    text: "Forms are designed around domestic scale, E27 hardware, and a compact packaging model. The constraint keeps the objects practical without making them feel generic.",
  },
];

const timelines = [
  ["Production and finishing", "Usually completed inside the 5–7 business day dispatch window."],
  ["Quality check", "Each piece is checked for fit, finish, visible defects, and LED-only hardware compatibility before packing."],
  ["Packing", "Products are packed to suit a 300×300×300mm shipping cube wherever the order composition allows."],
  ["Dispatch", "Tracking is provided after hand-off to the carrier or local pickup is arranged where available."],
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
            Made after order, with the discipline of a compact collection.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane produces finished lighting objects in small batches. The work is local,
            controlled, and intentionally limited to E27-ready forms that can be made, checked, and
            shipped without excessive complexity.
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
                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">{step.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <PackageCheck className="h-7 w-7 text-weathered-post" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
                  Production timing is simple by default.
                </h2>
                <p className="mt-5 text-sm leading-7 text-deep-brown/70">
                  The current model does not rely on complex bespoke design work. Most orders follow
                  the same practical sequence: make or finish the piece, check the E27 fit and LED-only
                  suitability, pack compactly, then dispatch.
                </p>
              </div>

              <dl className="divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-off-white/80">
                {timelines.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[180px_1fr]">
                    <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-weathered-post">
                      {label}
                    </dt>
                    <dd className="text-sm leading-7 text-deep-brown/70">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Variation is controlled, not eliminated.
            </h2>
            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                PLA layer texture, small tonal shifts, and subtle diffusion differences are part of
                the production language. A piece should be consistent with the listing, but it should
                not look like anonymous injection-moulded stock.
              </p>
              <p>
                If you need a clarification about finish tone, hardware assumptions, or delivery
                timing, contact the studio before ordering. The current enquiry route is for practical
                production questions, not full custom design commissioning.
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
