// app/safety/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ShieldCheck, ThermometerSun } from "lucide-react";

export const metadata: Metadata = {
  title: "LED Bulb Safety",
  description:
    "Safety guidance for ArcVane Studio shades and decorative components, including LED-only use, heat limits, and mechanical adapter notes.",
};

const safeUse = [
  "Use modern low-heat LED bulbs only.",
  "Check the wattage, operating temperature, and clearance limits on your customer-supplied E27 lamp holder, base, or existing fitting.",
  "Use any ArcVane mechanical adapter only to support the shade or diffuser.",
  "Ask an electrician if the lamp holder, wiring, cord, plug, base, or room conditions look damaged or unusual.",
];

const unsafeUse = [
  "No incandescent bulbs.",
  "No halogen bulbs.",
  "No heat lamps or appliance bulbs.",
  "No wiring, socket, or fixed-installation changes to force a fit.",
];

export default function SafetyPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Product safety
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            Low-heat LED only.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane shades, diffusers, and shade-and-stand objects are designed for low-heat LED
            bulbs only. This is a product requirement, not a styling preference.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-warm-amber/30 bg-warm-amber/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-1 h-7 w-7 shrink-0 text-warm-amber" />

              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-charcoal">
                  Do not use high-heat bulbs.
                </h2>

                <p className="mt-3 text-sm leading-7 text-deep-brown/75">
                  Incandescent, halogen, heat lamp, appliance, or unknown high-temperature bulbs
                  must not be used with ArcVane shades or diffusers. Heat can deform PLA, shorten
                  product life, and create an unsafe fitting condition.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
              <CheckCircle2 className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">Safe use</h2>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-deep-brown/70">
                {safeUse.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-amber" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8">
              <ThermometerSun className="h-6 w-6 text-weathered-post" />

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">
                Do not use
              </h2>

              <ul className="mt-5 space-y-3 text-sm leading-7 text-deep-brown/70">
                {unsafeUse.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-8 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <ShieldCheck className="h-6 w-6 text-weathered-post" />

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
              What a mechanical adapter does.
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-sm leading-7 text-deep-brown/70">
              <p>
                Where an ArcVane adapter is included or selected, it is a mechanical support for the
                shade or diffuser. It helps the decorative component sit correctly on a compatible
                customer-supplied E27 lamp holder, base, or existing fitting.
              </p>

              <p>
                It does not include, replace, or change lamp holders, electrical sockets, cords,
                switches, plugs, wiring, contacts, insulation, earthing, complete lamp bases, or
                fixed electrical infrastructure. If the lamp holder, base, or fitting is loose,
                damaged, cracked, discoloured, overheating, or otherwise questionable, have it
                checked before using any decorative shade.
              </p>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/fitting-guide"
              className="inline-flex justify-center rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
            >
              Read the fitting guide
            </Link>

            <Link
              href="/faq"
              className="inline-flex justify-center rounded-full border border-charcoal/15 px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal/35"
            >
              Read safety FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
