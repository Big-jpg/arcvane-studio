// lib/bom-types.ts

export const COMPONENT_CATEGORIES = [
  "Printed part",
  "Filament",
  "Electrical",
  "Adapter",
  "Fastener",
  "Bearing",
  "Packaging",
  "Consumable",
  "Labour",
  "Machine time",
  "Finish / paint",
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

export const BOM_LINE_TYPES = ["material", "labour", "machine", "packaging", "overhead"] as const;

export type BomLineType = (typeof BOM_LINE_TYPES)[number];

export interface BomComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  unit: string;
  unitCost: number;
  currency: string;
  supplier?: string | null;
  notes?: string | null;
}

export interface ProductBomLine {
  id: string;
  productId: string;
  componentId: string;
  lineType: BomLineType;
  quantity: number;
  unit: string;
  unitCost: number;
  wastagePercent: number;
  sortOrder: number;
  notes?: string | null;
}

export interface ProductBomSummary {
  productId: string;
  currency: string;
  lineCount: number;
  totalCost: number;
  grossMarginPercent: number;
}
