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
    description: "Softens first light into quiet structure.",
    mobileDescription: "Softens first light into quiet structure.",
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
    description: "Printed geometry becomes part of the room.",
    mobileDescription: "Printed geometry becomes part of the room.",
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
    description: "Edges warm as the room transitions.",
    mobileDescription: "Edges warm as the room transitions.",
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
    description: "Holds glow close. A quieter centre.",
    mobileDescription: "Holds glow close. A quieter centre.",
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
