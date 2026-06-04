// app/fitting-guide/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export const metadata: Metadata = {
  title: "E27 Compatibility Guide",
  description:
    "ArcVane Studio guide for E27 compatibility, customer-supplied electrical components, and low-heat LED-only use with decorative shade systems.",
  robots: {
    index: false,
    follow: false,
  },
};

const notes = [
  {
    icon: Lightbulb,
    title: "E27-compatible forms",
    text: "The current collection is shaped for compatible E27 lamp holders, low-heat LED bulbs, and stable compliant lamp bases or fittings sourced separately by the customer.",
  },
  {
    icon: CheckCircle2,
    title: "Check what ArcVane supplies",
    text: "Each product should state whether it includes a shade, stand, diffuser, mechanical adapter, or modular accessory. Electrical components are not included.",
  },
  {
    icon: AlertTriangle,
    title: "Low-heat LED only",
    text: "Use only low-heat LED bulbs with ArcVane PLA shades, diffusers, and accessories; avoid incandescent, halogen, heat lamp, appliance, and other high-temperature bulbs.",
  },
];

export default function FittingGuidePage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Fitting guide
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            A simple E27-compatible system.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane pieces are designed as decorative components for compatible
            E27 lamp holders, low-heat LED bulbs, and stable compliant lamp bases or fittings sourced separately. Product pages
            should make the supplied physical components clear before ordering.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {notes.map((note) => {
              const Icon = note.icon;

              return (
                <article
                  key={note.title}
                  className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8"
                >
                  <Icon className="h-6 w-6 text-weathered-post" />

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {note.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">
                    {note.text}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <HelpCircle className="h-7 w-7 shrink-0 text-weathered-post" />

              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
                  What to check before ordering.
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
                  Check the product dimensions, shade diameter, supplied
                  ArcVane components, bulb requirements, and whether the listing is for a
                  shade, shade set, stand, diffuser, adapter, or accessory. If you
                  are matching an existing E27 lamp holder or base, contact the studio before
                  ordering.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/products"
                    className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
                  >
                    View the collection
                  </Link>

                  <Link
                    href="/safety"
                    className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
                  >
                    Read safety note
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              No electrical modification.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
              ArcVane shades and adapters are mechanical product components.
              They do not include or alter electrical sockets, lamp holders, cords, switches, plugs, wiring,
              contacts, insulation, earthing, complete lamp bases, or fixed electrical infrastructure. If a fitting is damaged, loose,
              discoloured, overheating, or otherwise questionable, have it
              checked by a qualified electrician before use.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}