// components/product-detail.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import type { AdapterType, Product, ProductSupplyModel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-types";
import {
  TONE_IMAGE_MODE_LABELS,
  buildToneImagePairs,
  toneImageForMode,
  type ToneImageMode,
} from "@/lib/product-tone-images";
import { Toast } from "@/components/toast";
import { ProductImage } from "@/components/product-image";
import { ProductFulfilmentDetails } from "@/components/product-fulfilment-details";

function getPrimaryAdapter(product: Product): AdapterType {
  return product.adapters.includes("E27") ? "E27" : (product.adapters[0] ?? "E27");
}

function getComponentScope(product: Product): NonNullable<Product["componentScope"]> {
  if (product.componentScope) {
    return product.componentScope;
  }

  if (product.category === "Accessories") {
    return {
      supplyModel: "decorative-components-only",
      included: ["ArcVane printed mechanical accessory"],
      notIncluded: [
        "bulb",
        "electrical socket",
        "cord",
        "plug",
        "lamp holder",
        "any electrical fitting unless explicitly stated on this product page",
      ],
      customerSupplied: [
        "compatible E27 lamp holder",
        "low-heat LED bulb only",
        "stable compliant lamp base or customer-supplied fitting",
      ],
      compatibility:
        "Use only with compatible ArcVane shades, sufficient clearances, and customer-supplied compliant E27 components.",
    };
  }

  return {
    supplyModel: "decorative-components-only",
    included: ["ArcVane printed shade or diffuser"],
    notIncluded: [
      "bulb",
      "electrical socket",
      "cord",
      "plug",
      "lamp holder",
      "any electrical fitting unless explicitly stated on this product page",
    ],
    customerSupplied: [
      "compatible E27 lamp holder",
      "low-heat LED bulb only",
      "stable compliant lamp base or customer-supplied fitting",
    ],
    compatibility:
      "Designed for compatible E27 settings where shade diameter, bulb dimensions, heat output, and clearances suit the object.",
  };
}

function getComponentScopeNotice(supplyModel: ProductSupplyModel): {
  title: string;
  body: string;
} {
  if (supplyModel === "certified-electrical-kit") {
    return {
      title: "Certified kit scope",
      body: "This listing separates ArcVane physical components from any certified electrical components named below. Components not listed remain customer-supplied.",
    };
  }

  if (supplyModel === "complete-assembled-system") {
    return {
      title: "Complete assembled system scope",
      body: "This listing separates the assembled ArcVane system from any optional or replacement components that remain outside the supplied set.",
    };
  }

  return {
    title: "Decorative component, not electrical assembly",
    body: "This listing covers the ArcVane physical components only. Bulbs, electrical sockets, cords, plugs, lamp holders, complete lamp bases, and other electrical assemblies are sourced separately by the customer unless explicitly stated.",
  };
}

function getShadeCompatibilityLine(product: Product): string {
  if (product.category === "Shade Sets") {
    return "Shade packs rotate through compatible E27 lamp holders and bases so light character can change while customer-supplied electrical assemblies remain separate.";
  }

  if (product.category === "Single Shades") {
    return "Single shades can be paired with compatible E27 lamp holders or ArcVane stands where scale, neck fit, and bulb clearance match.";
  }

  if (product.category === "Lighting Objects") {
    return "This shade-and-stand object uses the same mechanical interface as the shade packs, so compatible ArcVane diffusers can be rotated through where scale allows.";
  }

  return "Built around ArcVane's shared decorative component system for calm compatibility across the restrained collection.";
}

