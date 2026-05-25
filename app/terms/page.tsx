// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for ArcVane Studio orders, products, fittings, fulfilment, and use.",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Terms
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Terms and conditions.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            Terms relating to ArcVane Studio products, orders, fulfilment,
            fittings, and use.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-7 text-deep-brown/70">
            <section>
              <p className="text-lg leading-8 text-charcoal/82">
                ArcVane operates as a small-run design studio rather than a
                mass-production retailer. Pieces are produced individually or in
                limited batches, and minor surface or tonal variation is part of
                the character of the work.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Products and variation
              </h2>

              <p className="mt-4">
                Product photography, renders, and mockups are representative
                references only. Minor variation in surface texture,
                translucency, colour tone, finish, or visible layer pattern may
                occur between pieces.
              </p>

              <p className="mt-4">
                Small-batch variation does not constitute a defect unless it
                materially affects fit, safety, or the listed product
                description.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Orders and production
              </h2>

              <p className="mt-4">
                Most products are produced or finished after ordering rather
                than held as warehouse inventory. Production timing may vary
                depending on workload, material availability, order volume, and
                finishing requirements.
              </p>

              <p className="mt-4">
                Once production has materially commenced, cancellation or refund
                requests may be limited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Hardware and compatibility
              </h2>

              <p className="mt-4">
                The current collection is designed around E27 hardware and
                compatible low-power LED bulbs. Product listings should state
                what hardware is included with each item.
              </p>

              <p className="mt-4">
                Customers are responsible for checking dimensions, fitting
                suitability, bulb compatibility, and room context before
                ordering.
              </p>

              <p className="mt-4">
                ArcVane Studio may decline or modify an order where a fitting
                arrangement appears unsafe, unsuitable, or incompatible with the
                intended use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                LED-only use
              </h2>

              <p className="mt-4">
                ArcVane products are designed exclusively for use with modern
                low-power LED bulbs.
              </p>

              <p className="mt-4">
                Incandescent, halogen, heat lamp, appliance, or other
                high-temperature bulbs must not be used with PLA lighting
                pieces.
              </p>

              <p className="mt-4">
                ArcVane Studio accepts no responsibility for damage, deformation,
                or unsafe conditions resulting from incompatible bulbs,
                unsuitable installation, or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Shipping and fulfilment
              </h2>

              <p className="mt-4">
                Products are packed as compactly and safely as practical, with
                much of the collection designed around a 300 x 300 x 300 mm
                shipping constraint.
              </p>

              <p className="mt-4">
                Dispatch estimates are provided as guidance only. Carrier
                transit times and delivery conditions are outside the studio’s
                direct control once an order has been handed to the shipping
                provider.
              </p>

              <p className="mt-4">
                Local pickup may be available for selected orders or locations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Returns and refunds
              </h2>

              <p className="mt-4">
                Returns and remedies are assessed where a product is materially
                defective, arrives damaged, or substantially differs from the
                listing.
              </p>

              <p className="mt-4">
                Customers should contact the studio within 14 days of delivery
                or collection if an issue is identified. Supporting photographs
                or installation context may be requested.
              </p>

              <p className="mt-4">
                Australian Consumer Law rights apply where they cannot legally
                be excluded.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Installation and use
              </h2>

              <p className="mt-4">
                ArcVane products are intended for indoor domestic use unless
                otherwise stated.
              </p>

              <p className="mt-4">
                Adapters and shade fittings are mechanical support components
                only. They do not alter electrical wiring, insulation,
                earthing, or fixed electrical infrastructure.
              </p>

              <p className="mt-4">
                Any electrical work should be performed by a qualified
                electrician in accordance with applicable local regulations and
                Australian standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Accounts and communication
              </h2>

              <p className="mt-4">
                ArcVane may use email-based authentication methods, including
                magic links, to simplify access to orders and account
                information.
              </p>

              <p className="mt-4">
                Customers are responsible for maintaining access to the email
                address associated with their order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Limitation of liability
              </h2>

              <p className="mt-4">
                To the maximum extent permitted by law, ArcVane Studio is not
                liable for indirect, incidental, or consequential loss arising
                from misuse, incompatible fittings, environmental exposure,
                unauthorised modification, or failure to follow product guidance.
              </p>

              <p className="mt-4">
                Nothing in these terms excludes rights or guarantees that cannot
                be excluded under Australian Consumer Law.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}