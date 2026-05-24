// app/api/admin/products/[id]/image/route.ts
// Admin product image upload endpoint. Production uploads use Vercel Blob.

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import {
  appendAdminProductImage,
  getAdminProduct,
  isProductDatabaseUnavailableError,
  type AdminProductRecord,
} from "@/server/db/product-contracts";

export const runtime = "nodejs";

type ImageUploadResponse = {
  ok: boolean;
  url?: string;
  path?: string;
  product?: AdminProductRecord;
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

function databaseErrorResponse(error: unknown): NextResponse<ImageUploadResponse> {
  if (isProductDatabaseUnavailableError(error)) {
    return NextResponse.json(
      { ok: false, error: "Product database objects are not installed yet." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: false, error: "Image uploaded storage step failed to update the product image list." },
    { status: 500 },
  );
}

async function storeImage({
  productId,
  filename,
  file,
}: {
  productId: string;
  filename: string;
  file: File;
}): Promise<{ url: string; limitation?: string }> {
  const blobPath = `products/${productId}/${filename}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(blobPath, file, { access: "public" });
    return { url: blob.url };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Vercel Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN before using production image uploads.",
    );
  }

  const storageDir = process.env.ADMIN_PRODUCT_IMAGE_DIR
    ? path.resolve(process.env.ADMIN_PRODUCT_IMAGE_DIR)
    : path.join(process.cwd(), "public", "products", productId);
  const publicPrefix = process.env.ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX
    ? `${process.env.ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX.replace(/\/$/, "")}/${productId}`
    : `/products/${productId}`;

  await mkdir(storageDir, { recursive: true });
  await writeFile(path.join(storageDir, filename), Buffer.from(await file.arrayBuffer()));

  return {
    url: `${publicPrefix}/${filename}`,
    limitation: "Blob storage is not configured locally, so the image was saved under public/products for development only.",
  };
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
  const safeId = safePathSegment(id);

  if (!safeId) {
    return NextResponse.json({ ok: false, error: "Product id is required for image uploads." }, { status: 422 });
  }

  let product: AdminProductRecord | null;

  try {
    product = await getAdminProduct(id);
  } catch (error) {
    return databaseErrorResponse(error);
  }

  if (!product) {
    return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });
  }

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

  const filename = `product-${safeId}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  let stored: { url: string; limitation?: string };

  try {
    stored = await storeImage({ productId: safeId, filename, file });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Image storage failed.",
      },
      { status: 501 },
    );
  }

  let updatedProduct: AdminProductRecord | null;

  try {
    updatedProduct = await appendAdminProductImage(product.id, stored.url);
  } catch (error) {
    return databaseErrorResponse(error);
  }

  if (!updatedProduct) {
    return NextResponse.json({ ok: false, error: "Product not found after image upload." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    url: stored.url,
    path: stored.url,
    product: updatedProduct,
    limitation: stored.limitation,
  });
}
