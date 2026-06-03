// app/materials/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import { FinishSwatch, type FinishSwatchProps } from "@/components/materials/finish-swatch";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "ArcVane Studio lampshade finishes, including translucent PLA, transparent PETG, glow in the dark minerals, UV reactive, copper silk, and matte PLA.",
};

const finishes: FinishSwatchProps[] = [
  {
    name: "Translucent PLA",
    description:
      "A softened diffuser finish for warm domestic light, where wall thickness and rib spacing become part of the optical system.",
    properties: ["Soft diffusion", "Warm edge glow", "Layered opacity"],
    technicalNote: "Best used where the shade should glow as a surface, not reveal the lamp hardware directly.",
    variants: [
      {
        label: "Side glow",
        view: "translucent PLA side-lit shade",
        description: "A milky shell gradient suggests how translucent PLA gathers amber light around the shade rim.",
        background:
          "radial-gradient(circle at 50% 48%, rgba(255, 225, 153, 0.82), rgba(255, 245, 215, 0.36) 31%, rgba(172, 128, 74, 0.2) 52%, transparent 70%), linear-gradient(140deg, rgba(255, 252, 241, 0.92), rgba(247, 218, 169, 0.7) 45%, rgba(183, 132, 78, 0.34)), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 9px)",
      },
      {
        label: "Back light",
        view: "translucent PLA back-lit shade",
        description: "A brighter centre and quieter outer wall approximate the uneven opacity of a real printed diffuser.",
        background:
          "radial-gradient(circle at 45% 40%, rgba(255, 243, 196, 0.95), rgba(255, 234, 174, 0.58) 25%, rgba(216, 172, 113, 0.28) 50%, rgba(94, 66, 38, 0.18) 76%), linear-gradient(180deg, rgba(255, 251, 239, 0.94), rgba(239, 207, 158, 0.58)), repeating-radial-gradient(circle at 50% 64%, rgba(255,255,255,0.18) 0 2px, transparent 2px 8px)",
      },
      {
        label: "Rib detail",
        view: "translucent PLA ribbed detail",
        description: "Fine vertical banding stands in for printed ribs that brighten at the crests and mute in the valleys.",
        background:
          "linear-gradient(100deg, rgba(255,255,255,0.82), rgba(247, 220, 172, 0.48) 34%, rgba(168, 114, 59, 0.28) 68%, rgba(255,255,255,0.42)), repeating-linear-gradient(90deg, rgba(255,255,255,0.46) 0 5px, rgba(190, 139, 77,0.22) 5px 11px), radial-gradient(circle at 50% 25%, rgba(255, 236, 183, 0.68), transparent 42%)",
      },
    ],
  },
  {
    name: "Transparent PETG",
    description:
      "A clearer lampshade finish with stronger specular highlights, used where internal geometry can be part of the visual language.",
    properties: ["Clearer wall", "Cool highlights", "Visible structure"],
    technicalNote: "Works best for low-heat LED compositions where transparency and reflection are intentional.",
    variants: [
      {
        label: "Clear wall",
        view: "transparent PETG clear wall shade",
        description: "Pale blue glazing and sharp white streaks indicate a clearer PETG surface catching window light.",
        background:
          "linear-gradient(135deg, rgba(248, 253, 255, 0.92), rgba(185, 222, 235, 0.34) 43%, rgba(51, 108, 133, 0.22)), radial-gradient(circle at 64% 30%, rgba(255,255,255,0.85), transparent 20%), linear-gradient(105deg, transparent 18%, rgba(255,255,255,0.66) 22%, transparent 27%, transparent 53%, rgba(255,255,255,0.52) 57%, transparent 63%)",
      },
      {
        label: "Edge catch",
        view: "transparent PETG edge-lit shade",
        description: "The edge lighting placeholder emphasises the bright rim lines typical of clearer printed PETG.",
        background:
          "radial-gradient(circle at 50% 58%, rgba(210, 247, 255, 0.74), transparent 38%), linear-gradient(90deg, rgba(255,255,255,0.72), rgba(130, 198, 220, 0.26) 22%, rgba(19, 69, 94, 0.18) 52%, rgba(255,255,255,0.62)), repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0 2px, transparent 2px 12px)",
      },
      {
        label: "Low angle",
        view: "transparent PETG low angle shade",
        description: "A deeper lower gradient suggests the way transparent PETG stacks reflections at shallow viewing angles.",
        background:
          "linear-gradient(180deg, rgba(249, 253, 255, 0.9), rgba(173, 218, 232, 0.46) 42%, rgba(44, 91, 112, 0.34)), linear-gradient(125deg, transparent 0 37%, rgba(255,255,255,0.68) 39% 43%, transparent 46%), radial-gradient(circle at 30% 22%, rgba(255,255,255,0.78), transparent 18%)",
      },
    ],
  },
  {
    name: "Glow in the Dark",
    description:
      "A photoluminescent finish charged by ambient or UV light, using rare earth mineral additives for an after-dark surface glow.",
    properties: ["Photoluminescent", "Rare earth minerals", "Afterglow"],
    technicalNote: "The glow is strongest after direct charging and fades gradually rather than remaining electrically lit.",
    variants: [
      {
        label: "Charged",
        view: "charged glow in the dark shade",
        description: "A green core on a dark field models the charged-state afterglow of a mineral-loaded shade.",
        background:
          "radial-gradient(circle at 50% 50%, rgba(190, 255, 160, 0.95), rgba(115, 235, 119, 0.68) 25%, rgba(45, 108, 57, 0.36) 48%, transparent 68%), radial-gradient(circle at 50% 78%, rgba(155, 255, 143, 0.45), transparent 24%), linear-gradient(145deg, #07110b, #102318 52%, #040706)",
      },
      {
        label: "Fade",
        view: "fading glow in the dark shade",
        description: "The dimmer view shows how the photoluminescent output falls off while the shade silhouette remains legible.",
        background:
          "radial-gradient(circle at 48% 46%, rgba(152, 255, 147, 0.62), rgba(70, 177, 84, 0.38) 29%, transparent 59%), repeating-radial-gradient(circle at 48% 48%, rgba(177,255,147,0.1) 0 2px, transparent 2px 10px), linear-gradient(160deg, #06080a, #142018 48%, #07090a)",
      },
      {
        label: "Rim glow",
        view: "rim-lit glow in the dark shade",
        description: "A brighter crescent implies stored light pooling around thicker printed lips and shade edges.",
        background:
          "radial-gradient(ellipse at 50% 73%, rgba(171, 255, 154, 0.8), rgba(70, 197, 84, 0.34) 22%, transparent 45%), linear-gradient(90deg, rgba(102,255,120,0.08), transparent 28%, transparent 72%, rgba(102,255,120,0.12)), linear-gradient(150deg, #050706, #102018 58%, #030403)",
      },
      {
        label: "UV charge",
        view: "UV charged photoluminescent shade",
        description: "Violet charge light contrasts with green afterglow to distinguish excitation from stored emission.",
        background:
          "radial-gradient(circle at 38% 35%, rgba(177, 110, 255, 0.66), transparent 24%), radial-gradient(circle at 55% 54%, rgba(168, 255, 143, 0.82), rgba(69, 217, 85, 0.42) 30%, transparent 58%), linear-gradient(135deg, #080813, #111d18 54%, #030407)",
      },
    ],
  },
  {
    name: "UV Reactive",
    description:
      "A finish selected for colour shift under ultraviolet light, useful where the shade changes between room light and event lighting.",
    properties: ["UV response", "Colour shift", "High contrast"],
    technicalNote: "The reactive effect depends on the strength and distance of the UV source, not only on the printed material.",
    variants: [
      {
        label: "Room light",
        view: "UV reactive shade under room light",
        description: "In normal light the finish reads controlled and pale, with only a hint of the stronger reactive colour.",
        background:
          "linear-gradient(140deg, rgba(249, 251, 255, 0.9), rgba(214, 224, 245, 0.56) 45%, rgba(164, 126, 196, 0.28)), radial-gradient(circle at 68% 31%, rgba(255,255,255,0.72), transparent 22%), repeating-linear-gradient(90deg, rgba(255,255,255,0.24) 0 3px, transparent 3px 11px)",
      },
      {
        label: "UV wash",
        view: "UV reactive shade under ultraviolet wash",
        description: "A violet-blue field and cyan highlights represent the stronger visual response under a UV wash.",
        background:
          "radial-gradient(circle at 48% 44%, rgba(0, 245, 255, 0.72), rgba(134, 91, 255, 0.5) 31%, transparent 61%), linear-gradient(135deg, #130b2d, #332071 48%, #051827), linear-gradient(95deg, transparent 20%, rgba(255,255,255,0.3) 24%, transparent 31%)",
      },
      {
        label: "Split light",
        view: "UV reactive shade split between ambient and UV light",
        description: "The split gradient shows the same shade moving from neutral ambient light into reactive purple-blue light.",
        background:
          "linear-gradient(90deg, rgba(243, 247, 255, 0.9) 0 43%, rgba(151, 99, 255, 0.62) 52%, rgba(0, 215, 255, 0.52) 100%), radial-gradient(circle at 63% 37%, rgba(255,255,255,0.6), transparent 20%), repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 10px)",
      },
    ],
  },
  {
    name: "Copper Silk",
    description:
      "A warm metallic-effect PLA with directional sheen, chosen for lamp bases, shade accents, and visibly sculptural forms.",
    properties: ["Metallic sheen", "Warm copper", "Directional highlight"],
    technicalNote: "Silk finishes are visual metallics rather than conductive or heat-rated metal components.",
    variants: [
      {
        label: "Broad sheen",
        view: "copper silk shade with broad sheen",
        description: "A copper-to-rose metallic sweep approximates the satin highlight produced by silk PLA curves.",
        background:
          "linear-gradient(115deg, #4f2414 0%, #b85f2a 24%, #f0b069 43%, #8e3e22 62%, #f4c083 76%, #3f1a11 100%), radial-gradient(circle at 36% 28%, rgba(255,255,255,0.42), transparent 20%), repeating-linear-gradient(92deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 8px)",
      },
      {
        label: "Raked light",
        view: "copper silk shade under raked light",
        description: "A narrower highlight band suggests how the sheen moves with viewing angle and printed curvature.",
        background:
          "linear-gradient(130deg, #2d120b, #7b321b 28%, #f7bc73 36%, #b85d2f 44%, #6b2818 68%, #d88b4b 82%, #35150d), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 7px)",
      },
      {
        label: "Detail",
        view: "copper silk rib detail",
        description: "Tight rib lines and alternating copper values stand in for the anisotropic shimmer of a printed surface.",
        background:
          "repeating-linear-gradient(90deg, #6f2c19 0 6px, #d57b3d 6px 10px, #f0b56d 10px 13px, #8f3e21 13px 19px), radial-gradient(circle at 54% 25%, rgba(255,255,255,0.38), transparent 23%)",
      },
    ],
  },
  {
    name: "Matte PLA",
    description:
      "A quiet, low-reflection surface for shades and supporting parts where form and silhouette should read before gloss.",
    properties: ["Low glare", "Soft texture", "Muted colour"],
    technicalNote: "Matte PLA is selected for tactile calm and silhouette clarity rather than high optical diffusion.",
    variants: [
      {
        label: "Soft shadow",
        view: "matte PLA shade in soft shadow",
        description: "Muted stone tones and broad shadow gradients suggest a lower-glare printed lampshade surface.",
        background:
          "linear-gradient(145deg, #f0eadf, #cfc2b0 42%, #8d8073 100%), radial-gradient(circle at 42% 28%, rgba(255,255,255,0.42), transparent 23%), repeating-linear-gradient(88deg, rgba(255,255,255,0.1) 0 2px, transparent 2px 9px)",
      },
      {
        label: "Warm neutral",
        view: "warm neutral matte PLA shade",
        description: "The warm neutral view keeps the shade calm and opaque while still showing subtle layer direction.",
        background:
          "linear-gradient(120deg, #eadbc5, #d0b99a 48%, #8c7257), radial-gradient(circle at 65% 32%, rgba(255,255,255,0.3), transparent 22%), repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 8px)",
      },
      {
        label: "Cool neutral",
        view: "cool neutral matte PLA shade",
        description: "Cooler grey-beige lighting demonstrates how matte material suppresses specular highlights.",
        background:
          "linear-gradient(145deg, #edf0ed, #bfc5bf 45%, #747d77 100%), radial-gradient(circle at 36% 29%, rgba(255,255,255,0.34), transparent 24%), repeating-linear-gradient(90deg, rgba(255,255,255,0.11) 0 3px, transparent 3px 12px)",
      },
    ],
  },
];