function formatTimeState(timeState?: Product["timeState"]): string | null {
  if (!timeState) {
    return null;
  }

  return timeState
    .split(" / ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedColour, setSelectedColour] = useState<string>(product.colours[0] ?? "");
  const [selectedImageMode, setSelectedImageMode] = useState<ToneImageMode>("illuminated");
  const [toastVisible, setToastVisible] = useState(false);

  const { addItem, itemCount } = useCart();
  const primaryAdapter = useMemo(() => getPrimaryAdapter(product), [product]);
  const toneImagePairs = useMemo(
    () => buildToneImagePairs(product.colours, product.images),
    [product.colours, product.images],
  );
  const selectedToneImages = useMemo(
    () => toneImagePairs.find((pair) => pair.tone === selectedColour) ?? toneImagePairs[0] ?? null,
    [selectedColour, toneImagePairs],
  );
  const fallbackImage = product.images[0] ?? "";
  const selectedImage = toneImageForMode(selectedToneImages, selectedImageMode, fallbackImage);
  const productTimeState = formatTimeState(product.timeState);
  const componentScope = useMemo(() => getComponentScope(product), [product]);
  const supplyModel = componentScope.supplyModel ?? "decorative-components-only";
  const scopeNotice = getComponentScopeNotice(supplyModel);
  const canAdd = selectedColour.length > 0;

  const sendBuyerEvent = useCallback(
    (eventType: "cart_created", payload: Record<string, unknown>) => {
      void fetch("/api/buyer-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: eventType, payload }),
      }).catch(() => undefined);
    },
    [],
  );

  const handleAddToCart = useCallback(() => {
    if (!canAdd) return;

    const item: CartItem = {
      productId: product.id,
      variantId: product.shopifyVariantId ?? null,
      handle: product.handle,
      title: product.title,
      variantTitle: selectedColour,
      imageUrl: selectedImage,
      unitPrice: product.price,
      currency: product.currency,
      quantity: 1,
      selectedAdapter: primaryAdapter,
      bulbTypeConfirmed: false,
      fixtureNotes: "",
      customisationNotes: "",
      material: product.material,
      colour: selectedColour,
      metadata: null,
    };

    addItem(item);

    if (itemCount === 0) {
      sendBuyerEvent("cart_created", {
        product_id: product.id,
        product_handle: product.handle,
        product_title: product.title,
        selected_adapter: primaryAdapter,
        selected_colour: selectedColour,
        item_count: 1,
        currency: product.currency,
        subtotal_amount: Math.round(product.price * 100),
      });
    }

    setToastVisible(true);
  }, [
    addItem,
    canAdd,
    itemCount,
    primaryAdapter,
    product,
    selectedColour,
    selectedImage,
    sendBuyerEvent,
  ]);

  return (
    <>
      <div className="border-b border-ts-accent/20 bg-ts-bg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-ts-muted transition-colors hover:text-ts-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to collection
          </Link>
        </div>
      </div>

      <section className="bg-ts-bg py-10 text-ts-text transition-colors duration-300 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-16">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-ts-accent/20 bg-ts-surface shadow-sm ">
                <ProductImage
                  src={selectedImage}
                  alt={`${product.title} in ${selectedColour || "selected finish"}, ${TONE_IMAGE_MODE_LABELS[selectedImageMode].toLowerCase()}`}
                  fill
                  className="object-contain p-8 sm:p-12"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
              {selectedToneImages ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(["unlit", "illuminated"] as ToneImageMode[]).map((mode) => {
                    const image =
                      mode === "unlit" ? selectedToneImages.unlit : selectedToneImages.illuminated;
                    const active = selectedImageMode === mode;

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSelectedImageMode(mode)}
                        className={cn(
                          "group rounded-2xl border bg-ts-surface p-2 text-left transition-all motion-reduce:transition-none",
                          active
                            ? "border-ts-text shadow-sm "
                            : "border-ts-accent/20 hover:border-ts-text/30",
                        )}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ts-bg">
                          <ProductImage
                            src={image}
                            alt={`${product.title} ${selectedToneImages.tone} ${TONE_IMAGE_MODE_LABELS[mode].toLowerCase()} view`}
                            fill
                            className="object-contain p-3 transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                            sizes="(max-width: 640px) 50vw, 220px"
                          />
                        </div>
                        <span
                          className={cn(
                            "mt-2 block text-xs font-semibold uppercase tracking-[0.16em]",
                            active ? "text-ts-text" : "text-ts-muted",
                          )}
                        >
                          {TONE_IMAGE_MODE_LABELS[mode]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <p className="mt-4 text-xs leading-6 text-ts-muted">
                Finish tone photography is paired as quiet and illuminated views. Colour,
                translucency, and surface rhythm may shift with customer-supplied LED temperature,
                room light, and small-batch finishing.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ts-accent">
                  {product.category}
                </p>
                {productTimeState ? (
                  <span className="rounded-full border border-ts-accent/25 bg-ts-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ts-muted">
                    Best in {productTimeState}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ts-text sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-5 text-2xl font-semibold text-ts-text">
                ${product.price}{" "}
                <span className="text-base font-normal text-ts-muted">{product.currency}</span>
              </p>

              <p className="mt-7 text-base leading-8 text-ts-muted">{product.description}</p>

              <div className="mt-8 rounded-2xl border border-ts-accent/20 bg-ts-surface/70 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ts-accent" />
                  <div>
                    <h2 className="text-sm font-semibold text-ts-text">{scopeNotice.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-ts-muted">{scopeNotice.body}</p>
                  </div>
                </div>
              </div>

              {product.colours.length > 0 && (
                <div className="mt-8 border-t border-ts-accent/20 pt-7">
                  <label className="text-sm font-semibold text-ts-text">Material finish</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colours.map((colour) => (
                      <button
                        key={colour}
                        type="button"
                        onClick={() => {
                          setSelectedColour(colour);
                          setSelectedImageMode("illuminated");
                        }}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          selectedColour === colour
                            ? "border-ts-text bg-ts-text text-ts-bg"
                            : "border-ts-accent/25 text-ts-muted hover:border-ts-text/35 hover:text-ts-text",
                        )}
                      >
                        {colour}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-6 text-ts-muted">
                    Material finishes are selected as studio directions, not exact industrial colour
                    matches. Small differences between batches are expected.
                  </p>
                  {selectedToneImages && !selectedToneImages.complete ? (
                    <p className="mt-2 text-xs leading-6 text-ts-accent">
                      This finish is missing one of its paired views, so the available product
                      photography is being reused.
                    </p>
                  ) : null}
                </div>
              )}

              <ProductFulfilmentDetails
                product={product}
                componentScope={componentScope}
                primaryAdapter={primaryAdapter}
              />

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ts-accent/25 bg-ts-accent/5 p-5">
                  <ShieldCheck className="h-5 w-5 text-ts-accent" />
                  <h2 className="mt-4 text-sm font-semibold text-ts-text">Low-heat LED only</h2>
                  <p className="mt-2 text-sm leading-7 text-ts-muted">
                    Use modern low-heat LED bulbs only. Do not use incandescent, halogen, heat lamp,
                    or other high-temperature bulbs with printed shades, diffusers, or accessories.
                  </p>
                  <Link
                    href="/safety"
                    className="mt-3 inline-flex text-sm font-semibold text-ts-text underline underline-offset-4"
                  >
                    Read safety note
                  </Link>
                </div>

                <div className="rounded-2xl border border-ts-accent/20 bg-ts-surface/60 p-5">
                  <PackageCheck className="h-5 w-5 text-ts-muted" />
                  <h2 className="mt-4 text-sm font-semibold text-ts-text">
                    Layering and compatibility
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-ts-muted">
                    {componentScope.compatibility}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-ts-muted">
                    {getShadeCompatibilityLine(product)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-ts-accent/20 bg-ts-surface/70 p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-ts-muted" />
                  <p className="text-sm leading-7 text-ts-muted">
                    Small-batch finishing is part of the object. Fine layer rhythm, variable
                    translucency, and subtle tone changes are expected and treated as natural
                    texture, not defects.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={handleAddToCart}
                className={cn(
                  "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-all",
                  canAdd
                    ? "bg-ts-text text-ts-bg hover:bg-ts-accent"
                    : "cursor-not-allowed bg-ts-text/15 text-ts-text/40",
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to selection
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-ts-muted">
                Need a fit or finish clarification? Contact ArcVane before ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Toast
        message={`${product.title} added to selection`}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}
