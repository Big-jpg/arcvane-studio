// app/materials/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Lightbulb,
  Palette,
  Shell,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "The ArcVane Studio material story: translucent PLA diffusion, matte finishes, visible texture, and warm low-power LED light.",
};

const materialStories = [
  {
    icon: Shell,
    title: "Translucent diffusion",
    kicker: "Shell, sea glass, mineral glow",
    text: "Clear PLA softens light through thickness, ribbing, and edge glow rather than perfect transparency.",
  },
  {
    icon: Palette,
    title: "Matte surfaces",
    kicker: "Weathered timber, limestone, handled texture",
    text: "Matte PLA gives stands and tripods a softer, quieter surface with a more tactile finish.",
  },
  {
    icon: Layers,
    title: "Visible texture",
    kicker: "Shell striation, coral growth, dune lines",
    text: "Layer lines remain part of the object, carrying rhythm and surface character rather than being hidden away.",
  },
];

const finishNotes = [
  {
    title: "Variable opacity",
    text: "Diffusion changes with wall thickness, rib spacing, bulb warmth, and surrounding light.",
  },
  {
    title: "Internal glow",
    text: "The shades are designed to gather and soften light before releasing it into the room.",
  },
  {
    title: "Small-run variation",
    text: "Minor tonal and surface differences are expected between batches.",
  },
  {
    title: "LED-only use",
    text: "ArcVane products are designed exclusively for low-power LED bulbs.",
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
            Translucent PLA, treated like a coastal material.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-deep-brown/70 sm:text-lg">
            ArcVane uses clear PLA, matte finishes, and visible FDM texture as
            part of the object itself: glow, softness, opacity, and surface
            rhythm.
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

                  <p className="mt-5 text-sm leading-7 text-deep-brown/70">
                    {story.text}
                  </p>
                </article>
              );
            })}
          </div>

          <section className="mt-12 rounded-[2rem] border border-charcoal/10 bg-horizon-blue/20 p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <Sparkles className="h-7 w-7 text-weathered-post" />

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-charcoal">
                  Small-batch finishing.
                </h2>

                <p className="mt-5 text-sm leading-7 text-deep-brown/70">
                  The aim is controlled variation rather than factory sameness:
                  surfaces that show their making, diffusers that shift under
                  light, and tones that sit quietly inside the collection.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {finishNotes.map((note) => (
                  <div
                    key={note.title}
                    className="rounded-2xl border border-charcoal/10 bg-off-white/80 p-5"
                  >
                    <h3 className="text-base font-semibold text-charcoal">
                      {note.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-deep-brown/68">
                      {note.text}
                    </p>
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
                  Low-power LED only.
                </h2>

                <p className="mt-4 text-sm leading-7 text-deep-brown/70">
                  ArcVane lighting pieces are designed for low-heat LED bulbs.
                  Incandescent, halogen, heat lamp, and other high-temperature
                  bulbs are not compatible with the material system.
                </p>

                <Link
                  href="/safety"
                  className="mt-5 inline-flex rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-off-white transition-colors hover:bg-deep-brown"
                >
                  Read the safety note
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}