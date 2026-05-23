// app/api/admin/components/route.ts
// Admin BOM component registry list/upsert endpoint. All writes go through stored procedures.

import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { COMPONENT_CATEGORIES, type ComponentCategory } from "@/lib/bom-types";
import { listBomComponents, upsertBomComponent } from "@/server/db/bom-contracts";

export const runtime = "nodejs";

type ComponentResponse = {
  ok: boolean;
  components?: Awaited<ReturnType<typeof listBomComponents>>;
  component?: Awaited<ReturnType<typeof upsertBomComponent>>;
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

function isComponentCategory(value: string | null): value is ComponentCategory {
  return value !== null && COMPONENT_CATEGORIES.includes(value as ComponentCategory);
}

function databaseErrorResponse(error: unknown): NextResponse<ComponentResponse> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;

  if (code === "42P01" || code === "42883") {
    return NextResponse.json(
      { ok: false, error: "BOM database objects are not installed yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: false, error: "BOM component operation failed." }, { status: 500 });
}

export async function GET(): Promise<NextResponse<ComponentResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  try {
    const components = await listBomComponents();
    return NextResponse.json({ ok: true, components });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ComponentResponse>> {
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
  const name = stringField(record, "name");
  const category = stringField(record, "category");
  const unit = stringField(record, "unit") ?? "each";
  const unitCost = numberField(record, "unitCost");
  const supplier = optionalStringField(record, "supplier");
  const notes = optionalStringField(record, "notes");

  if (!name) {
    return NextResponse.json({ ok: false, error: "Component name is required." }, { status: 422 });
  }

  if (!isComponentCategory(category)) {
    return NextResponse.json(
      { ok: false, error: `Component category must be one of: ${COMPONENT_CATEGORIES.join(", ")}.` },
      { status: 422 },
    );
  }

  if (unitCost === null || unitCost < 0) {
    return NextResponse.json(
      { ok: false, error: "Component unit cost must be a non-negative number." },
      { status: 422 },
    );
  }

  try {
    const component = await upsertBomComponent({
      id,
      name,
      category,
      unit,
      unitCost,
      supplier,
      notes,
    });

    if (!component) {
      return NextResponse.json({ ok: false, error: "BOM component not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, component }, { status: id ? 200 : 201 });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
