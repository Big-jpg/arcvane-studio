// app/api/admin/products/route.ts
// Admin product catalogue list/upsert endpoint. All writes go through stored procedures.

import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { ADAPTER_TYPES, PRODUCT_CATEGORIES, slugifyProductHandle } from "@/lib/product-options";
import type { AdapterType, ProductCategory } from "@/lib/types";
import {
  isProductDatabaseUnavailableError,
  listAdminProducts,
  upsertAdminProduct,
} from "@/server/db/product-contracts";

export const runtime = "nodejs";

type ProductsResponse = {
  ok: boolean;
  products?: Awaited<ReturnType<typeof listAdminProducts>>;
  product?: Awaited<ReturnType<typeof upsertAdminProduct>>;
  error?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalStringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function numberField(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function booleanField(record: Record<string, unknown>, key: string): boolean | null {
  const value = record[key];
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function stringArrayField(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];

  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isProductCategory(value: string | null): value is ProductCategory {
  return value !== null && PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

function validateAdapters(values: string[]): AdapterType[] | null {
  if (values.length === 0) return [];
  return values.every((value) => ADAPTER_TYPES.includes(value as AdapterType))
    ? (values as AdapterType[])
    : null;
}

function databaseErrorResponse(error: unknown): NextResponse<ProductsResponse> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;

  if (isProductDatabaseUnavailableError(error)) {
    return NextResponse.json(
      { ok: false, error: "Product database objects are not installed yet." },
      { status: 503 },
    );
  }

  if (code === "23505") {
    return NextResponse.json(
      { ok: false, error: "Product id or handle already exists. Handles must be unique." },
      { status: 409 },
    );
  }

  if (code === "P0001") {
    return NextResponse.json(
      { ok: false, error: "Product contains invalid required values." },
      { status: 422 },
    );
  }

  return NextResponse.json({ ok: false, error: "Product catalogue operation failed." }, { status: 500 });
}

export async function GET(): Promise<NextResponse<ProductsResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  try {
    const products = await listAdminProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ProductsResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const record = asRecord(body);
  const requestedId = optionalStringField(record, "id");
  const title = stringField(record, "title");
  const handle = slugifyProductHandle(stringField(record, "handle") ?? title ?? "");
  const price = numberField(record, "price");
  const currency = stringField(record, "currency") ?? "AUD";
  const category = stringField(record, "category");
  const description = optionalStringField(record, "description") ?? "";
  const material = optionalStringField(record, "material") ?? "";
  const dimensions = optionalStringField(record, "dimensions") ?? "";
  const colours = stringArrayField(record, "colours");
  const images = stringArrayField(record, "images");
  const adapters = validateAdapters(stringArrayField(record, "adapters"));
  const inStock = booleanField(record, "inStock") ?? true;
  const designFamily = optionalStringField(record, "designFamily");

  if (!title) {
    return NextResponse.json({ ok: false, error: "Product title is required." }, { status: 422 });
  }

  if (!handle) {
    return NextResponse.json({ ok: false, error: "Product handle is required." }, { status: 422 });
  }

  if (price === null || price < 0) {
    return NextResponse.json(
      { ok: false, error: "Product price must be a non-negative number." },
      { status: 422 },
    );
  }

  if (!isProductCategory(category)) {
    return NextResponse.json(
      { ok: false, error: `Product category must be one of: ${PRODUCT_CATEGORIES.join(", ")}.` },
      { status: 422 },
    );
  }

  if (!adapters) {
    return NextResponse.json(
      { ok: false, error: `Adapters must be selected from: ${ADAPTER_TYPES.join(", ")}.` },
      { status: 422 },
    );
  }

  try {
    const product = await upsertAdminProduct({
      id: requestedId ?? `prod-${randomUUID().slice(0, 8)}`,
      handle,
      title,
      price,
      currency,
      category,
      description,
      material,
      dimensions,
      colours,
      images,
      adapters,
      inStock,
      designFamily,
    });

    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product }, { status: requestedId ? 200 : 201 });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
