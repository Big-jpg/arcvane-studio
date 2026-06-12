// app/materials/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Layers3, MoonStar, SunMedium } from "lucide-react";

import { FinishSwatch, type FinishSwatchProps } from "@/components/materials/finish-swatch";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "ArcVane Studio lampshade finishes, including translucent PLA, transparent PETG, glow in the dark minerals, UV reactive, copper silk, and matte PLA.",
};

const finishes: FinishSwatchProps[] = [
  {
    name: "Translucent PLA",
    summary:
      "A soft, shell-like diffusion that keeps the printed structure visible without leaving the light source exposed.",
    behaviour: "Spreads glow through the wall",
    bestAt: "Dawn and warm evening light",
    variants: [
      {
        label: "Side glow",
        view: "translucent PLA side-lit shade",
        background:
          "radial-gradient(circle at 50% 48%, rgba(255, 225, 153, 0.82), rgba(255, 245, 215, 0.36) 31%, rgba(172, 128, 74, 0.2) 52%, transparent 70%), linear-gradient(140deg, rgba(255, 252, 241, 0.92), rgba(247, 218, 169, 0.7) 45%, rgba(183, 132, 78, 0.34)), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 9px)",
      },
      {
        label: "Back light",
        view: "translucent PLA back-lit shade",
        background:
          "radial-gradient(circle at 45% 40%, rgba(255, 243, 196, 0.95), rgba(255, 234, 174, 0.58) 25%, rgba(216, 172, 113, 0.28) 50%, rgba(94, 66, 38, 0.18) 76%), linear-gradient(180deg, rgba(255, 251, 239, 0.94), rgba(239, 207, 158, 0.58)), repeating-radial-gradient(circle at 50% 64%, rgba(255,255,255,0.18) 0 2px, transparent 2px 8px)",
      },
      {
        label: "Rib detail",
        view: "translucent PLA ribbed shade detail",
        background:
          "linear-gradient(100deg, rgba(255,255,255,0.82), rgba(247, 220, 172, 0.48) 34%, rgba(168, 114, 59, 0.28) 68%, rgba(255,255,255,0.42)), repeating-linear-gradient(90deg, rgba(255,255,255,0.46) 0 5px, rgba(190, 139, 77,0.22) 5px 11px), radial-gradient(circle at 50% 25%, rgba(255, 236, 183, 0.68), transparent 42%)",
      },
    ],
  },
  {
    name: "Transparent PETG",
    summary:
      "Clearer and cooler than PLA, with a glass-like edge that catches highlights and lets layered forms remain legible.",
    behaviour: "Carries highlights to the edge",
    bestAt: "Daylight and low-angle light",
    variants: [
      {
        label: "Clear wall",
        view: "transparent PETG clear wall shade",
        background:
          "linear-gradient(135deg, rgba(248, 253, 255, 0.92), rgba(185, 222, 235, 0.34) 43%, rgba(51, 108, 133, 0.22)), radial-gradient(circle at 64% 30%, rgba(255,255,255,0.85), transparent 20%), linear-gradient(105deg, transparent 18%, rgba(255,255,255,0.66) 22%, transparent 27%, transparent 53%, rgba(255,255,255,0.52) 57%, transparent 63%)",
      },
      {
        label: "Edge catch",
        view: "transparent PETG edge-lit shade",
        background:
          "radial-gradient(circle at 50% 58%, rgba(210, 247, 255, 0.74), transparent 38%), linear-gradient(90deg, rgba(255,255,255,0.72), rgba(130, 198, 220, 0.26) 22%, rgba(19, 69, 94, 0.18) 52%, rgba(255,255,255,0.62)), repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0 2px, transparent 2px 12px)",
      },
      {
        label: "Low angle",
        view: "transparent PETG low angle shade",
        background:
          "linear-gradient(180deg, rgba(249, 253, 255, 0.9), rgba(173, 218, 232, 0.46) 42%, rgba(44, 91, 112, 0.34)), linear-gradient(125deg, transparent 0 37%, rgba(255,255,255,0.68) 39% 43%, transparent 46%), radial-gradient(circle at 30% 22%, rgba(255,255,255,0.78), transparent 18%)",
      },
    ],
  },
  {
    name: "Glow in the Dark",
    summary:
      "Photoluminescent mineral stores light, then returns a quiet green afterglow as the room darkens.",
    behaviour: "Charges, then slowly releases light",
    bestAt: "The transition into darkness",
    variants: [
      {
        label: "Charged",
        view: "charged glow in the dark shade",
        background:
          "radial-gradient(circle at 50% 50%, rgba(190, 255, 160, 0.95), rgba(115, 235, 119, 0.68) 25%, rgba(45, 108, 57, 0.36) 48%, transparent 68%), radial-gradient(circle at 50% 78%, rgba(155, 255, 143, 0.45), transparent 24%), linear-gradient(145deg, #07110b, #102318 52%, #040706)",
      },
      {
        label: "Fade",
        view: "fading glow in the dark shade",
        background:
          "radial-gradient(circle at 48% 46%, rgba(152, 255, 147, 0.62), rgba(70, 177, 84, 0.38) 29%, transparent 59%), repeating-radial-gradient(circle at 48% 48%, rgba(177,255,147,0.1) 0 2px, transparent 2px 10px), linear-gradient(160deg, #06080a, #142018 48%, #07090a)",
      },
      {
        label: "Rim glow",
        view: "rim-lit glow in the dark shade",
        background:
          "radial-gradient(ellipse at 50% 73%, rgba(171, 255, 154, 0.8), rgba(70, 197, 84, 0.34) 22%, transparent 45%), linear-gradient(90deg, rgba(102,255,120,0.08), transparent 28%, transparent 72%, rgba(102,255,120,0.12)), linear-gradient(150deg, #050706, #102018 58%, #030403)",
      },
      {
        label: "UV charge",
        view: "UV charged photoluminescent shade",
        background:
          "radial-gradient(circle at 38% 35%, rgba(177, 110, 255, 0.66), transparent 24%), radial-gradient(circle at 55% 54%, rgba(168, 255, 143, 0.82), rgba(69, 217, 85, 0.42) 30%, transparent 58%), linear-gradient(135deg, #080813, #111d18 54%, #030407)",
      },
    ],
  },
  {
    name: "UV Reactive",
    summary:
      "Restrained in ordinary light, then unexpectedly vivid under ultraviolet illumination.",
    behaviour: "Reveals colour under UV",
    bestAt: "Dusk, events, and hidden accents",
    variants: [
      {
        label: "Room light",
        view: "UV reactive shade under room light",
        background:
          "linear-gradient(140deg, rgba(249, 251, 255, 0.9), rgba(214, 224, 245, 0.56) 45%, rgba(164, 126, 196, 0.28)), radial-gradient(circle at 68% 31%, rgba(255,255,255,0.72), transparent 22%), repeating-linear-gradient(90deg, rgba(255,255,255,0.24) 0 3px, transparent 3px 11px)",
      },
      {
        label: "UV wash",
        view: "UV reactive shade under ultraviolet wash",
        background:
          "radial-gradient(circle at 48% 44%, rgba(0, 245, 255, 0.72), rgba(134, 91, 255, 0.5) 31%, transparent 61%), linear-gradient(135deg, #130b2d, #332071 48%, #051827), linear-gradient(95deg, transparent 20%, rgba(255,255,255,0.3) 24%, transparent 31%)",
      },
      {
        label: "Split light",
        view: "UV reactive shade split between ambient and UV light",
        background:
          "linear-gradient(90deg, rgba(243, 247, 255, 0.9) 0 43%, rgba(151, 99, 255, 0.62) 52%, rgba(0, 215, 255, 0.52) 100%), radial-gradient(circle at 63% 37%, rgba(255,255,255,0.6), transparent 20%), repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 10px)",
      },
    ],
  },
  {
    name: "Copper Silk",
    summary:
      "A directional metallic finish that moves from earthen brown to bright copper as the viewing angle changes.",
    behaviour: "Reflects a warm, travelling sheen",
    bestAt: "Raked and low evening light",
    variants: [
      {
        label: "Broad sheen",
        view: "copper silk shade with broad sheen",
        background:
          "linear-gradient(115deg, #4f2414 0%, #b85f2a 24%, #f0b069 43%, #8e3e22 62%, #f4c083 76%, #3f1a11 100%), radial-gradient(circle at 36% 28%, rgba(255,255,255,0.42), transparent 20%), repeating-linear-gradient(92deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 8px)",
      },
      {
        label: "Raked light",
        view: "copper silk shade under raked light",
        background:
          "linear-gradient(130deg, #2d120b, #7b321b 28%, #f7bc73 36%, #b85d2f 44%, #6b2818 68%, #d88b4b 82%, #35150d), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 7px)",
      },
      {
        label: "Detail",
        view: "copper silk rib detail shade",
        background:
          "repeating-linear-gradient(90deg, #6f2c19 0 6px, #d57b3d 6px 10px, #f0b56d 10px 13px, #8f3e21 13px 19px), radial-gradient(circle at 54% 25%, rgba(255,255,255,0.38), transparent 23%)",
      },
    ],
  },
  {
    name: "Matte PLA",
    summary:
      "A quieter, opaque surface for stands and outer forms where silhouette and shadow matter more than transmitted glow.",
    behaviour: "Absorbs glare and holds shadow",
    bestAt: "Bright rooms and sculptural forms",
    variants: [
      {
        label: "Soft shadow",
        view: "matte PLA shade in soft shadow",
        background:
          "linear-gradient(145deg, #f0eadf, #cfc2b0 42%, #8d8073 100%), radial-gradient(circle at 42% 28%, rgba(255,255,255,0.42), transparent 23%), repeating-linear-gradient(88deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 9px)",
      },
      {
        label: "Warm neutral",
        view: "warm neutral matte PLA shade",
        background:
          "linear-gradient(120deg, #eadbc5, #d0b99a 48%, #8c7257), radial-gradient(circle at 65% 32%, rgba(255,255,255,0.3), transparent 22%), repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 8px)",
      },
      {
        label: "Cool neutral",
        view: "cool neutral matte PLA shade",
        background:
          "linear-gradient(145deg, #edf0ed, #bfc5bf 45%, #747d77 100%), radial-gradient(circle at 36% 29%, rgba(255,255,255,0.34), transparent 24%), repeating-linear-gradient(90deg, rgba(255,255,255,0.11) 0 3px, transparent 3px 12px)",
      },
    ],
  },
];

