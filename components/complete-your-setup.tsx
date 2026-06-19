// components/complete-your-setup.tsx
"use client";

import { useCallback, useState } from "react";
import { Plus, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-types";
import {
  ACCESSORY_BULBS,
  CORN_BULB_DIFFERENTIATORS,
  type AccessoryProduct,
} from "@/lib/accessories";

function AccessoryCard({
  accessory,
  onAdd,
  added,
}: {
  accessory: AccessoryProduct;
  onAdd: (acc: AccessoryProduct) => void;
  added: boolean;
}) {
  // Colour indicator based on kelvin
  const kelvinColour =
    accessory.kelvin <= 2700
      ? "bg-amber-400/20 border-amber-400/40"
      : accessory.kelvin <= 4000
        ? "bg-neutral-200/20 border-neutral-300/40"
        : "bg-blue-100/20 border-blue-300/40";

  const kelvinDot =
    accessory.kelvin <= 2700
      ? "bg-amber-400"
      : accessory.kelvin <= 4000
        ? "bg-neutral-300"
        : "bg-blue-200";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border p-5 transition-all",
        added
          ? "border-ts-accent/40 bg-ts-accent/5"
          : "border-ts-accent/15 bg-ts-surface/50 hover:border-ts-accent/30",
      )}
    >
      {/* Kelvin indicator */}
      <div className={cn("mb-4 flex h-16 items-center justify-center rounded-xl", kelvinColour)}>
        <div className={cn("h-4 w-4 rounded-full", kelvinDot)} />
        <span className="ml-2 text-sm font-semibold text-ts-text">
          {accessory.kelvin.toLocaleString()}K
        </span>
      </div>

      <h3 className="text-sm font-semibold text-ts-text">{accessory.colourTemp}</h3>
      <p className="mt-1 text-xs text-ts-muted">{accessory.subtitle.split("·")[1]?.trim()}</p>

      {/* Specs row */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {accessory.specs.slice(0, 4).map((spec) => (
          <span
            key={spec}
            className="rounded-full border border-ts-accent/15 px-2 py-0.5 text-[10px] font-medium text-ts-muted"
          >
            {spec}
          </span>
        ))}
      </div>

      <p className="mt-3 flex-1 text-xs leading-5 text-ts-muted">{accessory.benefit}</p>

      {/* Price + add */}
      <div className="mt-4 flex items-center justify-between border-t border-ts-accent/10 pt-3">
        <span className="text-sm font-semibold text-ts-text">
          ${accessory.price.toFixed(2)}{" "}
          <span className="text-[10px] font-normal text-ts-muted">each</span>
        </span>
        <button
          type="button"
          onClick={() => onAdd(accessory)}
          disabled={added}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
            added
              ? "bg-ts-accent/10 text-ts-accent"
              : "bg-ts-text text-ts-bg hover:bg-ts-accent",
          )}
        >
          {added ? (
            <>
              <Check className="h-3 w-3" /> Added
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function CompleteYourSetup() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = useCallback(
    (accessory: AccessoryProduct) => {
      const item: CartItem = {
        productId: accessory.id,
        variantId: null,
        handle: accessory.handle,
        title: accessory.title,
        variantTitle: accessory.colourTemp,
        imageUrl: accessory.image,
        unitPrice: accessory.price,
        currency: accessory.currency,
        quantity: 1,
        selectedAdapter: accessory.fitting,
        bulbTypeConfirmed: true,
        fixtureNotes: "",
        customisationNotes: "",
        material: "LED Corn Bulb",
        colour: accessory.colourTemp,
        metadata: { kelvin: String(accessory.kelvin) },
      };
      addItem(item);
      setAddedIds((prev) => new Set(prev).add(accessory.id));
    },
    [addItem],
  );

  return (
    <section className="mt-16 border-t border-ts-accent/15 pt-12">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Zap className="mt-0.5 h-5 w-5 shrink-0 text-ts-accent" />
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ts-text">
            Complete your setup
          </h2>
          <p className="mt-1 text-sm text-ts-muted">
            E27 corn bulbs designed for even diffusion through patterned shades. Sold at cost.
          </p>
        </div>
      </div>

      {/* Bulb cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ACCESSORY_BULBS.map((bulb) => (
          <AccessoryCard
            key={bulb.id}
            accessory={bulb}
            onAdd={handleAdd}
            added={addedIds.has(bulb.id)}
          />
        ))}
      </div>

      {/* Why corn bulbs */}
      <details className="mt-6 group">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-ts-muted hover:text-ts-text transition-colors">
          Why corn bulbs?
        </summary>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CORN_BULB_DIFFERENTIATORS.map((diff) => (
            <div
              key={diff.label}
              className="rounded-xl border border-ts-accent/10 bg-ts-surface/30 p-4"
            >
              <p className="text-xs font-semibold text-ts-text">{diff.label}</p>
              <p className="mt-1 text-xs leading-5 text-ts-muted">{diff.detail}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
