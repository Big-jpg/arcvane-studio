// lib/time-chapters.ts

export interface TimeChapter {
  key: "dawn" | "midday" | "dusk" | "evening";
  title: string;
  subtitle: string;
  description: string;
  mobileDescription: string;
  bestFor: string;
  mobileBestFor: string;
  cta: { label: string; href: string; cue: string };
  image?: string;
}

export const timeChapters: TimeChapter[] = [
  {
    key: "dawn",
    title: "Dawn",
    subtitle: "Light that enters softly.",
    description:
      "Some rooms need presence before brightness. ArcVane shades are designed to soften the first light of the day, giving structure to a space without overwhelming it.",
    mobileDescription: "Softens first light into a quiet, structured glow.",
    bestFor: "bedrooms, reading corners, quiet morning spaces.",
    mobileBestFor: "Bedrooms · reading corners",
    cta: {
      label: "Continue into midday",
      href: "#chapter-midday",
      cue: "Next light · 2 of 4",
    },
    image: "/products/product-01.png",
  },
  {
    key: "midday",
    title: "Midday",
    subtitle: "The object, clearly seen.",
    description:
      "In daylight, the shade becomes a sculptural object: printed geometry, layered material, and the visible relationship between a customer-supplied LED bulb, diffuser, and shell.",
    mobileDescription: "Printed geometry and layered material become part of the room.",
    bestFor: "shelves, desks, sideboards, display lighting.",
    mobileBestFor: "Desks · shelves · sideboards",
    cta: {
      label: "Follow the light to dusk",
      href: "#chapter-dusk",
      cue: "Next light · 3 of 4",
    },
    image: "/products/product-02.png",
  },
  {
    key: "dusk",
    title: "Dusk",
    subtitle: "A room changes before the light does.",
    description:
      "As natural light falls away, the shade begins to define the room. Edges warm, surfaces flatten, and the object becomes part of the transition from day to evening.",
    mobileDescription: "Warm edges carry the room from daylight into evening.",
    bestFor: "living rooms, dining areas, transitional spaces.",
    mobileBestFor: "Living · dining · transition",
    cta: {
      label: "Enter the evening",
      href: "#chapter-evening",
      cue: "Next light · 4 of 4",
    },
    image: "/products/product-03.png",
  },
  {
    key: "evening",
    title: "Evening",
    subtitle: "Held light, softened edges.",
    description:
      "Evening light should not feel clinical. ArcVane shades are designed to hold glow close to the object, giving the room a quieter centre.",
    mobileDescription: "Holds a gentle glow close, creating a quieter centre.",
    bestFor: "bedside tables, children's rooms, low-light spaces.",
    mobileBestFor: "Bedside · low-light spaces",
    cta: {
      label: "See how it comes together",
      href: "#apparatus",
      cue: "The apparatus · scroll to assemble",
    },
    image: "/products/product-04.png",
  },
];