export default function MaterialsPage() {
  return (
    <main className="bg-ts-bg text-ts-text transition-colors duration-300">
      <section className="relative overflow-hidden px-6 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-12">
        <div
          className="absolute -right-24 top-8 h-96 w-96 rounded-full bg-ts-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">
              Material studies
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.055em] text-ts-text sm:text-6xl lg:text-7xl">
              Material finishes are another way of shaping light.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ts-muted sm:text-xl sm:leading-9">
              Every form begins with a material decision; these finishes show how each surface
              holds, reflects, transmits, or remembers light.
            </p>
            <Link
              href="#finish-studies"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-ts-accent px-6 py-3 text-sm font-semibold text-ts-bg shadow-[0_16px_45px_rgba(0,0,0,0.13)] transition duration-300 hover:-translate-y-0.5 hover:bg-ts-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Explore the finishes
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none" />
            </Link>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-[2.25rem] border border-ts-accent/20 bg-[radial-gradient(circle_at_48%_42%,rgba(255,225,153,0.8),rgba(216,172,113,0.28)_34%,transparent_63%),linear-gradient(145deg,rgba(255,252,241,0.88),rgba(183,132,78,0.3))] shadow-[0_30px_100px_rgba(0,0,0,0.14)] sm:min-h-96">
            <div className="absolute inset-x-[22%] bottom-[12%] h-[68%] rounded-b-[48%] rounded-t-[18%] border border-white/40 bg-white/10 shadow-[inset_0_18px_55px_rgba(255,255,255,0.3),inset_0_-28px_65px_rgba(91,55,24,0.16),0_30px_75px_rgba(0,0,0,0.2)] backdrop-blur-[1px]" />
            <div className="absolute inset-x-[32%] bottom-[20%] h-[48%] rounded-b-[48%] rounded-t-[18%] border-x border-white/25 bg-black/5" />
            <div className="absolute left-1/2 top-[18%] h-[60%] w-px -translate-x-1/2 bg-white/45" />
            <div className="absolute left-1/2 top-[14%] h-[12%] w-[16%] -translate-x-1/2 rounded-full border border-white/40 bg-white/25" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/35 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              Light through matter
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ts-accent/15 bg-ts-surface/35 px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            {
              icon: SunMedium,
              label: "Transmission",
              text: "How much light passes through the wall, and how softly it arrives.",
            },
            {
              icon: Layers3,
              label: "Surface",
              text: "How ribs, layers, sheen, and opacity make the object visible.",
            },
            {
              icon: MoonStar,
              label: "Time",
              text: "How the finish changes between daylight, dusk, UV, and darkness.",
            },
          ].map((quality) => {
            const Icon = quality.icon;

            return (
              <div key={quality.label} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ts-accent/25 bg-ts-bg/65">
                  <Icon className="h-5 w-5 text-ts-accent" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ts-text">{quality.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-ts-muted">{quality.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="finish-studies" className="scroll-mt-20 px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ts-accent">
                Six material directions
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-ts-text sm:text-5xl">
                The same form can tell a different story.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ts-muted">
              Move through each study to compare how the finish behaves as the light source, angle,
              or room changes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {finishes.map((finish) => (
              <FinishSwatch key={finish.name} {...finish} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-ts-accent/20 bg-ts-surface/70 shadow-[0_28px_95px_rgba(0,0,0,0.12)]">
          <div className="border-b border-ts-accent/15 px-6 py-10 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ts-accent">
              Continue the material story
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-ts-text sm:text-5xl">
              See what the material becomes.
            </h2>
          </div>

          <div className="grid md:grid-cols-3">
            {[
              {
                href: "/products",
                eyebrow: "Collection",
                title: "Choose a finished form",
                text: "See these material directions applied to current shades, diffusers, and sets.",
              },
              {
                href: "/process",
                eyebrow: "Process",
                title: "Follow the studio work",
                text: "Move from material choice into printing, finishing, checking, and packing.",
              },
              {
                href: "/#chapter-dawn",
                eyebrow: "Light journey",
                title: "Return to the changing room",
                text: "Follow the homepage study from dawn through evening and into the apparatus.",
              },
            ].map((path, index) => (
              <Link
                key={path.href}
                href={path.href}
                className={`group flex min-h-64 flex-col justify-between p-7 transition-colors hover:bg-ts-bg/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ts-accent sm:p-9 ${
                  index > 0 ? "border-t border-ts-accent/15 md:border-l md:border-t-0" : ""
                }`}
              >
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-ts-accent">
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ts-text">
                    {path.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ts-muted">{path.text}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ts-text">
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
