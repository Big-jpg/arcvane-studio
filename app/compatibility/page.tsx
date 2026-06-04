// app/compatibility/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Lightbulb, Ruler, ThermometerSun } from "lucide-react";

export const metadata: Metadata = {
  title: "Compatibility Guide",
  description:
    "Practical compatibility guidance for ArcVane Studio shades, stands, diffusers, mechanical adapters, customer-supplied E27 lamp holders, low-heat LED bulbs, heat, and shade clearances.",
};

const guideCards = [
  {
    icon: CheckCircle2,
    title: "E27 setting",
    text: "Current ArcVane shades and shade-and-stand objects are designed around compatible E27 lamp holders and stable compliant lamp bases or fittings sourced separately by the customer.",
  },
  {
    icon: Lightbulb,
    title: "Low-heat LED only",
    text: "Use modern low-heat E27 LED bulbs only. Do not use incandescent, halogen, heat lamp, appliance, or other high-temperature bulb types.",
  },
  {
    icon: Ruler,
    title: "Bulb scale",
    text: "Choose bulbs that sit comfortably inside the shade profile with air space around the bulb, neck, and opening. As a practical starting point, compact E27 LEDs around 45–60 mm wide and 80–110 mm tall are usually easier to fit than oversized feature bulbs.",
  },
  {
    icon: ThermometerSun,
    title: "Heat and clearance",
    text: "Leave visible clearance between the bulb and PLA surfaces. If a bulb runs hot to the touch, crowds the shade, or touches any printed surface, choose a smaller and lower-heat LED before use.",
  },
];

const includedRows = [
  {
    label: "ArcVane supplies",
    value:
      "Decorative shades, decorative lighting forms, stands, diffusers, mechanical adapters, and modular lighting accessories, as stated on each product page.",
  },
  {
    label: "Customer supplies",
    value:
      "Compatible E27 lamp holder, low-heat E27 LED bulb, and stable compliant lamp base or customer-supplied fitting. The customer also supplies any electrical socket, cord, plug, switch, and wiring required for that fitting.",
  },
  {
    label: "ArcVane does not currently supply",
    value:
      "Bulbs, electrical sockets, cords, plugs, lamp holders, wiring, complete lamp bases, or electrical assemblies unless a future product page explicitly states otherwise.",
  },
];

const bulbGuidance = [
  "Prefer low-heat E27 LED bulbs with modest physical dimensions and a broad, diffused light output.",
  "Typical bulb styles to consider are compact A60, G45, P45, or small opal globe LEDs, provided the listed dimensions leave clearance inside the selected shade.",
  "Check the bulb envelope diameter, total bulb height, and neck shape against the dimensions shown on the product page; 45–60 mm diameter and 80–110 mm height is a useful working range for many compact E27 LEDs.",
  "Avoid oversized decorative globes, exposed-filament incandescent bulbs, halogen bulbs, heat lamps, and appliance bulbs.",
  "If the bulb or holder changes the shade angle, crowds the shade wall, or reduces airflow, treat that combination as incompatible.",
];

export default function CompatibilityPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Compatibility guide
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Choosing the right E27 components.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane objects shape light through printed form, surface, and clearance. The lamp
            holder, base or fitting, and bulb are selected separately, so the best result comes
            from treating fit, heat, and scale as part of the same decision.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {guideCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8"
                >
                  <Icon className="h-6 w-6 text-weathered-post" />

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-charcoal">
                    {card.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-deep-brown/70">{card.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-shell/70 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Component scope.
            </h2>

            <div className="mt-7 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {includedRows.map((row) => (
                <div key={row.label} className="grid gap-3 py-5 sm:grid-cols-[0.34fr_0.66fr]">
                  <p className="text-sm font-semibold text-charcoal">{row.label}</p>
                  <p className="text-sm leading-7 text-deep-brown/70">{row.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Bulb selection notes.
            </h2>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-deep-brown/70">
              {bulbGuidance.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-amber" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-charcoal">
              Before ordering.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-deep-brown/70">
              Review the product page for supplied ArcVane components, dimensions, adapter notes,
              and clearance language. If you are matching an existing E27 lamp holder or base, confirm
              the holder neck, bulb envelope, shade opening, and airflow before purchase.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="rounded-full bg-charcoal px-5 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
              >
                View the collection
              </Link>

              <Link
                href="/safety"
                className="rounded-full border border-charcoal/15 px-5 py-3 text-center text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
              >
                Read safety guidance
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
