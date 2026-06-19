// lib/accessories.ts
//
// Accessory product definitions for the "Complete your setup" section.
// These are sold at or near cost — enabling the customer, not generating margin.

export interface AccessoryProduct {
  id: string;
  handle: string;
  title: string;
  /** Short descriptor for the card */
  subtitle: string;
  price: number;
  currency: string;
  /** Colour temperature label */
  colourTemp: string;
  /** Kelvin value for sorting/display */
  kelvin: number;
  /** Key differentiators displayed as compact specs */
  specs: string[];
  /** Why this matters for ArcVane shades */
  benefit: string;
  /** Placeholder image until real photography */
  image: string;
  /** E27 or B22 */
  fitting: "E27" | "B22";
  /** External reference (not shown to customer) */
  sourceRef?: string;
  inStock: boolean;
}

/**
 * DiCUNO E27 10W LED Corn Bulb — three colour temperatures.
 * Sold at cost. 84 LED beads, 360° beam, flicker-free, CRI 85+.
 */
export const ACCESSORY_BULBS: AccessoryProduct[] = [
  {
    id: "acc-bulb-2700k",
    handle: "led-corn-bulb-e27-2700k",
    title: "LED Corn Bulb — Warm White",
    subtitle: "2700K · Soft evening glow",
    price: 9.0,
    currency: "AUD",
    colourTemp: "Warm White",
    kelvin: 2700,
    specs: ["10W", "1400lm", "84 LEDs", "360° beam", "CRI 85+", "E27"],
    benefit:
      "Soft amber tone that complements evening and dusk time-states. Uniform diffusion through translucent shade surfaces.",
    image: "/accessories/bulb-2700k.svg",
    fitting: "E27",
    sourceRef: "DiCUNO E27 10W 2700K (Amazon AU B0B464V54H)",
    inStock: true,
  },
  {
    id: "acc-bulb-4000k",
    handle: "led-corn-bulb-e27-4000k",
    title: "LED Corn Bulb — Natural White",
    subtitle: "4000K · Balanced daylight clarity",
    price: 9.0,
    currency: "AUD",
    colourTemp: "Natural White",
    kelvin: 4000,
    specs: ["10W", "1400lm", "84 LEDs", "360° beam", "CRI 85+", "E27"],
    benefit:
      "Neutral tone that reveals true material colour. Ideal for midday time-states and showcasing finish detail.",
    image: "/accessories/bulb-4000k.svg",
    fitting: "E27",
    sourceRef: "DiCUNO E27 10W 4000K (Amazon AU B0B464V54H)",
    inStock: true,
  },
  {
    id: "acc-bulb-6000k",
    handle: "led-corn-bulb-e27-6000k",
    title: "LED Corn Bulb — Daylight White",
    subtitle: "6000K · Stark bright clarity",
    price: 9.0,
    currency: "AUD",
    colourTemp: "Daylight White",
    kelvin: 6000,
    specs: ["10W", "1400lm", "84 LEDs", "360° beam", "CRI 85+", "E27"],
    benefit:
      "Crisp white that maximises contrast through patterned shades. Best for task lighting and dawn time-states.",
    image: "/accessories/bulb-6000k.svg",
    fitting: "E27",
    sourceRef: "DiCUNO E27 10W 6000K (Amazon AU B0B464V54H)",
    inStock: true,
  },
];

/**
 * Why corn bulbs, not standard LEDs — key differentiators for the UI.
 */
export const CORN_BULB_DIFFERENTIATORS = [
  {
    label: "84 LED beads",
    detail: "Uniform light source — no single hot-spot casting harsh shadows through patterned shades",
  },
  {
    label: "360° beam",
    detail: "The entire shade surface illuminates evenly, not just the top or bottom",
  },
  {
    label: "10W / 1400lm",
    detail: "130W incandescent equivalent from a fraction of the energy — negligible heat output",
  },
  {
    label: "Flicker-free",
    detail: "CRI 85+ with no stroboscope effect — safe for photography and video of the lit shade",
  },
  {
    label: "Low heat",
    detail: "Safe operating temperature for PLA and PETG shade proximity — no material deformation risk",
  },
];
