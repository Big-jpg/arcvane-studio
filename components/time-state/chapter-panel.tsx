// components/time-state/chapter-panel.tsx

import Link from "next/link";

import { ProductImage } from "@/components/product-image";
import type { TimeChapter } from "@/lib/time-chapters";

type ChapterPanelProps = {
  chapter: TimeChapter;
  index: number;
};

export function ChapterPanel({ chapter, index }: ChapterPanelProps) {
  const isReversed = index % 2 === 1;

  const chapterImage = (
    <>
      <div className="absolute inset-8 rounded-full bg-ts-accent/15 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[2rem] border border-ts-accent/20 bg-ts-surface/75 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.14)] transition-colors duration-300 sm:p-6 lg:rounded-[2.25rem] lg:p-7 lg:shadow-[0_30px_100px_rgba(0,0,0,0.18)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ts-bg/70 lg:aspect-[4/5] lg:rounded-[1.75rem]">
          <ProductImage
            src={chapter.image}
            alt={`${chapter.title} ArcVane shade study`}
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover transition duration-700 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        </div>
      </div>
    </>
  );

  return (
    <section
      id={`chapter-${chapter.key}`}
      data-time-chapter={chapter.key}
      className="scroll-mt-24 bg-ts-bg px-5 py-16 text-ts-text transition-colors duration-300 sm:px-8 sm:py-24 lg:scroll-mt-28 lg:px-12 lg:py-32"
      aria-labelledby={`${chapter.key}-chapter-title`}
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 ${
          isReversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">
              {chapter.title}
            </p>
            <h2
              id={`${chapter.key}-chapter-title`}
              className="max-w-xl text-4xl font-medium tracking-[-0.04em] text-ts-text sm:text-5xl lg:text-6xl"
            >
              {chapter.subtitle}
            </h2>
          </div>

          <div className="relative lg:hidden">{chapterImage}</div>

          <p className="text-base leading-7 text-ts-muted sm:hidden">{chapter.mobileDescription}</p>

          <p className="hidden max-w-2xl text-lg leading-8 text-ts-muted sm:block sm:text-xl sm:leading-9">
            {chapter.description}
          </p>

          <div className="hidden rounded-[2rem] border border-ts-accent/20 bg-ts-surface/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur transition-colors duration-300 sm:block">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ts-accent">
              Best for
            </p>
            <p className="mt-3 text-base leading-7 text-ts-muted">{chapter.bestFor}</p>
          </div>

          <p className="inline-flex rounded-full border border-ts-accent/20 bg-ts-surface/65 px-4 py-2 text-xs font-semibold text-ts-muted sm:hidden">
            <span className="mr-2 uppercase tracking-[0.18em] text-ts-accent">Best for</span>
            {chapter.mobileBestFor}
          </p>

          <div className="flex flex-col items-start gap-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-ts-muted">
              {chapter.cta.cue}
            </p>
            <Link
              href={chapter.cta.href}
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-ts-accent/40 bg-ts-accent px-6 py-3 text-sm font-semibold text-ts-bg shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-ts-text hover:text-ts-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {chapter.cta.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
              >
                ↓
              </span>
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">{chapterImage}</div>
      </div>
    </section>
  );
}
