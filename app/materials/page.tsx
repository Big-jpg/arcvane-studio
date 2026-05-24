// app/materials/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Lightbulb, Palette, Shell, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "The ArcVane Studio material story: clear PLA diffusion, matte PLA stands, intentional layer texture, small-batch finishing, and LED-only use.",
};

const materialStories = [
  {
    icon: Shell,
    title: "Clear PLA as optical diffusion",
    kicker: "Frosted shell, sea glass, translucent mineral",
    text: "Clear PLA is used for its softness under light rather than for glass-like transparency. Thin areas brighten and edges glow; thicker ribs hold a milky opacity that reads like shell, sea glass, or a translucent mineral surface.",
  },
  {
    icon: Palette,
    title: "Matte PLA for stands and tripods",
    kicker: "Weathered posts, coastal railings, quiet touch",
    text: "Matte PLA gives table-lamp bases and tripod stands a soft-touch character. The reference is practical coastal material: sun-faded beach posts, limestone paths, muted railings, and timber that has been handled by weather rather than polished for gloss.",
  },
  {
    icon: Layers,
    title: "Layer lines as natural texture",
    kicker: "Shell striation, sediment, coral growth, timber grain",
    text: "FDM layer lines are treated as part of the surface language. They are not hidden as defects; they carry the object’s rhythm in the same way shells, dunes, coral, limestone, and wind-carved timber hold visible growth or sediment lines.",
  },
];

const finishNotes = [
  {
    title: "Variable opacity",
    text: "Clear and translucent shades shift between frosted, cloudy, and edge-lit depending on wall thickness, rib spacing, LED warmth, and surrounding room light.",
  },
  {
    title: "Internal glow",
    text: "The material is intended to soften the source and let light accumulate inside the object before releasing it as a warm domestic glow.",
  },
  {
    title: "Small-batch variation",
    text: "Fine differences in colour, surface sheen, layer texture, and diffusion are expected between batches and are part of the studio character.",
  },
  {
    title: "Low-heat LED use",
    text: "PLA is used only within the intended low-power LED lighting model. Incandescent, halogen, heat lamp, or other high-temperature bulbs are not supported.",
  },
];

export default function MaterialsPage() {
  return (
    <>
      <section className="bg-shell py-20 text-charcoal sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-warm-amber">
            Material story
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-charcoal sm:text-6xl">
            PLA treated as a coastal material, not a cheap substitute.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane uses clear PLA, matte PLA, and visible FDM texture as deliberate parts of the
            object: shell-like diffusion, soft stand finishes, and tactile striation that belongs to
            the form.
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {materialStories.map((story) => {
              const Icon = story.icon;
              return (
                <article
                  key={story.title}
                  className="rounded-[1.75rem] border border-charcoal/10 bg-shell/65 p-6 shadow-sm shadow-charcoal/5 sm:p-8"
                >
                  <Icon className="h-6 w-6 text-weathered-post" />
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-warm-amber">
                    {story.kicker}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-charcoal">
                    {story.title}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-deep-brown/70">{story.text}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <Sparkles className="h-7 w-7 text-weathered-post" />
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
                  Finishing is small-batch by design.
                </h2>
                <p className="mt-5 text-sm leading-7 text-deep-brown/70">
                  The aim is not factory sameness. The aim is controlled variation: surfaces that
                  show their making, diffusers that behave differently under light, and tones that sit
                  inside a calm coastal palette without pretending to be injection-moulded plastic.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {finishNotes.map((note) => (
                  <div key={note.title} className="rounded-2xl border border-charcoal/10 bg-off-white/80 p-5">
                    <h3 className="text-base font-semibold text-charcoal">{note.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-deep-brown/68">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 rounded-[2rem] border border-warm-amber/25 bg-warm-amber/5 p-6 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Lightbulb className="h-7 w-7 shrink-0 text-warm-amber" />
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-charcoal">
                  LED safety is part of the material specification.
                </h2>
                <p className="mt-4 text-sm leading-7 text-deep-brown/70">
                  ArcVane products are designed for low-power LED bulbs only. Within that intended
                  use, LED operating temperatures are low enough for the PLA lighting model. Heat
                  concerns arise when customers use incandescent, halogen, heat lamp, appliance, or
                  other high-temperature bulbs, which are not compatible with ArcVane products.
                </p>
                <Link
                  href="/safety"
                  className="mt-5 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
                >
                  Read the LED safety note
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
