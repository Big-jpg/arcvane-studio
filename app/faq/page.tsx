// app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "ArcVane Studio FAQ covering E27 fittings, LED-only use, clear PLA and matte PLA materials, small-batch production, shipping, and returns.",
};

const faqs = [
  {
    question: "What fitting system do ArcVane products use?",
    answer:
      "The current ArcVane collection is built around E27 as the primary lighting system. Product pages keep adapter selection deliberately simple because the new model is designed around one clear hardware assumption.",
  },
  {
    question: "Can I use incandescent or halogen bulbs?",
    answer:
      "No. ArcVane products are LED-only. Use compatible low-power LED bulbs and do not use incandescent, halogen, heat lamp, appliance, or other high-temperature bulbs with PLA lighting objects.",
  },
  {
    question: "Why use PLA for lighting objects?",
    answer:
      "PLA is used intentionally for its diffusion, layer texture, and tactile finish. Clear PLA can behave like shell, sea glass, or frosted mineral under warm LED light, while matte PLA gives stands and tripods a soft coastal surface.",
  },
  {
    question: "Are layer lines or small finish variations defects?",
    answer:
      "Fine FDM layer lines, subtle colour shifts, and variable opacity are expected. They are part of the small-batch material language unless they materially affect fit, safety, or the listed product description.",
  },
  {
    question: "Are the products made to order?",
    answer:
      "Most pieces are made or finished after ordering inside a small Western Australian studio workflow. This supports low stock, careful checking, and limited collection runs rather than mass inventory.",
  },
  {
    question: "How long does dispatch take?",
    answer:
      "Allow 5–7 business days for production, finishing, quality checking, packing, and carrier hand-off. Carrier transit time begins after dispatch and varies by destination.",
  },
  {
    question: "How are products packed?",
    answer:
      "The current collection is designed around compact 300×300×300mm cube packaging wherever the order composition allows. Multiple items or unusual combinations may require different packing for safety.",
  },
  {
    question: "Do you still offer custom design work?",
    answer:
      "Custom design is no longer presented as the core product offering. The studio enquiry route remains available for practical questions, collaborations, or order clarification, but the primary offer is the curated collection.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Returns and remedies are handled according to the returns policy and Australian consumer law. Expected small-batch texture and colour variation is normal; damage, incorrect items, or material defects should be raised with the studio promptly.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            FAQ
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Straight answers for a simpler lighting system.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            The current ArcVane model is intentionally narrow: E27 fittings, low-power LED bulbs,
            clear and matte PLA, compact production, and small-batch coastal objects.
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
              Need something more specific?
            </h2>
            <p className="mt-4 text-sm leading-7 text-deep-brown/70">
              For product fit, finish, pickup, shipping, or order-specific questions, contact the
              studio before ordering. For safety assumptions, read the LED-only safety note first.
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
                LED safety note
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
