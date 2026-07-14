// Normalized product media upload/archive endpoint. Production files use Vercel Blob.

import { createHash, randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { checkAdminAuth } from "@/lib/admin-auth";
import type { ProductLightingState, ProductMediaRole } from "@/lib/types";
import {
  addProductMedia,
  archiveProductMedia,
  getAdminProduct,
  isProductDatabaseUnavailableError,
  type AdminProductRecord,
} from "@/server/db/product-contracts";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_OUTPUT_EDGE = 2400;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

type MediaResponse = {
  ok: boolean;
  url?: string;
  path?: string;
  product?: AdminProductRecord;
  limitation?: string;
  error?: string;
};

function safePathSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function databaseErrorResponse(error: unknown): NextResponse<MediaResponse> {
  if (isProductDatabaseUnavailableError(error)) {
    return NextResponse.json(
      { ok: false, error: "Catalogue V2 database objects are not installed yet." },
      { status: 503 },
    );
  }
  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "Product media operation failed.",
    },
    { status: 500 },
  );
}

async function storeImage(productId: string, filename: string, buffer: Buffer) {
  const blobPath = `products/${productId}/${filename}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(blobPath, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/webp",
    });
    return { url: blob.url, blobPath: blob.pathname, localPath: null, limitation: undefined };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Vercel Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN before production uploads.",
    );
  }

  const storageDir = process.env.ADMIN_PRODUCT_IMAGE_DIR
    ? path.resolve(process.env.ADMIN_PRODUCT_IMAGE_DIR)
    : path.join(process.cwd(), "public", "products", productId);
  const publicPrefix = process.env.ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX
    ? `${process.env.ADMIN_PRODUCT_IMAGE_PUBLIC_PREFIX.replace(/\/$/, "")}/${productId}`
    : `/products/${productId}`;
  const localPath = path.join(storageDir, filename);
  await mkdir(storageDir, { recursive: true });
  await writeFile(localPath, buffer);
  return {
    url: `${publicPrefix}/${filename}`,
    blobPath,
    localPath,
    limitation:
      "Blob storage is not configured locally; this development file is not production durable.",
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<MediaResponse>> {
  const admin = await checkAdminAuth();
  if (!admin.ok)
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });

  const { id } = await params;
  const safeId = safePathSegment(id);
  if (!safeId)
    return NextResponse.json({ ok: false, error: "Product id is required." }, { status: 422 });

  let product: AdminProductRecord | null;
  try {
    product = await getAdminProduct(id);
  } catch (error) {
    return databaseErrorResponse(error);
  }
  if (!product)
    return NextResponse.json({ ok: false, error: "Product not found." }, { status: 404 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File))
    return NextResponse.json(
      { ok: false, error: "Image file field 'file' is required." },
      { status: 422 },
    );
  if (!allowedTypes.has(file.type))
    return NextResponse.json(
      { ok: false, error: "Only PNG, JPEG, and WebP images are supported." },
      { status: 415 },
    );
  if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES)
    return NextResponse.json(
      { ok: false, error: "Image must be between 1 byte and 15 MB." },
      { status: 413 },
    );

  const finish = String(formData?.get("finish") ?? "").trim();
  const lightingStateValue = String(formData?.get("lightingState") ?? "").trim();
  const lightingState: ProductLightingState | null = ["unlit", "illuminated"].includes(
    lightingStateValue,
  )
    ? (lightingStateValue as ProductLightingState)
    : null;
  const variant = product.variants.find((candidate) => candidate.finish === finish) ?? null;
  if (finish && !variant)
    return NextResponse.json(
      { ok: false, error: "Selected finish does not belong to this product." },
      { status: 422 },
    );
  if (variant && !lightingState)
    return NextResponse.json(
      { ok: false, error: "Choose unlit or illuminated for finish photography." },
      { status: 422 },
    );

  const input = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  let width: number | null = null;
  let height: number | null = null;
  try {
    const converted = await sharp(input)
      .rotate()
      .resize({
        width: MAX_OUTPUT_EDGE,
        height: MAX_OUTPUT_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, effort: 4 })
      .toBuffer({ resolveWithObject: true });
    output = converted.data;
    width = converted.info.width;
    height = converted.info.height;
  } catch {
    return NextResponse.json(
      { ok: false, error: "The uploaded file is not a valid supported image." },
      { status: 415 },
    );
  }

  const checksum = createHash("sha256").update(output).digest("hex");
  const filename = `${safeId}-${safePathSegment(finish || "product")}-${lightingState ?? "gallery"}-${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
  let stored: Awaited<ReturnType<typeof storeImage>>;
  try {
    stored = await storeImage(safeId, filename, output);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Image storage failed." },
      { status: 501 },
    );
  }

  const existing = product.media.find(
    (media) => media.variantId === variant?.id && media.lightingState === lightingState,
  );
  const sortOrder = variant
    ? variant.sortOrder * 10 + (lightingState === "illuminated" ? 2 : 1)
    : (product.media.at(-1)?.sortOrder ?? 0) + 10;
  const role: ProductMediaRole = product.media.length === 0 ? "hero" : "gallery";
  const altText =
    String(formData?.get("altText") ?? "").trim() ||
    `${product.title}${finish ? ` in ${finish}` : ""}${lightingState ? `, ${lightingState}` : ""}`;

  try {
    await addProductMedia({
      productId: product.id,
      variantId: variant?.id ?? null,
      blobUrl: stored.url,
      blobPath: stored.blobPath,
      altText,
      role,
      lightingState,
      sortOrder,
      isPrimary: product.media.length === 0,
      width,
      height,
      byteSize: output.byteLength,
      mimeType: "image/webp",
      checksumSha256: checksum,
    });
    if (existing) await archiveProductMedia(existing.id);
    const updatedProduct = await getAdminProduct(product.id);
    return NextResponse.json({
      ok: true,
      url: stored.url,
      path: stored.blobPath,
      product: updatedProduct ?? undefined,
      limitation: stored.limitation,
    });
  } catch (error) {
    if (stored.localPath) await unlink(stored.localPath).catch(() => undefined);
    else await del(stored.url).catch(() => undefined);
    return databaseErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<MediaResponse>> {
  const admin = await checkAdminAuth();
  if (!admin.ok)
    return NextResponse.json({ ok: false, error: admin.reason }, { status: admin.status });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === "string" ? body.url : "";
  const product = await getAdminProduct(id).catch(() => null);
  const media = product?.media.find((candidate) => candidate.blobUrl === url);
  if (!product || !media)
    return NextResponse.json({ ok: false, error: "Product media not found." }, { status: 404 });
  try {
    await archiveProductMedia(media.id);
    return NextResponse.json({ ok: true, product: (await getAdminProduct(id)) ?? undefined });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
