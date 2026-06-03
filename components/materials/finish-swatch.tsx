// components/materials/finish-swatch.tsx
"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type FinishVariant = {
  label: string;
  view: string;
  background: string;
  description: string;
};

export type FinishSwatchProps = {
  name: string;
  description: string;
  properties: string[];
  variants: FinishVariant[];
  technicalNote: string;
};

export function FinishSwatch({
  name,
  description,
  properties,
  variants,
  technicalNote,
}: FinishSwatchProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVariant = variants[activeIndex] ?? variants[0];

  useEffect(() => {
    if (variants.length <= 1) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionQuery.matches) {
      return;
    }

    const cycle = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % variants.length);
    }, 3600);

    return () => window.clearInterval(cycle);
  }, [variants.length]);

  return (
    <article className="group relative z-0 flex h-full flex-col overflow-hidden rounded-[2rem] border border-ts-accent/20 bg-ts-surface/85 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:z-20 hover:-translate-y-2 hover:scale-[1.035] hover:border-ts-accent/45 hover:shadow-[0_34px_100px_rgba(0,0,0,0.22)] focus-within:z-20 focus-within:-translate-y-2 focus-within:scale-[1.035] focus-within:border-ts-accent/45 focus-within:shadow-[0_34px_100px_rgba(0,0,0,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:focus-within:translate-y-0 motion-reduce:focus-within:scale-100 sm:p-5">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-ts-accent/20 bg-ts-bg/70">
        <div
          role="img"
          aria-label={`${name}, ${activeVariant.view}`}
          className="relative aspect-[4/3] overflow-hidden transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ background: activeVariant.background }}
        >
          <div className="absolute inset-x-[18%] bottom-[13%] h-[58%] rounded-b-[46%] rounded-t-[16%] border border-white/35 bg-white/10 shadow-[inset_0_16px_45px_rgba(255,255,255,0.25),inset_0_-24px_55px_rgba(0,0,0,0.16),0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-[1px]" />
          <div className="absolute inset-x-[28%] bottom-[19%] h-[45%] rounded-b-[48%] rounded-t-[18%] border-x border-white/20 bg-black/5" />
          <div className="absolute left-1/2 top-[20%] h-[55%] w-px -translate-x-1/2 bg-white/40" />
          <div className="absolute left-1/2 top-[17%] h-[12%] w-[18%] -translate-x-1/2 rounded-full border border-white/35 bg-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.18)]" />
          <div className="absolute inset-x-[15%] bottom-[11%] h-[6%] rounded-full bg-black/18 blur-sm" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.48),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.18)_46%,transparent_53%)]" />
        </div>

        <div className="absolute left-3 top-3 rounded-full border border-white/35 bg-black/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur">
          {activeVariant.label}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ts-text">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-ts-muted">{description}</p>
          </div>
        </div>

        <p className="mt-4 min-h-12 text-sm leading-6 text-ts-text/78">{activeVariant.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {properties.map((property) => (
            <span
              key={property}
              className="rounded-full border border-ts-accent/20 bg-ts-bg/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ts-muted"
            >
              {property}
            </span>
          ))}
        </div>

        <div className="mt-6 border-t border-ts-accent/15 pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ts-accent">Viewer</p>
            <p className="text-xs text-ts-muted">
              {activeIndex + 1} / {variants.length}
            </p>
          </div>

          <div className="mt-3 flex gap-2" aria-label={`${name} placeholder views`}>
            {variants.map((variant, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={variant.view}
                  type="button"
                  className={cn(
                    "h-2.5 flex-1 rounded-full border border-ts-accent/30 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ts-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ts-surface motion-reduce:transition-none",
                    isActive ? "bg-ts-accent" : "bg-ts-bg hover:bg-ts-accent/45",
                  )}
                  aria-label={`Show ${variant.view}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                />
              );
            })}
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-ts-muted">{technicalNote}</p>
      </div>
    </article>
  );
}
