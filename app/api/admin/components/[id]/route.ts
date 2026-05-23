// app/api/admin/components/[id]/route.ts
// Admin BOM component delete endpoint. Deleting a component cascades to dependent BOM lines.

import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { deleteBomComponent } from "@/server/db/bom-contracts";

export const runtime = "nodejs";

type DeleteComponentResponse = {
  ok: boolean;
  componentId?: string;
  error?: string;
};

function databaseErrorResponse(error: unknown): NextResponse<DeleteComponentResponse> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;

  if (code === "42P01" || code === "42883") {
    return NextResponse.json(
      { ok: false, error: "BOM database objects are not installed yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: false, error: "BOM component delete failed." }, { status: 500 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteComponentResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const { id } = await params;

  try {
    const deleted = await deleteBomComponent(id);

    if (!deleted) {
      return NextResponse.json({ ok: false, error: "BOM component not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, componentId: id });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
