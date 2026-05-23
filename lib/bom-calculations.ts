// lib/bom-calculations.ts

import type { ProductBomLine } from "./bom-types";

type BomCostLine = Pick<ProductBomLine, "quantity" | "unitCost" | "wastagePercent">;

export function calculateBomLineCost(
  unitCost: number,
  quantity: number,
  wastagePercent: number,
): number {
  return unitCost * quantity * (1 + wastagePercent / 100);
}

export function calculateBomTotal(lines: BomCostLine[]): number {
  return lines.reduce(
    (total, line) => total + calculateBomLineCost(line.unitCost, line.quantity, line.wastagePercent),
    0,
  );
}

export function calculateGrossMargin(price: number, totalCost: number): number {
  if (price <= 0) {
    return 0;
  }

  return ((price - totalCost) / price) * 100;
}
