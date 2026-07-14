// lib/product-options.ts
// Shared product catalogue option lists and deterministic form helpers.

import type { AdapterType, ProductCategory, ProductTimeState } from "./types";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Lighting Objects",
  "Table Lamps",
  "Shade Sets",
  "Single Shades",
  "Coastal Forms",
  "Experimental Drops",
  "Accessories",
];

export const COLOUR_OPTIONS = [
  "Shell",
  "Sand",
  "Limestone",
  "Coastal Blue",
  "Clear PLA",
  "Warm Amber",
] as const;

export const ADAPTER_OPTIONS: AdapterType[] = ["E27", "B22", "Other / not sure"];
export const PRODUCT_TIME_STATES: ProductTimeState[] = [
  "dawn",
  "midday",
  "dusk",
  "evening",
  "dawn / midday",
  "dusk / evening",
];

// Backwards-compatible export used by admin-lite and server validation code.
export const ADAPTER_TYPES = ADAPTER_OPTIONS;

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
