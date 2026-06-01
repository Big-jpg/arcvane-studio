// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ArcVane Studio handles order, enquiry, fulfilment, and account information.",
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
            Privacy, kept practical.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane Studio collects the details needed to answer enquiries, prepare orders, take
            payment, arrange fulfilment, and support the objects after they leave the studio.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-7 text-deep-brown/70">
            <section>
              <p className="text-lg leading-8 text-charcoal/82">
                ArcVane is a small Western Australian lighting studio, not a data business. Personal
                information is handled in a limited, practical way: enough to run the store, make
                and fulfil orders, keep customers informed, and meet ordinary business obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Information ArcVane collects
              </h2>

              <p className="mt-4">
                When you place an order, sign in, or contact the studio, ArcVane may collect your
                name, email address, phone number if provided, order details, selected product
                options, fulfilment details, and any notes or messages you choose to send.
              </p>

              <p className="mt-4">
                Payment information is processed by Stripe. ArcVane does not store full card numbers
                or payment credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                How information is used
              </h2>

              <p className="mt-4">
                Information is used to process orders, prepare and pack products, confirm
                compatibility or fulfilment details, provide order updates, respond to enquiries,
                support customers, and meet accounting, tax, fraud prevention, and record-keeping
                obligations.
              </p>

              <p className="mt-4">Customer information is not sold, rented, or traded.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Accounts and email access
              </h2>

              <p className="mt-4">
                ArcVane may use email-based authentication, including magic links, so customers can
                access order information without creating a separate password.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Cookies and sessions
              </h2>

              <p className="mt-4">
                The site may use essential cookies or session storage for cart functionality,
                checkout continuity, authentication, and basic site operation.
              </p>

              <p className="mt-4">
                ArcVane does not currently use third-party advertising tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">Fulfilment</h2>

              <p className="mt-4">
                Delivery and local pickup details are collected and used only as needed to fulfil
                the order. Pickup arrangements are shared after an order is confirmed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Third-party services
              </h2>

              <p className="mt-4">
                ArcVane may use trusted providers for payment processing, checkout, hosting, email
                delivery, authentication, database storage, analytics, and fulfilment. These
                providers receive only the information required to perform their role.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">Data retention</h2>

              <p className="mt-4">
                Order records may be retained for accounting, warranty, product support, fraud
                prevention, and legal compliance. Enquiry details are retained only for as long as
                reasonably required to respond or provide support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                Access, correction, and deletion
              </h2>

              <p className="mt-4">
                You may request access to, correction of, or deletion of your personal information
                by contacting ArcVane Studio. Some records may need to be retained where required by
                law or legitimate business obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight text-charcoal">Contact</h2>

              <p className="mt-4">
                For privacy-related enquiries, contact ArcVane Studio using the details provided on
                the contact page.
              </p>
            </section>

            <p className="border-t border-charcoal/10 pt-6 text-xs leading-6 text-deep-brown/45">
              This policy describes the current operating model of the studio and may be updated as
              the site, catalogue, payment, or fulfilment systems change.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
