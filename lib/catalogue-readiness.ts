import { PRODUCT_CATEGORIES } from "@/lib/product-options";
import { buildToneImagePairs } from "@/lib/product-tone-images";
import type { AdapterType, ProductCategory } from "@/lib/types";

export type CatalogueReadinessInput = {
  title: string;
  handle: string;
  price: number;
  category: string;
  colours: string[];
  images: string[];
  adapters: AdapterType[];
};

export type CatalogueReadinessCheck = {
  label: string;
  complete: boolean;
  issue: string;
};

export type CatalogueReadiness = {
  publishReady: boolean;
  checks: CatalogueReadinessCheck[];
  issues: string[];
};

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function getCatalogueReadiness(input: CatalogueReadinessInput): CatalogueReadiness {
  const toneImagePairs = buildToneImagePairs(input.colours, input.images);
  const checks: CatalogueReadinessCheck[] = [
    {
      label: "Title",
      complete: input.title.trim().length > 0,
      issue: "Title is required.",
    },
    {
      label: "Handle",
      complete: input.handle.trim().length > 0,
      issue: "Handle is required.",
    },
    {
      label: "Price",
      complete: Number.isFinite(input.price) && input.price >= 0,
      issue: "Price must be a non-negative number.",
    },
    {
      label: "Category",
      complete: isProductCategory(input.category),
      issue: `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`,
    },
    {
      label: "Finish tones",
      complete: input.colours.length > 0,
      issue: "At least one finish tone is required.",
    },
    {
      label: "Tone image pairs",
      complete: toneImagePairs.length > 0 && toneImagePairs.every((pair) => pair.complete),
      issue: "Each finish tone needs a no-light and illuminated image.",
    },
    {
      label: "System adapters",
      complete: input.adapters.length > 0,
      issue: "At least one compatible adapter is required.",
    },
  ];
  const issues = checks.filter((check) => !check.complete).map((check) => check.issue);

  return {
    publishReady: issues.length === 0,
    checks,
    issues,
  };
}
