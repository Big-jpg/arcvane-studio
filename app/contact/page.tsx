// app/contact/page.tsx
import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ArcVane Studio for product, order, material, fitting, or small-run lighting enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Contact
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Product questions, order support, and studio enquiries.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane is a small studio. Messages are handled directly, with a
            focus on practical product, fitting, material, and delivery
            questions.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
                <Mail className="h-6 w-6 text-weathered-post" />

                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                  Email
                </h2>

                <a
                  href="mailto:rossfarrell7@gmail.com"
                  className="mt-4 block text-sm font-semibold text-deep-brown underline-offset-4 hover:underline"
                >
                  rossfarrell7@gmail.com
                </a>

                <p className="mt-3 text-sm leading-7 text-deep-brown/65">
                  Most enquiries are answered within 1-2 business days.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
                <MessageSquare className="h-6 w-6 text-weathered-post" />

                <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                  Helpful details
                </h2>

                <p className="mt-4 text-sm leading-7 text-deep-brown/65">
                  Include the product name, order details if relevant, fitting
                  type, room context, photos, or approximate measurements.
                </p>
              </div>
            </div>

            <section className="rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
                  What to get in touch about
                </h2>

                <div className="mt-6 grid gap-4 text-sm leading-7 text-deep-brown/70 sm:grid-cols-2">
                  <p>
                    Product availability, current pieces, shade sets, E27
                    compatibility, low-power LED use, materials, colours, and
                    finish variation.
                  </p>

                  <p>
                    Dispatch timing, local pickup where available, order
                    questions, product care, or small production enquiries that
                    fit the current studio collection.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
              <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
                A note on custom work.
              </h2>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
                ArcVane is currently focused on a narrow collection of finished
                pieces and compatible shade systems. Custom design commissions
                may be considered only where they sit close to the existing
                material, hardware, and production language.
              </p>

              <a
                href="mailto:rossfarrell7@gmail.com"
                className="mt-7 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                Email the studio
              </a>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}