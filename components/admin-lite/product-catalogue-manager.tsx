// components/admin-lite/product-catalogue-manager.tsx
// Client-side product catalogue CRUD controls for Admin-Lite. API routes enforce admin auth.

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ADAPTER_TYPES, PRODUCT_CATEGORIES, createProductIdSeed, slugifyProductHandle } from "@/lib/product-options";
import type { AdapterType, Product, ProductCategory } from "@/lib/types";

type CatalogueSource = "shopify" | "database" | "mock";

type EditableProduct = Product & {
  createdAt?: string;
  updatedAt?: string;
};

type ProductFormState = {
  id: string;
  handle: string;
  title: string;
  price: string;
  currency: string;
  category: ProductCategory;
  description: string;
  material: string;
  dimensions: string;
  colours: string;
  images: string;
  adapters: AdapterType[];
  inStock: boolean;
  designFamily: string;
};

type ProductApiResponse = {
  ok: boolean;
  product?: EditableProduct;
  error?: string;
};

type ImageUploadApiResponse = ProductApiResponse & {
  url?: string;
  path?: string;
  limitation?: string;
};

const emptyProductForm: ProductFormState = {
  id: "",
  handle: "",
  title: "",
  price: "0",
  currency: "AUD",
  category: "Pleated shades",
  description: "",
  material: "",
  dimensions: "",
  colours: "",
  images: "",
  adapters: [],
  inStock: true,
  designFamily: "",
};

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function commaJoin(values: string[]): string {
  return values.join(", ");
}

function commaSplit(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function productToForm(product: EditableProduct): ProductFormState {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price: String(product.price),
    currency: product.currency,
    category: product.category,
    description: product.description,
    material: product.material,
    dimensions: product.dimensions,
    colours: commaJoin(product.colours),
    images: commaJoin(product.images),
    adapters: product.adapters,
    inStock: product.inStock,
    designFamily: product.designFamily ?? "",
  };
}

async function parseJsonResponse<T extends { ok: boolean; error?: string }>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error ?? "Product catalogue operation failed.");
  }

  return payload;
}

function primaryImage(product: EditableProduct): string | null {
  return product.images[0] ?? null;
}

function sourceLabel(source: CatalogueSource): string {
  if (source === "database") return "database catalogue";
  if (source === "shopify") return "Shopify catalogue";
  return "mock fallback";
}

function setPrimary(imagesCsv: string, image: string): string {
  const images = commaSplit(imagesCsv).filter((candidate) => candidate !== image);
  return commaJoin([image, ...images]);
}

function removeImage(imagesCsv: string, image: string): string {
  return commaJoin(commaSplit(imagesCsv).filter((candidate) => candidate !== image));
}

