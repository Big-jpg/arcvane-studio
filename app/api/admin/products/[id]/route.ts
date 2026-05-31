// app/api/admin/products/[id]/route.ts
// Admin product catalogue single-record endpoint for reads, deletes, and stock toggles.

import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getCatalogueReadiness } from "@/lib/catalogue-readiness";
import {
  deleteAdminProduct,
  getAdminProduct,
  isProductDatabaseUnavailableError,
  toggleAdminProductStock,
} from "@/server/db/product-contracts";

export const runtime = "nodejs";

type ProductItemResponse = {
  ok: boolean;
  product?: Awaited<ReturnType<typeof getAdminProduct>>;
  productId?: string;
  error?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function booleanField(record: Record<string, unknown>, key: string): boolean | null {
  const value = record[key];
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function databaseErrorResponse(error: unknown): NextResponse<ProductItemResponse> {
  if (isProductDatabaseUnavailableError(error)) {
    return NextResponse.json(
      { ok: false, error: "Product database objects are not installed yet." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: false, error: "Product catalogue operation failed." },
    { status: 500 },
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ProductItemResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const { id } = await params;

  try {
    const product = await getAdminProduct(id);

    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ProductItemResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const { id } = await params;

  try {
    const deleted = await deleteAdminProduct(id);

    if (!deleted) {
      return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, productId: id });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ProductItemResponse>> {
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

  const inStock = booleanField(asRecord(body), "inStock");

  if (inStock === null) {
    return NextResponse.json({ ok: false, error: "inStock boolean is required." }, { status: 422 });
  }

  const { id } = await params;

  try {
    if (inStock) {
      const existingProduct = await getAdminProduct(id);

      if (!existingProduct) {
        return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
      }

      const readiness = getCatalogueReadiness({
        title: existingProduct.title,
        handle: existingProduct.handle,
        price: existingProduct.price,
        category: existingProduct.category,
        colours: existingProduct.colours,
        images: existingProduct.images,
        adapters: existingProduct.adapters,
      });

      if (!readiness.publishReady) {
        return NextResponse.json(
          {
            ok: false,
            error: `Product must be publish-ready before it can be marked in stock: ${readiness.issues.join(" ")}`,
          },
          { status: 422 },
        );
      }
    }

    const product = await toggleAdminProductStock(id, inStock);

    if (!product) {
      return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
