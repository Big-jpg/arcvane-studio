export type AtelierChapterId =
  | "light"
  | "place"
  | "observation"
  | "creation"
  | "system"
  | "collection"
  | "ownership"
  | "purchase";

export type AtelierTreatment =
  | "dawn"
  | "limestone"
  | "study"
  | "workshop"
  | "system"
  | "collection"
  | "interior"
  | "quiet";

export interface AtelierCta {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "quiet";
}

export interface AtelierImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface AtelierStudy {
  title: string;
  description: string;
  measure?: string;
}

export interface AtelierStoryChapter {
  id: AtelierChapterId;
  eyebrow: string;
  navLabel: string;
  title: string;
  subtitle?: string;
  description: string;
  treatment: AtelierTreatment;
  image?: AtelierImage;
  cta?: AtelierCta;
  secondaryCta?: AtelierCta;
  studies?: AtelierStudy[];
}

export const atelierChapters: AtelierStoryChapter[] = [
  {
    id: "light",
    eyebrow: "Chapter 01",
    navLabel: "Light",
    title: "Light first.",
    subtitle: "Before product. Before price. Before category.",
    description:
      "ArcVane begins with the way a warm source moves through translucent material and leaves a room softer than it found it.",
    treatment: "dawn",
    image: {
      src: "/products/product-05.png",
      alt: "A translucent ArcVane diffuser studied as a warm light vessel",
      caption: "Tidepool diffusion study",
    },
  },
  {
    id: "place",
    eyebrow: "Chapter 02",
    navLabel: "Place",
    title: "The place teaches the object.",
    subtitle: "Western Australian coast. Limestone. White sand. Wide sky.",
    description:
      "The forms borrow from coastal edges: shell ribs, wind-cut dunes, pale rock, timber posts, and the blue-grey line where weather meets water.",
    treatment: "limestone",
    image: {
      src: "/products/product-01.png",
      alt: "Shell-like ArcVane form against a pale coastal palette",
      caption: "Shell Fan, read as coastline",
    },
  },
  {
    id: "observation",
    eyebrow: "Chapter 03",
    navLabel: "Observation",
    title: "Observation before object.",
    description:
      "The studio studies how light thickens at an edge, how a rib throws shadow, and how clear PLA becomes quiet instead of transparent.",
    treatment: "study",
    image: {
      src: "/products/product-02.png",
      alt: "Ribbed translucent diffuser used as a light and shadow study",
      caption: "Rib, edge, opacity",
    },
    studies: [
      {
        title: "Edge glow",
        description: "Brightness collects where the material turns and thickens.",
        measure: "01",
      },
      {
        title: "Soft shadow",
        description: "Ribs create rhythm without turning the room into pattern.",
        measure: "02",
      },
      {
        title: "Variable opacity",
        description: "The material changes with wall thickness, bulb warmth, and daylight.",
        measure: "03",
      },
    ],
  },
  {
    id: "creation",
    eyebrow: "Chapter 04",
    navLabel: "Creation",
    title: "Sketch. Print. Finish. Assemble.",
    description:
      "The atelier process is visible but controlled: digital drawing, slow print time, hand finishing, hardware checking, and a final light test.",
    treatment: "workshop",
    image: {
      src: "/products/product-03.png",
      alt: "Dune-inspired ArcVane shade showing layered printed texture",
      caption: "Dune Rib, after finishing",
    },
    studies: [
      {
        title: "Prototype",
        description: "The first question is whether the form changes the light.",
        measure: "Sketch",
      },
      {
        title: "Surface",
        description: "Layer lines remain as material grain, not manufacturing noise.",
        measure: "Finish",
      },
      {
        title: "Assembly",
        description: "Hardware stays simple so the shade can carry the atmosphere.",
        measure: "Check",
      },
    ],
  },
  {
    id: "system",
    eyebrow: "Chapter 05",
    navLabel: "System",
    title: "Not a lamp. A lighting language.",
    subtitle: "Stand. Source. Shade. Adapter. Future shade families.",
    description:
      "The collection is built around a shared E27 logic so individual pieces can behave like parts of a larger visual grammar.",
    treatment: "system",
    image: {
      src: "/products/product-06.png",
      alt: "ArcVane tripod stand representing the modular lighting system",
      caption: "Base language",
    },
    studies: [
      {
        title: "Stand",
        description: "A quiet support, scaled for domestic rooms.",
        measure: "Base",
      },
      {
        title: "Source",
        description: "Low-power LED warmth, chosen for glow rather than glare.",
        measure: "E27",
      },
      {
        title: "Shade",
        description: "The interchangeable part that changes the room.",
        measure: "Form",
      },
    ],
  },
  {
    id: "collection",
    eyebrow: "Chapter 06",
    navLabel: "Collection",
    title: "The current collection is evidence.",
    description:
      "Finished shades, stands, and sets are available when they belong to the language. Commerce begins only after the atmosphere is understood.",
    treatment: "collection",
    image: {
      src: "/products/product-08.png",
      alt: "A coordinated ArcVane shade set representing the available collection",
      caption: "Clear PLA Coastal Set",
    },
    cta: {
      href: "/products",
      label: "Explore the collection",
    },
  },
  {
    id: "ownership",
    eyebrow: "Chapter 07",
    navLabel: "Ownership",
    title: "A room changes before the object is noticed.",
    description:
      "The goal is not spectacle. It is a pool of warmth on a table, a softer wall at night, a small coastal object that belongs without shouting.",
    treatment: "interior",
    image: {
      src: "/products/product-04.png",
      alt: "ArcVane table lamp suggesting warm domestic ownership",
      caption: "Limestone Bloom, room scale",
    },
    studies: [
      {
        title: "Bedside",
        description: "Low brightness, warm edges, no exposed harsh source.",
      },
      {
        title: "Studio",
        description: "A sculptural object that still behaves like useful light.",
      },
      {
        title: "Coastal home",
        description: "Shell, sand, limestone, and amber held in a small domestic scale.",
      },
    ],
  },
  {
    id: "purchase",
    eyebrow: "Chapter 08",
    navLabel: "Purchase",
    title: "Choose quietly.",
    subtitle: "The purchase should feel like a consequence, not a demand.",
    description:
      "Browse the pieces, read the material notes, and choose the object that fits the room you want to make softer.",
    treatment: "quiet",
    cta: {
      href: "/products",
      label: "View available pieces",
    },
    secondaryCta: {
      href: "/contact",
      label: "Ask the studio",
      variant: "secondary",
    },
  },
];