export function ProductCatalogueManager({
  products,
  databaseAvailable,
  catalogueSource,
}: {
  products: EditableProduct[];
  databaseAvailable: boolean;
  catalogueSource: CatalogueSource;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [handleManuallyEdited, setHandleManuallyEdited] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const images = useMemo(() => commaSplit(form.images), [form.images]);

  function resetForm() {
    setForm(emptyProductForm);
    setHandleManuallyEdited(false);
  }

  function setAdapter(adapter: AdapterType, checked: boolean) {
    setForm((current) => {
      const adapters = checked
        ? Array.from(new Set([...current.adapters, adapter]))
        : current.adapters.filter((candidate) => candidate !== adapter);
      return { ...current, adapters };
    });
  }

  function saveProduct() {
    setMessage(null);

    if (!databaseAvailable) {
      setMessage("Install the product migration and procedures before editing products.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = await parseJsonResponse<ProductApiResponse>(
          await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: form.id || null,
              handle: form.handle,
              title: form.title,
              price: Number(form.price),
              currency: form.currency,
              category: form.category,
              description: form.description,
              material: form.material,
              dimensions: form.dimensions,
              colours: commaSplit(form.colours),
              images: commaSplit(form.images),
              adapters: form.adapters,
              inStock: form.inStock,
              designFamily: form.designFamily || null,
            }),
          }),
        );

        setMessage(form.id ? "Product updated." : "Product created.");

        if (payload.product) {
          setForm(productToForm(payload.product));
          setHandleManuallyEdited(true);
        }

        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Product save failed.");
      }
    });
  }

  function deleteProduct(product: EditableProduct) {
    setMessage(null);

    if (!databaseAvailable) {
      setMessage("Install the product migration and procedures before deleting products.");
      return;
    }

    if (!confirm(`Delete ${product.title}? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await parseJsonResponse<ProductApiResponse>(
          await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" }),
        );
        setMessage("Product deleted.");
        if (form.id === product.id) resetForm();
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Product delete failed.");
      }
    });
  }

  function toggleStock(product: EditableProduct) {
    setMessage(null);

    if (!databaseAvailable) {
      setMessage("Install the product migration and procedures before editing stock state.");
      return;
    }

    startTransition(async () => {
      try {
        await parseJsonResponse<ProductApiResponse>(
          await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inStock: !product.inStock }),
          }),
        );
        setMessage(product.inStock ? "Product marked out of stock." : "Product marked in stock.");
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Stock update failed.");
      }
    });
  }

  function uploadImage(file: File | null) {
    setMessage(null);

    if (!file) return;

    if (!databaseAvailable) {
      setMessage("Install the product migration and procedures before uploading product images.");
      return;
    }

    if (!form.id) {
      setMessage("Save the product before uploading images so the image can be tied to a stable id.");
      return;
    }

    const body = new FormData();
    body.set("file", file);

    startTransition(async () => {
      try {
        const payload = await parseJsonResponse<ImageUploadApiResponse>(
          await fetch(`/api/admin/products/${encodeURIComponent(form.id)}/image`, {
            method: "POST",
            body,
          }),
        );

        const uploadedUrl = payload.url ?? payload.path;

        if (!uploadedUrl) {
          throw new Error("Image upload succeeded but did not return an image URL.");
        }

        if (payload.product) {
          setForm(productToForm(payload.product));
          setHandleManuallyEdited(true);
        } else {
          setForm((current) => ({
            ...current,
            images: commaJoin([...commaSplit(current.images), uploadedUrl]),
          }));
        }

        setMessage(
          payload.limitation
            ? `Image uploaded and saved. ${payload.limitation}`
            : "Image uploaded and saved to the product image list.",
        );
        router.refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Image upload failed.");
      }
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">Product catalogue</h3>
            <p className="mt-1 text-sm leading-6 text-charcoal/60">
              {databaseAvailable
                ? "Add, edit, remove, and stock-toggle database-backed catalogue products."
                : "Product database tables are not available; seeded mock products are shown read-only."}
            </p>
          </div>
          <span className="rounded-full border border-charcoal/10 bg-ivory px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/60">
            Source: {sourceLabel(catalogueSource)}
          </span>
        </div>

        {message ? (
          <p className="mt-4 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-charcoal">
            {message}
          </p>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-xl border border-charcoal/10">
          <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-charcoal/10 bg-ivory/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50 md:grid-cols-[88px_minmax(0,1.2fr)_140px_150px_170px]">
            <span>Image</span>
            <span>Product</span>
            <span className="hidden md:block">Price</span>
            <span className="hidden md:block">Stock</span>
            <span className="hidden text-right md:block">Actions</span>
          </div>
          {products.length === 0 ? (
            <p className="px-4 py-8 text-sm text-charcoal/60">
              No database products exist yet. Add the first product to switch the public mock fallback to the database catalogue.
            </p>
          ) : (
            <div className="divide-y divide-charcoal/10">
              {products.map((product) => {
                const image = primaryImage(product);
                return (
                  <article
                    key={product.id}
                    className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 px-4 py-4 md:grid-cols-[88px_minmax(0,1.2fr)_140px_150px_170px] md:items-center"
                  >
                    <div
                      className="aspect-[3/4] rounded-lg border border-charcoal/10 bg-ivory bg-cover bg-center"
                      style={image ? { backgroundImage: `url(${image})` } : undefined}
                      aria-label={image ? `${product.title} primary image` : "No product image"}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setForm(productToForm(product));
                          setHandleManuallyEdited(true);
                          setMessage(null);
                        }}
                        className="text-left font-serif text-lg font-semibold text-charcoal transition hover:text-amber"
                      >
                        {product.title}
                      </button>
                      <p className="mt-1 text-xs text-charcoal/50">/{product.handle} · {product.id}</p>
                      <p className="mt-2 text-sm text-charcoal/60">{product.category}</p>
                      <p className="mt-1 text-xs text-charcoal/50 md:hidden">
                        {formatCurrency(product.price, product.currency)} · {product.inStock ? "In stock" : "Out of stock"}
                      </p>
                    </div>
                    <p className="hidden text-sm font-semibold text-charcoal md:block">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                    <div className="hidden md:block">
                      <button
                        type="button"
                        onClick={() => toggleStock(product)}
                        disabled={!databaseAvailable || isPending}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
                          product.inStock
                            ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:border-emerald-500"
                            : "border-red-500/30 bg-red-50 text-red-700 hover:border-red-500"
                        }`}
                      >
                        {product.inStock ? "In stock" : "Out of stock"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setForm(productToForm(product));
                          setHandleManuallyEdited(true);
                          setMessage(null);
                        }}
                        className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-amber"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product)}
                        disabled={!databaseAvailable || isPending}
                        className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:border-red-500 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">
              {form.id ? "Edit product" : "Add product"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-charcoal/60">
              Handles are URL slugs and must be unique. Images are optional; when present, the first URL is used as primary.
            </p>
          </div>
          {form.id ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber"
            >
              New
            </button>
          ) : null}
        </div>

        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            saveProduct();
          }}
        >
          <label className="block text-sm font-semibold text-charcoal">
            Title
            <input
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({
                  ...current,
                  title,
                  id: current.id || createProductIdSeed(title),
                  handle: handleManuallyEdited ? current.handle : slugifyProductHandle(title),
                }));
              }}
              disabled={!databaseAvailable || isPending}
              className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-charcoal">
              Product ID
              <input
                value={form.id}
                onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-charcoal">
              Handle
              <input
                value={form.handle}
                onChange={(event) => {
                  setHandleManuallyEdited(true);
                  setForm((current) => ({ ...current, handle: slugifyProductHandle(event.target.value) }));
                }}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
              <span className="mt-1 block text-xs font-normal text-charcoal/50">Must be unique across catalogue products.</span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-charcoal">
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-charcoal">
              Currency
              <input
                value={form.currency}
                onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-charcoal">
            Category
            <select
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value as ProductCategory }))
              }
              disabled={!databaseAvailable || isPending}
              className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-charcoal">
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              disabled={!databaseAvailable || isPending}
              className="mt-1 min-h-24 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-charcoal">
              Material
              <input
                value={form.material}
                onChange={(event) => setForm((current) => ({ ...current, material: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-charcoal">
              Dimensions
              <input
                value={form.dimensions}
                onChange={(event) => setForm((current) => ({ ...current, dimensions: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                required
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-charcoal">
              Colours
              <input
                value={form.colours}
                onChange={(event) => setForm((current) => ({ ...current, colours: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                placeholder="Warm white, Amber"
              />
            </label>
            <label className="block text-sm font-semibold text-charcoal">
              Design family
              <input
                value={form.designFamily}
                onChange={(event) => setForm((current) => ({ ...current, designFamily: event.target.value }))}
                disabled={!databaseAvailable || isPending}
                className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
              />
            </label>
          </div>

          <fieldset className="rounded-xl border border-charcoal/10 p-3">
            <legend className="px-1 text-sm font-semibold text-charcoal">Adapters</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ADAPTER_TYPES.map((adapter) => (
                <label key={adapter} className="flex items-center gap-2 text-sm text-charcoal/70">
                  <input
                    type="checkbox"
                    checked={form.adapters.includes(adapter)}
                    onChange={(event) => setAdapter(adapter, event.target.checked)}
                    disabled={!databaseAvailable || isPending}
                    className="size-4 rounded border-charcoal/20 text-amber focus:ring-amber disabled:opacity-60"
                  />
                  {adapter}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center justify-between rounded-xl border border-charcoal/10 px-3 py-3 text-sm font-semibold text-charcoal">
            In stock
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(event) => setForm((current) => ({ ...current, inStock: event.target.checked }))}
              disabled={!databaseAvailable || isPending}
              className="size-5 rounded border-charcoal/20 text-amber focus:ring-amber disabled:opacity-60"
            />
          </label>

          <label className="block text-sm font-semibold text-charcoal">
            Image paths / URLs <span className="font-normal text-charcoal/40">(optional)</span>
            <textarea
              value={form.images}
              onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
              disabled={!databaseAvailable || isPending}
              className="mt-1 min-h-20 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
              placeholder="/products/product-01.png, https://example.com/image.webp, https://...public.blob.vercel-storage.com/..."
            />
          </label>

          <div className="rounded-xl border border-charcoal/10 bg-ivory/40 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-charcoal">Image management</p>
              <label className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-amber">
                Upload image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={!databaseAvailable || isPending || !form.id}
                  onChange={(event) => uploadImage(event.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            {!form.id ? (
              <p className="mt-2 text-xs text-charcoal/50">Save the product before uploading image files. Products can be saved with no images.</p>
            ) : null}
            {images.length === 0 ? (
              <p className="mt-3 text-sm text-charcoal/50">No images configured. You can save the product now and add uploaded or pasted image URLs later.</p>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div key={image} className="rounded-lg border border-charcoal/10 bg-white p-2">
                    <div
                      className="aspect-[3/4] rounded-md bg-ivory bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                      aria-label={`Configured product image ${index + 1}`}
                    />
                    <p className="mt-2 truncate text-xs text-charcoal/60" title={image}>
                      {image}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, images: setPrimary(current.images, image) }))}
                        disabled={index === 0 || !databaseAvailable || isPending}
                        className="rounded-full border border-charcoal/15 px-2 py-1 text-xs font-semibold text-charcoal transition hover:border-amber disabled:opacity-50"
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, images: removeImage(current.images, image) }))}
                        disabled={!databaseAvailable || isPending}
                        className="rounded-full border border-red-500/30 px-2 py-1 text-xs font-semibold text-red-700 transition hover:border-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!databaseAvailable || isPending}
            className="mt-2 rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-warm-white transition hover:bg-warm-black disabled:opacity-60"
          >
            {isPending ? "Saving..." : form.id ? "Save product" : "Add product"}
          </button>
        </form>
      </aside>
    </section>
  );
}
