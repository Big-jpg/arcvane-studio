// app/returns/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Camera, FileText, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Returns and refunds guidance for small-run ArcVane Studio lighting pieces.",
};

const assessmentItems = [
  "The product is materially defective.",
  "The product arrives damaged.",
  "The product is substantially different from the listing.",
  "The issue is raised within 14 days of delivery or collection.",
];

const limitedItems = [
  "Change of mind after production has started.",
  "Incorrect fitting assumptions where details were not checked before ordering.",
  "Damage caused by incandescent, halogen, or other high-heat bulbs.",
  "Damage caused by modification, unsuitable installation, or misuse.",
];

export default function ReturnsPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Returns
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Returns and refunds for small-run lighting pieces.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane pieces are usually made or finished after order. Returns
            are assessed where there is damage, a material defect, or a clear
            mismatch with the product listing.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <FileText className="h-6 w-6 text-weathered-post" />

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
              Small-run context.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                Most ArcVane products are prepared individually after order
                confirmation. Some pieces may be printed, finished, checked, or
                packed specifically for that order.
              </p>

              <p>
                Small-batch texture, minor tonal variation, and subtle diffusion
                differences are expected unless they affect fit, safety, or the
                listed product description.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
              <RotateCcw className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">
                Usually assessed when
              </h2>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-deep-brown/70">
                {assessmentItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-amber" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
              <AlertCircle className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">
                Usually limited when
              </h2>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-deep-brown/70">
                {limitedItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-8 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <Camera className="h-6 w-6 text-warm-amber" />

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
              How to raise an issue.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                Contact the studio within 14 days of delivery or collection.
                Include the order email address, a short description of the
                issue, and clear photographs of the product, packaging, fitting,
                and any relevant installation context.
              </p>

              <p>
                Refunds, repairs, and replacements are assessed case by case.
                Australian Consumer Law rights are preserved where they cannot
                be excluded.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                Contact the studio
              </Link>

              <Link
                href="/terms"
                className="inline-flex justify-center rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                Read full terms
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}