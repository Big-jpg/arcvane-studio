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
import type { Product, AdapterType } from "@/lib/types";
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

function getPrimaryAdapter(product: Product): AdapterType {
  return product.adapters.includes("E27") ? "E27" : (product.adapters[0] ?? "E27");
}

function getHardwareLine(product: Product): string {
  if (product.category === "Table Lamps") {
    return "E27 socket assembly, low-heat LED bulb, cord set, and compatible shade support are included where shown.";
  }

  if (product.category === "Accessories") {
    return "E27-compatible support hardware is supplied where applicable; pair with an ArcVane cord or lamp assembly.";
  }

  if (product.category === "Shade Sets") {
    return "Each shade is designed for the shared E27 system. Compatible socket, low-heat LED bulb, and cord hardware may be paired as the base apparatus.";
  }

  return "Designed for the shared E27 lighting system with compatible socket, low-heat LED bulb, and cord hardware where applicable.";
}

function getShadeCompatibilityLine(product: Product): string {
  if (product.category === "Shade Sets") {
    return "Shade packs rotate through the same ArcVane base so the light character can change without replacing the hardware.";
  }

  if (product.category === "Single Shades") {
    return "Single shades can be paired with compatible ArcVane bases or layered with future shade packs where scale and clearance match.";
  }

  if (product.category === "Table Lamps") {
    return "The lamp uses the same shared system as the shade packs, so compatible ArcVane diffusers can be rotated through the base when scale allows.";
  }

  return "Built around ArcVane's shared lighting system for calm compatibility across the restrained collection.";
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

  const details = [
    ["Scale and dimensions", product.dimensions],
    ["Material and finish", product.material],
    ["Colour options", product.colours.join(", ")],
    ["Lighting system", `${primaryAdapter} / low-heat LED only`],
    ["Included hardware", getHardwareLine(product)],
    [
      "Production window",
      product.productionNotes ?? "Ready for fulfilment within 5–7 business days",
    ],
    [
      "Packing guide",
      "Designed around compact packing dimensions so fulfilment can be arranged cleanly after order.",
    ],
  ];

  return (
    <>
      <div className="border-b border-charcoal/10 bg-off-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-deep-brown/55 transition-colors hover:text-charcoal"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to collection
          </Link>
        </div>
      </div>

      <section className="bg-off-white py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-16">
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/10 bg-shell shadow-sm shadow-charcoal/5">
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
                          "group rounded-2xl border bg-shell p-2 text-left transition-all",
                          active
                            ? "border-charcoal shadow-sm shadow-charcoal/10"
                            : "border-charcoal/10 hover:border-charcoal/30",
                        )}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-off-white">
                          <ProductImage
                            src={image}
                            alt={`${product.title} ${selectedToneImages.tone} ${TONE_IMAGE_MODE_LABELS[mode].toLowerCase()} view`}
                            fill
                            className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 640px) 50vw, 220px"
                          />
                        </div>
                        <span
                          className={cn(
                            "mt-2 block text-xs font-semibold uppercase tracking-[0.16em]",
                            active ? "text-charcoal" : "text-deep-brown/45",
                          )}
                        >
                          {TONE_IMAGE_MODE_LABELS[mode]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <p className="mt-4 text-xs leading-6 text-deep-brown/50">
                Finish tone photography is paired as quiet and illuminated views. Colour,
                translucency, and surface rhythm may shift with LED temperature, room light, and
                small-batch finishing.
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-warm-amber">
                {product.category}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-5 text-2xl font-semibold text-charcoal">
                ${product.price}{" "}
                <span className="text-base font-normal text-deep-brown/45">{product.currency}</span>
              </p>

              <p className="mt-7 text-base leading-8 text-deep-brown/70">{product.description}</p>

              <div className="mt-8 rounded-2xl border border-charcoal/10 bg-shell/70 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dune-grass" />
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal">
                      Part of the shared lighting system
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                      This piece belongs to ArcVane&apos;s modular lighting apparatus. There is no
                      complex adapter language in the current collection; use compatible E27
                      hardware and low-heat LED bulbs only.
                    </p>
                  </div>
                </div>
              </div>

              {product.colours.length > 0 && (
                <div className="mt-8 border-t border-charcoal/10 pt-7">
                  <label className="text-sm font-semibold text-charcoal">Material finish</label>
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
                            ? "border-charcoal bg-charcoal text-off-white"
                            : "border-charcoal/15 text-deep-brown/65 hover:border-charcoal/35 hover:text-charcoal",
                        )}
                      >
                        {colour}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-6 text-deep-brown/50">
                    Material finishes are selected as studio directions, not exact industrial colour
                    matches. Small differences between batches are expected.
                  </p>
                  {selectedToneImages && !selectedToneImages.complete ? (
                    <p className="mt-2 text-xs leading-6 text-warm-amber">
                      This finish is missing one of its paired views, so the available product
                      photography is being reused.
                    </p>
                  ) : null}
                </div>
              )}

              <div className="mt-8 border-t border-charcoal/10 pt-7">
                <h2 className="text-sm font-semibold text-charcoal">Object details</h2>
                <dl className="mt-4 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-off-white">
                  {details.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-weathered-post">
                        {label}
                      </dt>
                      <dd className="text-sm leading-7 text-deep-brown/70">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-warm-amber/25 bg-warm-amber/5 p-5">
                  <ShieldCheck className="h-5 w-5 text-warm-amber" />
                  <h2 className="mt-4 text-sm font-semibold text-charcoal">Low-heat LED only</h2>
                  <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                    Use modern low-heat LED bulbs only. Do not use incandescent, halogen, heat
                    lamp, or other high-temperature bulbs with printed lighting objects.
                  </p>
                  <Link
                    href="/safety"
                    className="mt-3 inline-flex text-sm font-semibold text-charcoal underline underline-offset-4"
                  >
                    Read safety note
                  </Link>
                </div>

                <div className="rounded-2xl border border-charcoal/10 bg-shell/60 p-5">
                  <PackageCheck className="h-5 w-5 text-weathered-post" />
                  <h2 className="mt-4 text-sm font-semibold text-charcoal">
                    Layering and compatibility
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                    {getShadeCompatibilityLine(product)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-charcoal/10 bg-horizon-blue/20 p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-weathered-post" />
                  <p className="text-sm leading-7 text-deep-brown/70">
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
                    ? "bg-charcoal text-off-white hover:bg-deep-brown"
                    : "cursor-not-allowed bg-charcoal/15 text-charcoal/40",
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to selection
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-deep-brown/50">
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
