// app/api/admin/bom-lines/[id]/route.ts
// Admin product BOM line delete endpoint.

import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { deleteBomLine } from "@/server/db/bom-contracts";

export const runtime = "nodejs";

type DeleteBomLineResponse = {
  ok: boolean;
  lineId?: string;
  error?: string;
};

function databaseErrorResponse(error: unknown): NextResponse<DeleteBomLineResponse> {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : null;

  if (code === "42P01" || code === "42883") {
    return NextResponse.json(
      { ok: false, error: "BOM database objects are not installed yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: false, error: "BOM line delete failed." }, { status: 500 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<DeleteBomLineResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const { id } = await params;

  try {
    const deleted = await deleteBomLine(id);

    if (!deleted) {
      return NextResponse.json({ ok: false, error: "BOM line not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, lineId: id });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
