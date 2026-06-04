// app/pickup/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  CalendarCheck,
  MailCheck,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping and Pickup",
  description:
    "Shipping and pickup information for ArcVane Studio orders, including compact 300 mm cube packaging, dispatch timing, and local pickup where available.",
};

const fulfilmentSteps = [
  {
    title: "Order placed",
    text: "Choose the piece, colour, and fitting notes where required.",
  },
  {
    title: "Made or finished",
    text: "Most pieces are produced or finished after order within the current dispatch window.",
  },
  {
    title: "Packed compactly",
    text: "Orders are packed around a 300 x 300 x 300 mm cube wherever the order allows.",
  },
  {
    title: "Shipped or collected",
    text: "Tracking is provided after dispatch, or local pickup is arranged where available.",
  },
];

export default function PickupPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Fulfilment
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Designed to ship in one compact box.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane pieces are designed around practical delivery: compact
            forms, small-run production, and a 300 x 300 x 300 mm packing
            constraint wherever possible.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <Box className="h-7 w-7 text-warm-amber" />

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
              The 300 mm cube is the design constraint.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
              Finished shades, shade sets, and compact table-lamp parts are
              sized for efficient packing and delivery. The constraint keeps
              the work practical without pushing it into disposable flat-pack
              territory.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-weathered-post">
              <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                300 mm
              </div>
              <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                300 mm
              </div>
              <div className="rounded-2xl border border-limestone/35 bg-shell py-5">
                300 mm
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 text-center shadow-sm shadow-charcoal/5">
              <Truck className="mx-auto h-6 w-6 text-weathered-post" />

              <h2 className="mt-4 text-lg font-semibold tracking-tight text-charcoal">
                Shipping
              </h2>

              <p className="mt-3 text-sm leading-7 text-deep-brown/65">
                Orders are packed for delivery where shipping is available for
                the selected product and location.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 text-center shadow-sm shadow-charcoal/5">
              <PackageCheck className="mx-auto h-6 w-6 text-weathered-post" />

              <h2 className="mt-4 text-lg font-semibold tracking-tight text-charcoal">
                Packing
              </h2>

              <p className="mt-3 text-sm leading-7 text-deep-brown/65">
                Packaging is compact, protective, and matched to the object
                rather than oversized by default.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 text-center shadow-sm shadow-charcoal/5">
              <MapPin className="mx-auto h-6 w-6 text-weathered-post" />

              <h2 className="mt-4 text-lg font-semibold tracking-tight text-charcoal">
                Local pickup
              </h2>

              <p className="mt-3 text-sm leading-7 text-deep-brown/65">
                Local pickup may be arranged where available. Collection details
                are provided only after order confirmation.
              </p>
            </div>
          </div>

          <section className="mt-10 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Fulfilment flow.
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4">
              {fulfilmentSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-charcoal/10 bg-off-white/80 p-5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-xs font-semibold text-off-white">
                    {index + 1}
                  </span>

                  <h3 className="mt-4 text-base font-semibold text-charcoal">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-deep-brown/70">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-8">
              <CalendarCheck className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">
                Dispatch timing
              </h2>

              <p className="mt-3 text-sm leading-7 text-deep-brown/70">
                Standard pieces are usually produced, finished, checked, and
                dispatched within the current production window.
              </p>

              <Link
                href="/process"
                className="mt-4 inline-flex text-sm font-semibold text-charcoal underline underline-offset-4"
              >
                Read production timing
              </Link>
            </section>

            <section className="rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-8">
              <MailCheck className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">
                Order updates
              </h2>

              <p className="mt-3 text-sm leading-7 text-deep-brown/70">
                Keep your order email accessible. Dispatch notices, tracking,
                pickup options, and any fulfilment questions are sent there.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}