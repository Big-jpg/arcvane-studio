// lib/time-chapters.ts

export interface TimeChapter {
  key: "dawn" | "midday" | "dusk" | "evening";
  title: string;
  subtitle: string;
  description: string;
  bestFor: string;
  cta: { label: string; href: string };
  image?: string;
}

export const timeChapters: TimeChapter[] = [
  {
    key: "dawn",
    title: "Dawn",
    subtitle: "Light that enters softly.",
    description:
      "Some rooms need presence before brightness. ArcVane shades are designed to soften the first light of the day, giving structure to a space without overwhelming it.",
    bestFor: "bedrooms, reading corners, quiet morning spaces.",
    cta: { label: "See soft diffusion shades", href: "/products" },
    image: "/products/product-01.png",
  },
  {
    key: "midday",
    title: "Midday",
    subtitle: "The object, clearly seen.",
    description:
      "In daylight, the shade becomes a sculptural object: printed geometry, layered material, and a visible relationship between bulb, diffuser, and shell.",
    bestFor: "shelves, desks, sideboards, display lighting.",
    cta: { label: "View materials", href: "/materials" },
    image: "/products/product-02.png",
  },
  {
    key: "dusk",
    title: "Dusk",
    subtitle: "A room changes before the light does.",
    description:
      "As natural light falls away, the shade begins to define the room. Edges warm, surfaces flatten, and the object becomes part of the transition from day to evening.",
    bestFor: "living rooms, dining areas, transitional spaces.",
    cta: { label: "Explore warm light fields", href: "/products" },
    image: "/products/product-03.png",
  },
  {
    key: "evening",
    title: "Evening",
    subtitle: "Held light, softened edges.",
    description:
      "Evening light should not feel clinical. ArcVane shades are designed to hold glow close to the object, giving the room a quieter centre.",
    bestFor: "bedside tables, children's rooms, low-light spaces.",
    cta: { label: "View evening shades", href: "/products" },
    image: "/products/product-04.png",
  },
];
