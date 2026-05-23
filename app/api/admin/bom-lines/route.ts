// app/api/admin/bom-lines/route.ts
// Admin product BOM line list/upsert endpoint. All writes go through stored procedures.

import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { BOM_LINE_TYPES, type BomLineType } from "@/lib/bom-types";
import { getProductBom, upsertBomLine } from "@/server/db/bom-contracts";

export const runtime = "nodejs";

type BomLinesResponse = {
  ok: boolean;
  lines?: Awaited<ReturnType<typeof getProductBom>>;
  line?: Awaited<ReturnType<typeof upsertBomLine>>;
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

function isBomLineType(value: string | null): value is BomLineType {
  return value !== null && BOM_LINE_TYPES.includes(value as BomLineType);
}

function databaseErrorResponse(error: unknown): NextResponse<BomLinesResponse> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;

  if (code === "42P01" || code === "42883") {
    return NextResponse.json(
      { ok: false, error: "BOM database objects are not installed yet." },
      { status: 503 },
    );
  }

  if (code === "P0001" || code === "23503") {
    return NextResponse.json(
      { ok: false, error: "BOM line references an invalid component or contains invalid values." },
      { status: 422 },
    );
  }

  return NextResponse.json({ ok: false, error: "BOM line operation failed." }, { status: 500 });
}

export async function GET(request: NextRequest): Promise<NextResponse<BomLinesResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const productId = request.nextUrl.searchParams.get("product_id")?.trim();

  if (!productId) {
    return NextResponse.json({ ok: false, error: "product_id query parameter is required." }, { status: 400 });
  }

  try {
    const lines = await getProductBom(productId);
    return NextResponse.json({ ok: true, lines });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<BomLinesResponse>> {
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
  const id = optionalStringField(record, "id");
  const productId = stringField(record, "productId");
  const componentId = stringField(record, "componentId");
  const lineType = stringField(record, "lineType");
  const quantity = numberField(record, "quantity");
  const wastagePercent = numberField(record, "wastagePercent") ?? 0;
  const notes = optionalStringField(record, "notes");
  const sortOrderValue = numberField(record, "sortOrder") ?? 0;
  const sortOrder = Math.trunc(sortOrderValue);

  if (!productId) {
    return NextResponse.json({ ok: false, error: "Product id is required." }, { status: 422 });
  }

  if (!componentId) {
    return NextResponse.json({ ok: false, error: "Component id is required." }, { status: 422 });
  }

  if (!isBomLineType(lineType)) {
    return NextResponse.json(
      { ok: false, error: `BOM line type must be one of: ${BOM_LINE_TYPES.join(", ")}.` },
      { status: 422 },
    );
  }

  if (quantity === null || quantity <= 0) {
    return NextResponse.json(
      { ok: false, error: "Quantity must be greater than zero." },
      { status: 422 },
    );
  }

  if (wastagePercent < 0) {
    return NextResponse.json(
      { ok: false, error: "Wastage percent must be non-negative." },
      { status: 422 },
    );
  }

  try {
    const line = await upsertBomLine({
      id,
      productId,
      componentId,
      lineType,
      quantity,
      wastagePercent,
      notes,
      sortOrder,
    });

    if (!line) {
      return NextResponse.json({ ok: false, error: "BOM line not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, line }, { status: id ? 200 : 201 });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
