// components/admin-lite/product-catalogue-manager.tsx
// Client-side product catalogue CRUD controls for Admin-Lite. API routes enforce admin auth.

"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  ADAPTER_TYPES,
  PRODUCT_CATEGORIES,
  createProductIdSeed,
  slugifyProductHandle,
} from "@/lib/product-options";
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

type WizardStep = {
  id: "identity" | "commerce" | "object" | "system" | "imagery" | "review";
  label: string;
  hint: string;
};

type CopyBlock = {
  title: string;
  body: string;
};

const wizardSteps: WizardStep[] = [
  {
    id: "identity",
    label: "Identity",
    hint: "Name the object and place it in the catalogue.",
  },
  {
    id: "commerce",
    label: "Commerce",
    hint: "Set price, currency, and stock state.",
  },
  {
    id: "object",
    label: "Object",
    hint: "Capture material, dimensions, colour, and product description.",
  },
  {
    id: "system",
    label: "System",
    hint: "Record how the piece fits the lighting language.",
  },
  {
    id: "imagery",
    label: "Imagery",
    hint: "Add or arrange product images.",
  },
  {
    id: "review",
    label: "Review",
    hint: "Check the listing and capture share copy.",
  },
];

const emptyProductForm: ProductFormState = {
  id: "",
  handle: "",
  title: "",
  price: "0",
  currency: "AUD",
  category: PRODUCT_CATEGORIES[0],
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

async function parseJsonResponse<T extends { ok: boolean; error?: string }>(
  response: Response,
): Promise<T> {
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

function categoryHref(category: ProductCategory): string {
  return `/products?category=${encodeURIComponent(category)}`;
}

function priceValue(form: ProductFormState): number {
  const parsed = Number(form.price);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shortDescription(form: ProductFormState): string {
  return (
    form.description.trim() ||
    `${form.title || "This ArcVane piece"} is part of the current coastal lighting collection.`
  );
}

function generateCopyBlocks(form: ProductFormState): CopyBlock[] {
  const title = form.title.trim() || "Untitled ArcVane piece";
  const family = form.designFamily.trim() || form.category;
  const material = form.material.trim() || "translucent PLA";
  const colours = commaSplit(form.colours);
  const colourPhrase = colours.length > 0 ? colours.join(", ") : "the current coastal palette";
  const description = shortDescription(form);
  const adapters = form.adapters.length > 0 ? form.adapters.join(", ") : "the shared E27 system";
  const productUrl = form.handle ? `/products/${form.handle}` : "/products";

  return [
    {
      title: "Short caption",
      body: `${title}. ${description} ${material} in ${colourPhrase}, built for ${adapters}.`,
    },
    {
      title: "Drop note",
      body: `Now in the ArcVane catalogue: ${title}, a ${family} piece shaped around coastal light, quiet texture, and small-run production. ${productUrl}`,
    },
    {
      title: "Material study",
      body: `${title} studies how ${material} holds warmth, edge glow, and surface rhythm. Colours: ${colourPhrase}.`,
    },
    {
      title: "Alt text suggestion",
      body: `${title}, ${form.category.toLowerCase()} by ArcVane Studio, shown as a small-run coastal lighting object in ${colourPhrase}.`,
    },
  ];
}

function completionItems(form: ProductFormState): Array<{ label: string; complete: boolean }> {
  return [
    { label: "Title", complete: form.title.trim().length > 0 },
    { label: "Handle", complete: form.handle.trim().length > 0 },
    { label: "Price", complete: Number.isFinite(Number(form.price)) && Number(form.price) >= 0 },
    { label: "Description", complete: form.description.trim().length > 0 },
    { label: "Material", complete: form.material.trim().length > 0 },
    { label: "Dimensions", complete: form.dimensions.trim().length > 0 },
    { label: "Images", complete: commaSplit(form.images).length > 0 },
  ];
}

function stepIsComplete(step: WizardStep["id"], form: ProductFormState): boolean {
  if (step === "identity") {
    return (
      form.title.trim().length > 0 && form.id.trim().length > 0 && form.handle.trim().length > 0
    );
  }

  if (step === "commerce") {
    return (
      Number.isFinite(Number(form.price)) &&
      Number(form.price) >= 0 &&
      form.currency.trim().length > 0
    );
  }

  if (step === "object") {
    return (
      form.description.trim().length > 0 &&
      form.material.trim().length > 0 &&
      form.dimensions.trim().length > 0
    );
  }

  return true;
}

function productPreviewImage(images: string[]): string | null {
  return images[0] ?? null;
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedCopyTitle, setCopiedCopyTitle] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentStep = wizardSteps[currentStepIndex];
  const images = useMemo(() => commaSplit(form.images), [form.images]);
  const copyBlocks = useMemo(() => generateCopyBlocks(form), [form]);
  const completion = useMemo(() => completionItems(form), [form]);
  const completedCount = completion.filter((item) => item.complete).length;
  const previewImage = productPreviewImage(images);
  const canMoveNext = stepIsComplete(currentStep.id, form);
  const canSaveProduct =
    stepIsComplete("identity", form) &&
    stepIsComplete("commerce", form) &&
    stepIsComplete("object", form);

  function resetForm() {
    setForm(emptyProductForm);
    setHandleManuallyEdited(false);
    setCurrentStepIndex(0);
    setMessage(null);
    setCopiedCopyTitle(null);
  }

  function editProduct(product: EditableProduct) {
    setForm(productToForm(product));
    setHandleManuallyEdited(true);
    setCurrentStepIndex(0);
    setMessage(null);
    setCopiedCopyTitle(null);
  }

  function setAdapter(adapter: AdapterType, checked: boolean) {
    setForm((current) => {
      const adapters = checked
        ? Array.from(new Set([...current.adapters, adapter]))
        : current.adapters.filter((candidate) => candidate !== adapter);
      return { ...current, adapters };
    });
  }

  function moveStep(direction: 1 | -1) {
    setCurrentStepIndex((index) => {
      const next = index + direction;
      return Math.max(0, Math.min(wizardSteps.length - 1, next));
    });
  }

  async function copyText(title: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
      setCopiedCopyTitle(title);
      setMessage(`Copied ${title.toLowerCase()}.`);
    } catch {
      setMessage("Clipboard copy was blocked by the browser. Select and copy the text manually.");
    }
  }

  function downloadCopyBlocks() {
    const payload = {
      productId: form.id || null,
      handle: form.handle || null,
      title: form.title || null,
      generatedAt: new Date().toISOString(),
      copy: copyBlocks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.handle || "arcvane-product-copy"}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
          setCurrentStepIndex(wizardSteps.length - 1);
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
          await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
            method: "DELETE",
          }),
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
      setMessage(
        "Save the product before uploading images so the image can be tied to a stable id.",
      );
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
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)]">
      <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">Product catalogue</h3>
            <p className="mt-1 text-sm leading-6 text-charcoal/60">
              {databaseAvailable
                ? "Edit database-backed catalogue products, then use the guide to shape the listing."
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
              No database products exist yet. Add the first product to switch the public mock
              fallback to the database catalogue.
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
                        onClick={() => editProduct(product)}
                        className="text-left font-serif text-lg font-semibold text-charcoal transition hover:text-amber"
                      >
                        {product.title}
                      </button>
                      <p className="mt-1 text-xs text-charcoal/50">
                        /{product.handle} · {product.id}
                      </p>
                      <p className="mt-2 text-sm text-charcoal/60">{product.category}</p>
                      <p className="mt-1 text-xs text-charcoal/50 md:hidden">
                        {formatCurrency(product.price, product.currency)} ·{" "}
                        {product.inStock ? "In stock" : "Out of stock"}
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
                        onClick={() => editProduct(product)}
                        className="rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal transition hover:border-amber"
                      >
                        Guide
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

      <aside className="space-y-5">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-charcoal">
                {form.id ? "Catalogue guide" : "New product guide"}
              </h3>
              <p className="mt-1 text-sm leading-6 text-charcoal/60">
                Build the listing in a short sequence, then review the public-facing story before
                saving.
              </p>
            </div>
            {form.id || form.title ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber"
              >
                New
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {wizardSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(index)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                  index === currentStepIndex
                    ? "border-amber bg-amber/10 text-charcoal"
                    : "border-charcoal/10 bg-ivory/50 text-charcoal/55 hover:border-charcoal/25"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.2em]">
                  Step {index + 1}
                </span>
                {step.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-charcoal/10 bg-ivory/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">
              {currentStep.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-charcoal/60">{currentStep.hint}</p>
          </div>

          <form
            className="mt-5"
            onSubmit={(event) => {
              event.preventDefault();
              saveProduct();
            }}
          >
            {currentStep.id === "identity" ? (
              <div className="grid gap-3">
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
                      onChange={(event) =>
                        setForm((current) => ({ ...current, id: event.target.value }))
                      }
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
                        setForm((current) => ({
                          ...current,
                          handle: slugifyProductHandle(event.target.value),
                        }));
                      }}
                      disabled={!databaseAvailable || isPending}
                      className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                      required
                    />
                    <span className="mt-1 block text-xs font-normal text-charcoal/50">
                      Public URL: /products/{form.handle || "new-product"}
                    </span>
                  </label>
                </div>

                <label className="block text-sm font-semibold text-charcoal">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value as ProductCategory,
                      }))
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
                  <span className="mt-1 block text-xs font-normal text-charcoal/50">
                    Collection filter: {categoryHref(form.category)}
                  </span>
                </label>

                <label className="block text-sm font-semibold text-charcoal">
                  Design family
                  <input
                    value={form.designFamily}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, designFamily: event.target.value }))
                    }
                    disabled={!databaseAvailable || isPending}
                    className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                    placeholder="Shell Fan, Dune Rib, Clear PLA Coastal Set"
                  />
                </label>
              </div>
            ) : null}

            {currentStep.id === "commerce" ? (
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-charcoal">
                    Price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, price: event.target.value }))
                      }
                      disabled={!databaseAvailable || isPending}
                      className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold text-charcoal">
                    Currency
                    <input
                      value={form.currency}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          currency: event.target.value.toUpperCase(),
                        }))
                      }
                      disabled={!databaseAvailable || isPending}
                      className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                      required
                    />
                  </label>
                </div>

                <label className="flex items-center justify-between rounded-xl border border-charcoal/10 px-3 py-3 text-sm font-semibold text-charcoal">
                  In stock
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, inStock: event.target.checked }))
                    }
                    disabled={!databaseAvailable || isPending}
                    className="size-5 rounded border-charcoal/20 text-amber focus:ring-amber disabled:opacity-60"
                  />
                </label>

                <div className="rounded-xl border border-charcoal/10 bg-ivory/40 p-4 text-sm text-charcoal/65">
                  Public price preview:{" "}
                  <span className="font-semibold text-charcoal">
                    {formatCurrency(priceValue(form), form.currency || "AUD")}
                  </span>
                </div>
              </div>
            ) : null}

            {currentStep.id === "object" ? (
              <div className="grid gap-3">
                <label className="block text-sm font-semibold text-charcoal">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    disabled={!databaseAvailable || isPending}
                    className="mt-1 min-h-32 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                    placeholder="Describe the object, the light behaviour, and why it belongs in the collection."
                    required
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-charcoal">
                    Material
                    <input
                      value={form.material}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, material: event.target.value }))
                      }
                      disabled={!databaseAvailable || isPending}
                      className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold text-charcoal">
                    Dimensions
                    <input
                      value={form.dimensions}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, dimensions: event.target.value }))
                      }
                      disabled={!databaseAvailable || isPending}
                      className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                      required
                    />
                  </label>
                </div>

                <label className="block text-sm font-semibold text-charcoal">
                  Colours
                  <input
                    value={form.colours}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, colours: event.target.value }))
                    }
                    disabled={!databaseAvailable || isPending}
                    className="mt-1 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                    placeholder="Shell, Clear PLA, Warm Amber"
                  />
                </label>
              </div>
            ) : null}

            {currentStep.id === "system" ? (
              <div className="grid gap-4">
                <fieldset className="rounded-xl border border-charcoal/10 p-3">
                  <legend className="px-1 text-sm font-semibold text-charcoal">Adapters</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ADAPTER_TYPES.map((adapter) => (
                      <label
                        key={adapter}
                        className="flex items-center gap-2 text-sm text-charcoal/70"
                      >
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

                <div className="rounded-xl border border-charcoal/10 bg-ivory/40 p-4 text-sm leading-6 text-charcoal/65">
                  {form.adapters.length > 0
                    ? `Compatibility note: ${form.adapters.join(", ")}.`
                    : "No adapters selected. This is allowed by the database, but public product pages work best when compatibility is explicit."}
                </div>
              </div>
            ) : null}

            {currentStep.id === "imagery" ? (
              <div className="grid gap-3">
                <label className="block text-sm font-semibold text-charcoal">
                  Image paths / URLs{" "}
                  <span className="font-normal text-charcoal/40">(optional)</span>
                  <textarea
                    value={form.images}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, images: event.target.value }))
                    }
                    disabled={!databaseAvailable || isPending}
                    className="mt-1 min-h-24 w-full rounded-lg border border-charcoal/15 bg-white px-3 py-2 text-sm font-normal text-charcoal outline-none transition focus:border-amber disabled:opacity-60"
                    placeholder="/products/product-01.png, https://example.com/image.webp"
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
                    <p className="mt-2 text-xs text-charcoal/50">
                      Save the product before uploading image files. Products can be saved with no
                      images.
                    </p>
                  ) : null}
                  {images.length === 0 ? (
                    <p className="mt-3 text-sm text-charcoal/50">
                      No images configured. You can save the product now and add uploaded or pasted
                      image URLs later.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {images.map((image, index) => (
                        <div
                          key={image}
                          className="rounded-lg border border-charcoal/10 bg-white p-2"
                        >
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
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  images: setPrimary(current.images, image),
                                }))
                              }
                              disabled={index === 0 || !databaseAvailable || isPending}
                              className="rounded-full border border-charcoal/15 px-2 py-1 text-xs font-semibold text-charcoal transition hover:border-amber disabled:opacity-50"
                            >
                              Primary
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  images: removeImage(current.images, image),
                                }))
                              }
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
              </div>
            ) : null}

            {currentStep.id === "review" ? (
              <div className="grid gap-4">
                <ProductPreviewCard
                  form={form}
                  image={previewImage}
                  completion={completion}
                  completedCount={completedCount}
                />
                <CopyCapturePanel
                  copyBlocks={copyBlocks}
                  copiedCopyTitle={copiedCopyTitle}
                  onCopy={copyText}
                  onDownload={downloadCopyBlocks}
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 border-t border-charcoal/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveStep(-1)}
                  disabled={currentStepIndex === 0}
                  className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber disabled:opacity-40"
                >
                  Back
                </button>
                {currentStepIndex < wizardSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => moveStep(1)}
                    disabled={!canMoveNext}
                    className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-warm-white transition hover:bg-warm-black disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={!databaseAvailable || isPending || !canSaveProduct}
                className="rounded-full bg-charcoal px-5 py-3 text-sm font-semibold text-warm-white transition hover:bg-warm-black disabled:opacity-60"
              >
                {isPending ? "Saving..." : form.id ? "Save product" : "Add product"}
              </button>
            </div>
          </form>
        </div>

        {currentStep.id !== "review" ? (
          <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
            <ProductPreviewCard
              form={form}
              image={previewImage}
              completion={completion}
              completedCount={completedCount}
              compact
            />
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function ProductPreviewCard({
  form,
  image,
  completion,
  completedCount,
  compact = false,
}: {
  form: ProductFormState;
  image: string | null;
  completion: Array<{ label: string; complete: boolean }>;
  completedCount: number;
  compact?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">
            Listing preview
          </p>
          <h4 className="mt-2 font-serif text-2xl font-semibold text-charcoal">
            {form.title || "Untitled product"}
          </h4>
        </div>
        <span className="rounded-full border border-charcoal/10 bg-ivory px-3 py-1 text-xs font-semibold text-charcoal/55">
          {completedCount}/{completion.length}
        </span>
      </div>

      {!compact ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
          <div
            className="aspect-[4/5] rounded-xl border border-charcoal/10 bg-ivory bg-contain bg-center bg-no-repeat"
            style={image ? { backgroundImage: `url(${image})` } : undefined}
            aria-label={image ? `${form.title || "Product"} preview image` : "No preview image"}
          />
          <div>
            <p className="text-sm leading-7 text-charcoal/65">{shortDescription(form)}</p>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4 border-t border-charcoal/10 pt-2">
                <dt className="text-charcoal/45">Category</dt>
                <dd className="font-semibold text-charcoal">{form.category}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-charcoal/10 pt-2">
                <dt className="text-charcoal/45">Price</dt>
                <dd className="font-semibold text-charcoal">
                  {formatCurrency(priceValue(form), form.currency || "AUD")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-charcoal/10 pt-2">
                <dt className="text-charcoal/45">Status</dt>
                <dd className="font-semibold text-charcoal">
                  {form.inStock ? "In stock" : "Out of stock"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-7 text-charcoal/65">{shortDescription(form)}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {completion.map((item) => (
          <span
            key={item.label}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              item.complete
                ? "border-emerald-500/25 bg-emerald-50 text-emerald-700"
                : "border-charcoal/10 bg-ivory text-charcoal/45"
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CopyCapturePanel({
  copyBlocks,
  copiedCopyTitle,
  onCopy,
  onDownload,
}: {
  copyBlocks: CopyBlock[];
  copiedCopyTitle: string | null;
  onCopy: (title: string, body: string) => void;
  onDownload: () => void;
}) {
  return (
    <section className="rounded-2xl border border-charcoal/10 bg-ivory/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">
            Post copy
          </p>
          <h4 className="mt-2 font-serif text-2xl font-semibold text-charcoal">
            Share-ready drafts
          </h4>
          <p className="mt-2 text-sm leading-6 text-charcoal/60">
            Generated from the current form only. Nothing is persisted until a future content table
            exists.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-amber"
        >
          Download JSON
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {copyBlocks.map((block) => (
          <article key={block.title} className="rounded-xl border border-charcoal/10 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <h5 className="text-sm font-semibold text-charcoal">{block.title}</h5>
              <button
                type="button"
                onClick={() => onCopy(block.title, block.body)}
                className="rounded-full border border-charcoal/15 px-3 py-1 text-xs font-semibold text-charcoal transition hover:border-amber"
              >
                {copiedCopyTitle === block.title ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-charcoal/68">
              {block.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
