// app/api/admin/products/[id]/image/route.ts
// Admin product image upload endpoint.
// Default storage writes to public/products for local/admin-managed deployments.
// Production note: Vercel's public directory is read-only at runtime; set
// ADMIN_PRODUCT_IMAGE_DIR and ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX to point at a
// writable mounted directory or object-storage-backed public URL prefix.

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";

export const runtime = "nodejs";

type ImageUploadResponse = {
  ok: boolean;
  path?: string;
  limitation?: string;
  error?: string;
};

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

function safePathSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ImageUploadResponse>> {
  const admin = await checkAdminAuth();

  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  }

  const { id } = await params;
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ ok: false, error: "Invalid multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Image file field 'file' is required." }, { status: 422 });
  }

  const extension = allowedTypes.get(file.type);

  if (!extension) {
    return NextResponse.json(
      { ok: false, error: "Only PNG, JPEG, and WebP product images are supported." },
      { status: 415 },
    );
  }

  const safeId = safePathSegment(id) || "product";
  const filename = `product-${safeId}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const storageDir = process.env.ADMIN_PRODUCT_IMAGE_DIR
    ? path.resolve(process.env.ADMIN_PRODUCT_IMAGE_DIR)
    : path.join(process.cwd(), "public", "products");
  const publicPrefix = process.env.ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX ?? "/products";
  const publicPath = `${publicPrefix.replace(/\/$/, "")}/${filename}`;

  try {
    await mkdir(storageDir, { recursive: true });
    await writeFile(path.join(storageDir, filename), Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Image storage is not writable in this runtime.",
        limitation:
          "Filesystem uploads work locally or with a writable ADMIN_PRODUCT_IMAGE_DIR. On Vercel, use object storage and store the resulting URL in the product images array.",
      },
      { status: 501 },
    );
  }

  return NextResponse.json({
    ok: true,
    path: publicPath,
    limitation:
      "Default filesystem uploads target public/products. On Vercel, configure writable/object storage and persist the returned URL in product images.",
  });
}
