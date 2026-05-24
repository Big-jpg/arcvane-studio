// components/product-detail.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Info, PackageCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import type { Product, AdapterType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-types";
import { Toast } from "@/components/toast";
import { ProductImage } from "@/components/product-image";

function getPrimaryAdapter(product: Product): AdapterType {
  return product.adapters.includes("E27") ? "E27" : (product.adapters[0] ?? "E27");
}

function getHardwareLine(product: Product): string {
  if (product.category === "Table Lamps") {
    return "E27 socket assembly, low-power LED bulb, cord set, and compatible shade support are included where shown.";
  }

  if (product.category === "Accessories") {
    return "E27-compatible support hardware is supplied where applicable; pair with an ArcVane E27 cord or lamp assembly.";
  }

  if (product.category === "Shade Sets") {
    return "Each shade is designed for the shared E27 system. Compatible E27 socket, LED bulb, and cord hardware may be paired as the base system.";
  }

  return "Designed for the shared E27 lighting system with compatible E27 socket, LED bulb, and cord hardware where applicable.";
}

function getShadeCompatibilityLine(product: Product): string {
  if (product.category === "Shade Sets") {
    return "Shade packs are intended to rotate through the same ArcVane E27 base system so the light character can change without changing the hardware.";
  }

  if (product.category === "Single Shades") {
    return "Single shades can be paired with compatible ArcVane E27 bases or grouped with future shade packs where scale and clearance match.";
  }

  if (product.category === "Table Lamps") {
    return "The lamp uses the same E27 system as the shade packs, so compatible ArcVane diffusers can be rotated through the base when scale allows.";
  }

  return "Built around ArcVane's shared E27 system for straightforward compatibility across the restrained collection.";
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedColour, setSelectedColour] = useState<string>(product.colours[0] ?? "");
  const [toastVisible, setToastVisible] = useState(false);

  const { addItem, itemCount } = useCart();
  const primaryAdapter = useMemo(() => getPrimaryAdapter(product), [product]);
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
      imageUrl: product.images[0] ?? "",
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
  }, [addItem, canAdd, itemCount, primaryAdapter, product, selectedColour, sendBuyerEvent]);

  const details = [
    ["Scale and dimensions", product.dimensions],
    ["Material and finish", product.material],
    ["Colour options", product.colours.join(", ")],
    ["Lighting system", `${primaryAdapter} / low-power LED only`],
    ["Included hardware", getHardwareLine(product)],
    ["Production window", product.productionNotes ?? "Ships within 5–7 business days"],
    ["Shipping cube", "Designed to fit a 300×300×300mm shipping cube for efficient Australia-wide delivery."],
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
                  src={product.images[0]}
                  alt={`${product.title} finished product photography`}
                  fill
                  className="object-contain p-8 sm:p-12"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
              <p className="mt-4 text-xs leading-6 text-deep-brown/50">
                Finished product photography is shown first. Colour, translucency, and layer texture
                may shift with LED temperature, room light, and small-batch finishing.
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
                ${product.price} <span className="text-base font-normal text-deep-brown/45">{product.currency}</span>
              </p>

              <p className="mt-7 text-base leading-8 text-deep-brown/70">{product.description}</p>

              <div className="mt-8 rounded-2xl border border-charcoal/10 bg-shell/70 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-dune-grass" />
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal">E27 as the primary system</h2>
                    <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                      This piece is supplied around ArcVane&apos;s E27 lighting model. There is no complex
                      adapter selection on the current collection; use only compatible E27 hardware
                      and low-power LED bulbs.
                    </p>
                  </div>
                </div>
              </div>

              {product.colours.length > 1 && (
                <div className="mt-8 border-t border-charcoal/10 pt-7">
                  <label className="text-sm font-semibold text-charcoal">Finish tone</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colours.map((colour) => (
                      <button
                        key={colour}
                        type="button"
                        onClick={() => setSelectedColour(colour)}
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
                    Finish tones are selected as studio directions, not exact industrial colour
                    matches. Small differences between batches are expected.
                  </p>
                </div>
              )}

              <div className="mt-8 border-t border-charcoal/10 pt-7">
                <h2 className="text-sm font-semibold text-charcoal">Product details</h2>
                <dl className="mt-4 divide-y divide-charcoal/10 rounded-2xl border border-charcoal/10 bg-off-white">
                  {details.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[150px_1fr]">
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
                  <h2 className="mt-4 text-sm font-semibold text-charcoal">LED-only safety</h2>
                  <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                    Use modern low-power LED bulbs only. Do not use incandescent, halogen, heat lamp,
                    or other high-temperature bulbs with PLA lighting objects.
                  </p>
                  <Link href="/safety" className="mt-3 inline-flex text-sm font-semibold text-charcoal underline underline-offset-4">
                    Read safety note
                  </Link>
                </div>

                <div className="rounded-2xl border border-charcoal/10 bg-shell/60 p-5">
                  <PackageCheck className="h-5 w-5 text-weathered-post" />
                  <h2 className="mt-4 text-sm font-semibold text-charcoal">Shade-pack compatibility</h2>
                  <p className="mt-2 text-sm leading-7 text-deep-brown/65">
                    {getShadeCompatibilityLine(product)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-charcoal/10 bg-horizon-blue/20 p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-weathered-post" />
                  <p className="text-sm leading-7 text-deep-brown/70">
                    Small-batch finishing is part of the object. Fine FDM layer lines, variable clear
                    PLA opacity, and subtle tone changes are expected and treated as natural texture,
                    not defects.
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
                Add to cart
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-deep-brown/50">
                Need a studio clarification rather than a custom build? Contact ArcVane before
                ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Toast
        message={`${product.title} added to cart`}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}
