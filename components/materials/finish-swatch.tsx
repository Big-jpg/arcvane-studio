// components/materials/finish-swatch.tsx
"use client";

import { useState } from "react";
import type { TouchEvent } from "react";

import { cn } from "@/lib/utils";

export type FinishVariant = {
  label: string;
  view: string;
  background: string;
};

export type FinishSwatchProps = {
  name: string;
  variants: FinishVariant[];
};

const minimumSwipeDistance = 36;

export function FinishSwatch({ name, variants }: FinishSwatchProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeVariant = variants[activeIndex] ?? variants[0];
  const canCycle = variants.length > 1;

  function showPrevious() {
    if (!canCycle) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex - 1 + variants.length) % variants.length);
  }

  function showNext() {
    if (!canCycle) {
      return;
    }

    setActiveIndex((currentIndex) => (currentIndex + 1) % variants.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchEndX - touchStartX;

    setTouchStartX(null);

    if (Math.abs(deltaX) < minimumSwipeDistance) {
      return;
    }

    if (deltaX > 0) {
      showPrevious();
      return;
    }

    showNext();
  }

  return (
    <article className="group relative z-0 overflow-hidden rounded-[1.6rem] border border-ts-accent/15 bg-ts-surface/70 p-3 shadow-[0_14px_45px_rgba(0,0,0,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:z-20 hover:-translate-y-1.5 hover:scale-[1.025] hover:border-ts-accent/35 hover:shadow-[0_24px_80px_rgba(0,0,0,0.16)] focus-within:z-20 focus-within:-translate-y-1.5 focus-within:scale-[1.025] focus-within:border-ts-accent/35 focus-within:shadow-[0_24px_80px_rgba(0,0,0,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0">
      <div
        role="img"
        aria-label={`${name}, ${activeVariant.view}`}
        className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] border border-ts-accent/15 bg-ts-bg/60"
        style={{ background: activeVariant.background }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-x-[18%] bottom-[13%] h-[60%] rounded-b-[46%] rounded-t-[18%] border border-white/35 bg-white/10 shadow-[inset_0_16px_45px_rgba(255,255,255,0.24),inset_0_-24px_55px_rgba(0,0,0,0.16),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-[1px]" />
        <div className="absolute inset-x-[28%] bottom-[19%] h-[46%] rounded-b-[48%] rounded-t-[18%] border-x border-white/20 bg-black/5" />
        <div className="absolute left-1/2 top-[19%] h-[56%] w-px -translate-x-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-[16%] h-[12%] w-[18%] -translate-x-1/2 rounded-full border border-white/35 bg-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.18)]" />
        <div className="absolute inset-x-[15%] bottom-[11%] h-[6%] rounded-full bg-black/18 blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.46),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.17)_46%,transparent_53%)]" />

        {canCycle ? (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-black/25 text-sm font-semibold text-white shadow-sm backdrop-blur transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
              aria-label={`Previous ${name} view`}
              onClick={showPrevious}
            >
              ←
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-black/25 text-sm font-semibold text-white shadow-sm backdrop-blur transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
              aria-label={`Next ${name} view`}
              onClick={showNext}
            >
              →
            </button>
          </div>
        ) : null}

        {canCycle ? (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-label={`${name} views`}>
            {variants.map((variant, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={variant.view}
                  type="button"
                  className={cn(
                    "h-2 rounded-full border border-white/45 transition-[width,background-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none",
                    isActive ? "w-5 bg-white" : "w-2 bg-white/35 hover:bg-white/70",
                  )}
                  aria-label={`Show ${variant.label} view for ${name}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      <h2 className="px-2 pb-1 pt-3 text-base font-semibold tracking-[-0.02em] text-ts-text sm:text-lg">
        {name}
      </h2>
    </article>
  );
}
