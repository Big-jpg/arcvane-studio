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
  summary: string;
  behaviour: string;
  bestAt: string;
  variants: FinishVariant[];
};

const minimumSwipeDistance = 36;

export function FinishSwatch({ name, summary, behaviour, bestAt, variants }: FinishSwatchProps) {
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
    <article className="group relative overflow-hidden rounded-[2rem] border border-ts-accent/20 bg-ts-surface/70 p-3 shadow-[0_18px_65px_rgba(0,0,0,0.09)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-ts-accent/40 hover:shadow-[0_28px_90px_rgba(0,0,0,0.16)] focus-within:-translate-y-1 focus-within:border-ts-accent/40 focus-within:shadow-[0_28px_90px_rgba(0,0,0,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0">
      <div
        role="img"
        aria-label={`${name}, ${activeVariant.view}`}
        className="relative aspect-[16/11] overflow-hidden rounded-[1.6rem] border border-ts-accent/15 bg-ts-bg/60 sm:aspect-[16/10]"
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

        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
          {activeVariant.label}
        </div>

        {canCycle ? (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 items-center justify-between">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-sm font-semibold text-white opacity-75 shadow-sm backdrop-blur transition-[background-color,opacity,transform] hover:scale-105 hover:bg-black/45 hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
              aria-label={`Previous ${name} view`}
              onClick={showPrevious}
            >
              ←
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-sm font-semibold text-white opacity-75 shadow-sm backdrop-blur transition-[background-color,opacity,transform] hover:scale-105 hover:bg-black/45 hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transition-none"
              aria-label={`Next ${name} view`}
              onClick={showNext}
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div className="px-3 pb-4 pt-5 sm:px-4 sm:pb-5">
        <h2 className="text-2xl font-semibold tracking-[-0.035em] text-ts-text sm:text-3xl">
          {name}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ts-muted">{summary}</p>

        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-ts-accent/15 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ts-muted">
              Light behaviour
            </dt>
            <dd className="mt-2 text-sm leading-6 text-ts-text">{behaviour}</dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ts-muted">
              Comes alive
            </dt>
            <dd className="mt-2 text-sm leading-6 text-ts-text">{bestAt}</dd>
          </div>
        </dl>

        {canCycle ? (
          <div className="mt-5 flex flex-wrap gap-2" aria-label={`${name} views`}>
            {variants.map((variant, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={variant.view}
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ts-accent/70 motion-reduce:transition-none",
                    isActive
                      ? "border-ts-accent bg-ts-accent text-ts-bg"
                      : "border-ts-accent/20 text-ts-muted hover:border-ts-accent/45 hover:text-ts-text",
                  )}
                  aria-label={`Show ${variant.label} view for ${name}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
