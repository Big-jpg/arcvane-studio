// app/custom/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "Studio Enquiries",
  description:
    "Low-priority ArcVane Studio enquiry route for practical product, production, collaboration, and fit questions.",
  robots: {
    index: false,
    follow: false,
  },
};

const enquiryTypes = [
  {
    icon: Ruler,
    title: "Fit clarification",
    text: "Use this route for practical questions about dimensions, E27 hardware assumptions, shade-pack compatibility, or whether a listed piece suits a known setting.",
  },
  {
    icon: MessageSquare,
    title: "Studio or trade enquiry",
    text: "The studio can consider restrained collaborations, placement questions, or small production conversations when they align with the current collection language.",
  },
  {
    icon: Mail,
    title: "Order support",
    text: "For active orders, production timing, local pickup, delivery notes, or replacement questions, provide the order reference so the studio can respond directly.",
  },
];

export default function StudioEnquiriesPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Studio enquiries
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            A quiet enquiry route, not the core product offer.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane now centres on a curated collection of finished E27 lighting objects. This page
            remains available for practical studio questions, not as a primary custom-design service.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {enquiryTypes.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
                  <Icon className="h-6 w-6 text-weathered-post" />
                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">{item.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              What this page is for
            </h2>
            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                The previous custom pathway has been demoted because the rebrand positions ArcVane as
                a small studio collection rather than a bespoke configuration tool. Finished products,
                shade sets, table lamps, and accessories are the primary commercial offer.
              </p>
              <p>
                If your question is about a listed product, include the product name, intended use,
                room context, and any relevant dimensions. If you need a different colour, scale, or
                object type, treat that as an enquiry rather than an assumed service.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                Contact the studio
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                View the collection
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
