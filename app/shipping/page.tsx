// app/shipping/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Package, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "ArcVane Studio shipping information: 5–7 business day dispatch, compact 300mm cube packaging, Australia-wide delivery, and local pickup where available.",
};

const shippingNotes = [
  {
    icon: Package,
    title: "Compact 300mm cube packaging",
    text: "The current collection is designed to fit efficient 300×300×300mm cube packaging wherever the order composition allows. This keeps delivery practical without oversizing the objects.",
  },
  {
    icon: Truck,
    title: "5–7 business day dispatch",
    text: "Most orders are made, finished, checked, and dispatched within 5–7 business days. Tracking is provided after the parcel is handed to the carrier.",
  },
  {
    icon: MapPin,
    title: "Australia-wide delivery",
    text: "ArcVane ships within Australia from Western Australia. Local pickup may be available when arranged through the studio route.",
  },
];

const expectations = [
  ["Packaging model", "Single pieces and compact sets are packed around the 300×300×300mm cube target where practical."],
  ["Dispatch timing", "Allow 5–7 business days for production, finishing, checking, packing, and carrier hand-off."],
  ["Multiple items", "Larger or mixed orders may require more than one parcel or a larger box if the cube target is not safe."],
  ["Delivery estimates", "Carrier transit time starts after dispatch and varies by destination, service level, and seasonal load."],
];

export default function ShippingPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Shipping
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Compact delivery for small-batch coastal lighting.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane products are designed as compact domestic objects. The shipping model supports
            made-after-order production, safe packing, and efficient Australia-wide delivery.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {shippingNotes.map((note) => {
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

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              What the shipping window includes
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-deep-brown/70">
              Dispatch time is not only packing time. Because pieces are made or finished in a small
              studio workflow, the shipping window includes production, fit checking, LED-only safety
              review, and protective packing.
            </p>
            <dl className="mt-8 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-off-white/80">
              {expectations.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[170px_1fr]">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-weathered-post">
                    {label}
                  </dt>
                  <dd className="text-sm leading-7 text-deep-brown/70">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Need pickup or order-specific delivery advice?
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
              If the order is time-sensitive, includes several pieces, or requires local pickup,
              contact the studio before ordering so the packing and dispatch assumptions can be
              confirmed.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                Contact the studio
              </Link>
              <Link
                href="/pickup"
                className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                Local pickup details
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
