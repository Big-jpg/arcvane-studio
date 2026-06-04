// app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "ArcVane Studio FAQ covering E27 compatibility, LED-only use, PLA materials, small-run production, fulfilment, and returns.",
};

const faqs = [
  {
    question: "What electrical components do I need?",
    answer:
      "The current collection is shaped for compatible E27 lamp holders and low-power LED bulbs sourced separately by the customer. Product pages state the ArcVane shade, stand, diffuser, adapter, or accessory components supplied.",
  },
  {
    question: "Can I use incandescent or halogen bulbs?",
    answer:
      "Use only low-power LED bulbs with ArcVane PLA shades, diffusers, and accessories. Do not use incandescent, halogen, heat lamp, appliance, or other high-temperature bulbs.",
  },
  {
    question: "Why use PLA?",
    answer:
      "PLA is used for diffusion, surface texture, and tactile finish. Clear PLA softens light like shell or sea glass. Matte PLA gives stands and tripods a quieter surface.",
  },
  {
    question: "Are layer lines or finish variations defects?",
    answer:
      "No, not by default. Fine layer lines, subtle colour shifts, and variable opacity are part of the small-run material character unless they affect fit, safety, or the listed product description.",
  },
  {
    question: "Are products made to order?",
    answer:
      "Most pieces are made or finished after ordering through a small Western Australian studio workflow.",
  },
  {
    question: "How long does dispatch take?",
    answer:
      "Allow 5-7 business days for production, finishing, checking, packing, and carrier hand-off. Transit time begins after dispatch.",
  },
  {
    question: "How are products packed?",
    answer:
      "The collection is designed around compact 300 x 300 x 300 mm packaging wherever practical. Some orders may need different packing for protection.",
  },
  {
    question: "Can I ask about fit, placement, or finish?",
    answer:
      "Yes. The studio can help with product fit, room context, finish tone, E27 compatibility, and whether an existing piece suits the setting you have in mind.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Returns and remedies are handled under the returns policy and Australian consumer law. Damage, incorrect items, or material defects should be raised with the studio promptly.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">FAQ</p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Simple answers for the current collection.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            E27 compatibility, customer-sourced low-power LED bulbs, compact fulfilment,
            small-run production, and PLA materials.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-charcoal/10 rounded-[2rem] border border-charcoal/10 bg-shell/60">
            {faqs.map((item) => (
              <article key={item.question} className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                  {item.question}
                </h2>

                <p className="mt-4 text-sm leading-7 text-deep-brown/70">{item.answer}</p>
              </article>
            ))}
          </div>

          <section className="mt-12 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-charcoal">
              Need something specific?
            </h2>

            <p className="mt-4 text-sm leading-7 text-deep-brown/70">
              For fit, finish, delivery, order, or material questions, contact the studio before
              ordering. For LED bulb dimensions, heat limits, and clearances, read the safety note.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                Contact the studio
              </Link>

              <Link
                href="/safety"
                className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                Read safety note
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
