// lib/product-options.ts
// Shared product catalogue option lists and deterministic form helpers.

import type { AdapterType, ProductCategory } from "./types";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Pleated shades",
  "Faceted / geometric shades",
  "Floral / petal shades",
  "Textured diffuser shades",
  "Starfield / perforated shades",
  "Experimental prototypes",
];

export const ADAPTER_TYPES: AdapterType[] = ["B22", "E27", "Clipsal No. 530", "Other / not sure"];

export function slugifyProductHandle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createProductIdSeed(value: string): string {
  const slug = slugifyProductHandle(value);
  return slug ? `prod-${slug}` : `prod-${Date.now()}`;
}
