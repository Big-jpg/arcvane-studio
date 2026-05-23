// lib/bom-types.ts

export type ComponentCategory =
  | "Printed part"
  | "Filament"
  | "Electrical"
  | "Adapter"
  | "Fastener"
  | "Bearing"
  | "Packaging"
  | "Consumable"
  | "Labour"
  | "Machine time"
  | "Finish / paint";

export type BomLineType = "material" | "labour" | "machine" | "packaging" | "overhead";

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
