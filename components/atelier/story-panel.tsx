import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { ProductImage } from "@/components/product-image";
import type { AtelierStoryChapter, AtelierTreatment } from "@/lib/atelier-story";
import { cn } from "@/lib/utils";

const treatmentClasses: Record<AtelierTreatment, string> = {
  dawn: "bg-[linear-gradient(180deg,#f8f3ea_0%,#f4efe6_44%,#d7e5e4_100%)]",
  limestone: "bg-[linear-gradient(180deg,#faf7f0_0%,#e9dfcf_52%,#c7d8d9_100%)]",
  study: "bg-shell",
  workshop: "bg-off-white",
  system: "bg-deep-brown text-shell",
  collection: "bg-off-white",
  interior: "bg-[linear-gradient(180deg,#f4efe6_0%,#efe3d0_58%,#3d3028_180%)]",
  quiet: "bg-shell",
};

const textClasses: Record<AtelierTreatment, string> = {
  dawn: "text-charcoal",
  limestone: "text-charcoal",
  study: "text-charcoal",
  workshop: "text-charcoal",
  system: "text-shell",
  collection: "text-charcoal",
  interior: "text-charcoal",
  quiet: "text-charcoal",
};

const mutedTextClasses: Record<AtelierTreatment, string> = {
  dawn: "text-deep-brown/68",
  limestone: "text-deep-brown/68",
  study: "text-deep-brown/68",
  workshop: "text-deep-brown/68",
  system: "text-shell/70",
  collection: "text-deep-brown/68",
  interior: "text-deep-brown/70",
  quiet: "text-deep-brown/68",
};

function buttonClass(variant: "primary" | "secondary" | "quiet" = "primary") {
  if (variant === "quiet") {
    return "inline-flex items-center gap-2 text-sm font-semibold text-deep-brown transition-colors hover:text-charcoal";
  }

  if (variant === "secondary") {
    return "inline-flex items-center justify-center rounded-full border border-limestone/70 px-5 py-3 text-sm font-semibold text-deep-brown transition-colors hover:border-weathered-post hover:bg-off-white";
  }

  return "inline-flex items-center justify-center gap-2 rounded-full bg-deep-brown px-5 py-3 text-sm font-semibold text-shell transition-colors hover:bg-charcoal";
}

function HorizonField({ treatment }: { treatment: AtelierTreatment }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-px w-[140vw] -translate-x-1/2 bg-limestone/45",
          treatment === "system" && "bg-shell/15",
        )}
      />
      <div
        className={cn(
          "absolute -right-24 top-20 h-72 w-72 rounded-full bg-horizon-blue/35 blur-3xl",
          treatment === "dawn" && "bg-warm-amber/18",
          treatment === "system" && "bg-warm-amber/10",
        )}
      />
      <div
        className={cn(
          "absolute -bottom-36 left-[-10%] h-80 w-[120%] rounded-[50%] bg-sand/25 blur-2xl",
          treatment === "system" && "bg-shell/5",
        )}
      />
    </div>
  );
}

function ChapterVisual({
  chapter,
  priority,
}: {
  chapter: AtelierStoryChapter;
  priority?: boolean;
}) {
  if (!chapter.image) {
    return (
      <div className="relative min-h-72 overflow-hidden rounded-2xl border border-limestone/35 bg-shell/50">
        <div className="absolute inset-x-8 top-1/2 h-px bg-limestone/60" />
        <div className="absolute bottom-10 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border border-warm-amber/20 bg-warm-amber/10" />
      </div>
    );
  }

  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-limestone/35 bg-shell/45 shadow-sm shadow-charcoal/5">
      <div className="relative aspect-[4/5] min-h-[360px]">
        <ProductImage
          src={chapter.image.src}
          alt={chapter.image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.015] sm:p-12"
        />
      </div>
      {chapter.image.caption && (
        <figcaption className="border-t border-limestone/35 bg-off-white/70 px-5 py-4 text-xs uppercase tracking-[0.18em] text-weathered-post">
          {chapter.image.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function StoryPanel({
  chapter,
  index,
  children,
}: {
  chapter: AtelierStoryChapter;
  index: number;
  children?: ReactNode;
}) {
  const isSystem = chapter.treatment === "system";
  const Heading = index === 0 ? "h1" : "h2";

  return (
    <section
      id={chapter.id}
      className={cn(
        "relative scroll-mt-16 overflow-hidden border-b border-limestone/35",
        treatmentClasses[chapter.treatment],
        textClasses[chapter.treatment],
      )}
    >
      <HorizonField treatment={chapter.treatment} />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.7fr)] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.28em]",
              isSystem ? "text-sand" : "text-weathered-post",
            )}
          >
            {chapter.eyebrow} / {String(index + 1).padStart(2, "0")}
          </p>

          <Heading
            className={cn(
              "mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl",
              index > 0 && "text-4xl leading-tight sm:text-5xl lg:text-6xl",
            )}
          >
            {chapter.title}
          </Heading>

          {chapter.subtitle && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-xl leading-8 sm:text-2xl sm:leading-9",
                mutedTextClasses[chapter.treatment],
              )}
            >
              {chapter.subtitle}
            </p>
          )}

          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
              mutedTextClasses[chapter.treatment],
            )}
          >
            {chapter.description}
          </p>

          {(chapter.cta || chapter.secondaryCta) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {chapter.cta && (
                <Link href={chapter.cta.href} className={buttonClass(chapter.cta.variant)}>
                  {chapter.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {chapter.secondaryCta && (
                <Link
                  href={chapter.secondaryCta.href}
                  className={buttonClass(chapter.secondaryCta.variant)}
                >
                  {chapter.secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <ChapterVisual chapter={chapter} priority={index === 0} />

        {children && <div className="lg:col-span-2">{children}</div>}
      </div>
    </section>
  );
}
