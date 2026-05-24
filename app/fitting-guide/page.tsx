// app/fitting-guide/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, HelpCircle, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "E27 Fitting Guide",
  description:
    "Simplified ArcVane Studio fitting guide. All current ArcVane products use the E27 lighting system and LED-only bulbs.",
  robots: {
    index: false,
    follow: false,
  },
};

const notes = [
  {
    icon: Lightbulb,
    title: "All current products use E27",
    text: "The public collection has been simplified around the E27 Edison screw system. Product pages no longer require customers to navigate multiple adapter pathways.",
  },
  {
    icon: CheckCircle2,
    title: "Hardware is described per product",
    text: "Each product page states whether an E27 socket, LED bulb, cord, shade hardware, or accessory hardware is included. Read the included-hardware line before ordering.",
  },
  {
    icon: AlertTriangle,
    title: "LED-only remains fixed",
    text: "Use compatible low-power LED bulbs only. Do not use incandescent, halogen, heat lamp, appliance, or other high-temperature bulbs with PLA lighting objects.",
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
            A simpler E27 system.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane has moved away from complex public fitting selection. The current collection is
            built around E27 lighting hardware and compatible low-power LED bulbs.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <article key={note.title} className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
                  <Icon className="h-6 w-6 text-weathered-post" />
                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {note.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">{note.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <HelpCircle className="h-7 w-7 shrink-0 text-weathered-post" />
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
                  What customers still need to check
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
                  Check the product scale, dimensions, shade diameter, included hardware, and whether
                  you are buying a finished lamp, shade set, single shade, or accessory. If you are
                  unsure whether a piece suits an existing lamp base or room placement, contact the
                  studio before ordering.
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
                    Read LED safety note
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
