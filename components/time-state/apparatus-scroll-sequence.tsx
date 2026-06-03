// components/time-state/apparatus-scroll-sequence.tsx

"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  "Stand",
  "Bulb",
  "Diffuser",
  "Shade",
  "Room",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ApparatusScrollSequence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setActiveStep(steps.length - 1);
      }
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let animationFrame = 0;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      const travelled = clamp(-rect.top, 0, scrollableDistance);
      const progress = travelled / scrollableDistance;
      const nextStep = clamp(Math.floor(progress * steps.length), 0, steps.length - 1);

      setActiveStep(nextStep);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [reducedMotion]);

  const isVisible = (step: number) => reducedMotion || activeStep >= step;
  const isActive = (step: number) => !reducedMotion && activeStep === step;

  const partClassName = (step: number) => {
    const base = "transition-all duration-700 ease-out motion-reduce:transition-none";

    if (!isVisible(step)) {
      return `${base} translate-y-3 opacity-0`;
    }

    if (isActive(step)) {
      return `${base} translate-y-0 text-ts-accent opacity-100`;
    }

    return `${base} translate-y-0 text-ts-muted opacity-75`;
  };

  const annotationClassName = (step: number) => {
    const base = "transition-all duration-700 ease-out motion-reduce:transition-none";

    if (!isVisible(step)) {
      return `${base} translate-x-3 opacity-0`;
    }

    if (isActive(step)) {
      return `${base} translate-x-0 text-ts-accent opacity-100`;
    }

    return `${base} translate-x-0 text-ts-muted opacity-70`;
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="apparatus-heading"
      className="relative min-h-[360vh] bg-ts-bg px-6 text-ts-text sm:px-8 lg:px-12"
    >
      <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center py-14 sm:top-20 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-ts-accent">
              Apparatus
            </p>
            <h2
              id="apparatus-heading"
              className="text-4xl font-medium tracking-[-0.04em] text-ts-text sm:text-5xl lg:text-6xl"
            >
              A lighting system, not a single object.
            </h2>
            <p className="max-w-md text-base leading-7 text-ts-muted sm:text-lg sm:leading-8">
              A simple apparatus for shaping domestic light: parts are introduced one by
              one, then understood as an interchangeable system.
            </p>
            <div className="flex flex-wrap gap-2 pt-2" aria-label="Apparatus assembly progress">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none ${
                    activeStep >= index
                      ? "w-10 bg-ts-accent opacity-100"
                      : "w-5 bg-ts-muted opacity-30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-ts-accent/20 bg-ts-surface/70 p-4 shadow-[0_28px_95px_rgba(0,0,0,0.12)] sm:p-6 lg:p-8">
            <div className="absolute inset-x-10 bottom-8 top-16 rounded-full bg-ts-accent/10 blur-3xl" aria-hidden="true" />
            <svg
              viewBox="0 0 760 620"
              role="img"
              aria-label="Scroll-led drawing of the ArcVane stand, bulb, diffuser, shade, and room light field assembling together."
              className="relative h-auto w-full"
            >
              <defs>
                <radialGradient id="apparatusGlow" cx="50%" cy="45%" r="52%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
                  <stop offset="55%" stopColor="currentColor" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g className="text-ts-muted opacity-35" stroke="currentColor" strokeWidth="1" fill="none">
                <path d="M128 520 H632" strokeDasharray="6 10" />
                <path d="M170 120 V520" strokeDasharray="4 12" />
                <path d="M590 120 V520" strokeDasharray="4 12" />
                <path d="M170 542 H590" />
                <path d="M170 534 v16 M590 534 v16" />
              </g>

              <g className={partClassName(4)}>
                <ellipse cx="380" cy="320" rx="260" ry="230" fill="url(#apparatusGlow)" />
                <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
                  <path d="M245 170 C188 118 132 92 82 82" />
                  <path d="M515 170 C572 118 628 92 678 82" />
                  <path d="M224 414 C162 452 114 491 78 534" />
                  <path d="M536 414 C598 452 646 491 682 534" />
                  <path d="M214 245 C145 226 95 211 58 198" opacity="0.55" />
                  <path d="M546 245 C615 226 665 211 702 198" opacity="0.55" />
                </g>
              </g>

              <g className={partClassName(0)} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M380 505 V345" />
                <path d="M316 505 H444" />
                <path d="M335 532 H425" />
                <path d="M330 505 C336 522 424 522 430 505" strokeWidth="2" />
              </g>

              <g className={partClassName(1)} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <circle cx="380" cy="322" r="42" />
                <path d="M356 331 C364 303 376 303 380 331 C384 303 396 303 404 331" />
                <path d="M364 371 H396" />
                <path d="M370 384 H390" strokeWidth="2" />
                <circle cx="380" cy="322" r="68" opacity="0.18" strokeWidth="14" />
              </g>

              <g className={partClassName(2)} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.04">
                <path d="M326 260 C340 236 420 236 434 260 L412 406 C406 430 354 430 348 406 Z" />
                <path d="M342 280 C360 292 400 292 418 280" fill="none" opacity="0.7" />
                <path d="M350 394 C365 405 395 405 410 394" fill="none" opacity="0.7" />
              </g>

              <g className={partClassName(3)} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.035">
                <path d="M270 214 C304 160 456 160 490 214 L548 444 C503 478 257 478 212 444 Z" />
                <path d="M270 214 C310 247 450 247 490 214" fill="none" opacity="0.65" />
                <path d="M212 444 C270 414 490 414 548 444" fill="none" opacity="0.65" />
                <path d="M292 226 L248 437 M468 226 L512 437" fill="none" opacity="0.35" strokeWidth="1.5" />
              </g>

              <g className={partClassName(4)} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M250 232 C291 116 469 116 510 232" opacity="0.52" />
                <path d="M232 246 C278 88 482 88 528 246" opacity="0.35" />
                <path d="M286 242 C320 184 440 184 474 242" opacity="0.45" />
              </g>

              <g className={annotationClassName(0)} fontSize="18" fontStyle="italic" fill="currentColor">
                <text x="458" y="522">stand — sets posture and scale</text>
                <path d="M440 505 C468 492 482 480 494 460" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>

              <g className={annotationClassName(1)} fontSize="18" fontStyle="italic" fill="currentColor">
                <text x="438" y="320">bulb — the source</text>
                <path d="M424 320 H407" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>

              <g className={annotationClassName(2)} fontSize="18" fontStyle="italic" fill="currentColor">
                <text x="72" y="306">diffuser — softens the source</text>
                <path d="M300 302 C322 294 337 288 352 278" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>

              <g className={annotationClassName(3)} fontSize="18" fontStyle="italic" fill="currentColor">
                <text x="474" y="190">shade — shapes the edge</text>
                <path d="M460 198 C438 210 415 217 392 219" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>

              <g className={annotationClassName(4)} fontSize="18" fontStyle="italic" fill="currentColor">
                <text x="78" y="116">room — completes the light field</text>
                <path d="M246 130 C274 148 294 168 309 190" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
