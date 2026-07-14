import type { AccessoryProduct } from "@/lib/accessories";
import type { AdapterType, Product } from "@/lib/types";
import { queryRows } from "./client";

type RawAccessory = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  price: string | number;
  currency: string;
  colour_temp: string;
  kelvin: number;
  specs: string[];
  benefit: string;
  image: string;
  fitting: "E27" | "B22";
  source_ref: string | null;
  in_stock: boolean;
};

export async function listAccessories(): Promise<AccessoryProduct[]> {
  const rows = await queryRows<{ accessory: RawAccessory }>(
    `SELECT list_accessories_v2() AS accessory`,
  );
  return rows.map(({ accessory }) => ({
    id: accessory.id,
    handle: accessory.handle,
    title: accessory.title,
    subtitle: accessory.subtitle,
    price: Number(accessory.price),
    currency: accessory.currency,
    colourTemp: accessory.colour_temp,
    kelvin: accessory.kelvin,
    specs: accessory.specs,
    benefit: accessory.benefit,
    image: accessory.image,
    fitting: accessory.fitting,
    sourceRef: accessory.source_ref ?? undefined,
    inStock: accessory.in_stock,
  }));
}

export function accessoryAsProduct(accessory: AccessoryProduct): Product {
  return {
    id: accessory.id,
    handle: accessory.handle,
    title: accessory.title,
    price: accessory.price,
    currency: accessory.currency,
    category: "Accessories",
    description: accessory.benefit,
    material: "LED Corn Bulb",
    dimensions: accessory.specs.join(" · "),
    colours: [accessory.colourTemp],
    images: [accessory.image],
    adapters: [accessory.fitting as AdapterType],
    inStock: accessory.inStock,
    metadata: { filament_colour: `${accessory.kelvin}K` },
  };
}