export default function MaterialsPage() {
  return (
    <main className="bg-ts-bg text-ts-text transition-colors duration-300">
      <section className="relative overflow-hidden px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_68%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">Material finishes</p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-ts-text sm:text-6xl lg:text-7xl">
                Lampshade finishes, tested through light.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-ts-muted sm:text-lg">
                Every form begins with a material decision. These are the finishes we work with — each
                chosen for how it shapes, diffuses, or transforms light.
              </p>
            </div>

            <aside className="rounded-[2rem] border border-ts-accent/20 bg-ts-surface/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.10)] backdrop-blur transition-colors duration-300">
              <h2 className="text-lg font-semibold tracking-tight text-ts-text">Placeholder image system</h2>
              <p className="mt-3 text-sm leading-7 text-ts-muted">
                These swatches use purpose-built CSS gradients rather than product catalogue images. They
                indicate finish behaviour, viewing angle, and lighting response without implying a final
                photographed product variant.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {finishes.map((finish) => (
              <FinishSwatch key={finish.name} {...finish} />
            ))}
          </div>

          <section className="mt-12 rounded-[2rem] border border-ts-accent/20 bg-ts-surface/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] transition-colors duration-300 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ts-accent">Use constraints</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ts-text">
                  Finish choice is part optical, part practical.
                </h2>
              </div>

              <div className="space-y-5 text-sm leading-7 text-ts-muted">
                <p>
                  The same printed form can behave differently depending on wall thickness, rib geometry,
                  bulb temperature, ambient light, and viewing angle. Transparent and translucent materials
                  are evaluated as optical surfaces; matte and silk materials are evaluated as sculptural
                  surfaces.
                </p>
                <p>
                  ArcVane lighting pieces remain designed for low-power LED bulbs. Incandescent, halogen,
                  heat lamp, and other high-temperature bulbs are not compatible with this material system.
                </p>
                <Link
                  href="/safety"
                  className="inline-flex rounded-full bg-ts-accent px-5 py-3 text-sm font-semibold text-ts-bg shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-ts-text hover:text-ts-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Read the safety note
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
