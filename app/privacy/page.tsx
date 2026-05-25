// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ArcVane Studio.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Privacy
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Only the details needed to complete your order.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane is a small studio store. Personal information is collected
            only where it is needed for orders, enquiries, payment, delivery,
            collection, or product support.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-sm leading-7 text-deep-brown/70">
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Overview
              </h2>

              <p className="mt-3">
                This policy explains how ArcVane Studio collects, uses, and
                protects personal information when you browse the site, make an
                enquiry, or place an order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Information collected
              </h2>

              <p className="mt-3">
                When you place an order or send an enquiry, ArcVane may collect
                your name, email address, phone number if provided, order
                details, fitting selection, collection notes, shipping details,
                and any information you choose to include in your message.
              </p>

              <p className="mt-3">
                Payment processing is handled through Stripe. ArcVane Studio
                does not store full card numbers or payment credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                How information is used
              </h2>

              <p className="mt-3">
                Information is used to process orders, prepare products, confirm
                fitting or delivery details, arrange collection or shipping,
                provide order updates, respond to enquiries, and meet basic
                accounting and record-keeping obligations.
              </p>

              <p className="mt-3">
                Customer information is not sold, rented, or traded.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Email access
              </h2>

              <p className="mt-3">
                ArcVane may use email-based sign-in or magic links so customers
                can access order information without creating a separate
                password or using a social login account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Cookies and sessions
              </h2>

              <p className="mt-3">
                The site may use essential cookies or session storage for cart
                functionality, checkout continuity, authentication, and basic
                site operation.
              </p>

              <p className="mt-3">
                ArcVane does not currently use third-party advertising tracking
                cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Local collection and shipping
              </h2>

              <p className="mt-3">
                Where local pickup applies, collection details are shared only
                after an order has been confirmed. Where shipping applies,
                delivery information is collected only as needed to fulfil the
                order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Third-party services
              </h2>

              <p className="mt-3">
                ArcVane may use trusted providers for payment processing,
                hosting, email delivery, authentication, and order fulfilment.
                These providers receive only the information required to perform
                their role.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Data retention
              </h2>

              <p className="mt-3">
                Order records may be retained for accounting, warranty, product
                support, fraud prevention, and legal compliance. Enquiry details
                are retained only for as long as reasonably required to respond
                or provide support.
              </p>

              <p className="mt-3">
                You may request access to, correction of, or deletion of your
                personal information by contacting ArcVane Studio. Some records
                may need to be retained where required by law or legitimate
                business obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Contact
              </h2>

              <p className="mt-3">
                For privacy-related enquiries, contact ArcVane Studio using the
                details provided on the contact page.
              </p>
            </section>

            <p className="border-t border-charcoal/10 pt-6 text-xs leading-6 text-deep-brown/45">
              This policy should be reviewed before accepting live payments. It
              describes the intended operating model of the store and may need
              adjustment for final legal, tax, payment, and fulfilment
              requirements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}