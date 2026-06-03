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
    const base = "transition-all duration-900 ease-out motion-reduce:transition-none";

    if (!isVisible(step)) {
      return `${base} opacity-0`;
    }

    if (isActive(step)) {
      return `${base} text-ts-accent opacity-100`;
    }

    return `${base} text-ts-muted opacity-75`;
  };

  const annotationClassName = (step: number) => {
    const base = "transition-all duration-700 ease-out motion-reduce:transition-none";

    if (!isVisible(step)) {
      return `${base} opacity-0`;
    }

    if (isActive(step)) {
      return `${base} text-ts-accent opacity-100`;
    }

    return `${base} text-ts-muted opacity-75`;
  };

  const partTransform = (step: number, hiddenOffset: number) => {
    if (isVisible(step)) {
      return "translate(0 0)";
    }

    return `translate(0 ${hiddenOffset})`;
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="apparatus-heading"
      className="relative min-h-[460vh] bg-ts-bg px-6 text-ts-text sm:px-8 lg:px-12"
    >
      <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center py-14 sm:top-20 lg:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
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
                  className={`h-1 rounded-full transition-all duration-500 motion-reduce:transition-none ${
                    activeStep >= index
                      ? "w-8 bg-ts-accent opacity-100"
                      : "w-4 bg-ts-muted opacity-30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-ts-accent/20 bg-ts-surface/70 p-3 shadow-[0_28px_95px_rgba(0,0,0,0.12)] sm:p-5 lg:p-7">
            <div className="absolute inset-x-12 bottom-8 top-16 rounded-full bg-ts-accent/10 blur-3xl" aria-hidden="true" />
            <svg
              viewBox="0 0 920 660"
              role="img"
              aria-label="Scroll-led drawing of the ArcVane tripod stand, LED fitting, diffuser, ribbed shade, locking ring, and room light field assembling together."
              className="relative h-auto w-full"
            >
              <defs>
                <radialGradient id="apparatusGlow" cx="50%" cy="42%" r="58%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="55%" stopColor="currentColor" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g className="text-ts-muted opacity-25" stroke="currentColor" strokeWidth="1" fill="none">
                <path d="M290 114 H628" strokeDasharray="2 12" />
                <path d="M290 186 H628" strokeDasharray="2 12" />
                <path d="M290 306 H628" strokeDasharray="2 12" />
                <path d="M290 438 H628" strokeDasharray="2 12" />
                <path d="M290 566 H628" strokeDasharray="2 12" />
                <path d="M332 92 V586" strokeDasharray="3 14" />
                <path d="M586 92 V586" strokeDasharray="3 14" />
                <path d="M332 610 H586" />
                <path d="M332 602 v16 M586 602 v16" />
              </g>

              <g className={partClassName(4)} transform={partTransform(4, -18)}>
                <ellipse cx="460" cy="330" rx="246" ry="260" fill="url(#apparatusGlow)" />
                <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" fill="none">
                  <path d="M402 222 C346 156 292 117 237 99" opacity="0.58" />
                  <path d="M518 222 C574 156 628 117 683 99" opacity="0.58" />
                  <path d="M378 352 C292 342 222 323 168 294" opacity="0.48" />
                  <path d="M542 352 C628 342 698 323 752 294" opacity="0.48" />
                  <path d="M386 448 C326 497 270 536 218 565" opacity="0.42" />
                  <path d="M534 448 C594 497 650 536 702 565" opacity="0.42" />
                </g>
              </g>

              <g
                className={partClassName(0)}
                transform={partTransform(0, 28)}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <path d="M460 438 L334 586" />
                <path d="M460 438 L586 586" />
                <path d="M460 438 L460 596" />
                <path d="M407 586 H513" opacity="0.65" />
                <ellipse cx="460" cy="430" rx="48" ry="10" fill="currentColor" fillOpacity="0.04" />
                <circle cx="460" cy="430" r="15" fill="currentColor" fillOpacity="0.08" />
                <path d="M418 444 C430 454 490 454 502 444" strokeWidth="1.5" opacity="0.65" />
              </g>

              <g
                className={partClassName(1)}
                transform={partTransform(1, -18)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <path d="M434 372 Q434 356 450 356 H470 Q486 356 486 372 V422 H434 Z" fill="currentColor" fillOpacity="0.035" />
                <path d="M444 382 H476" opacity="0.55" />
                <path d="M446 394 H474" opacity="0.55" />
                <path d="M451 356 C453 338 467 338 469 356" />
                <circle cx="460" cy="352" r="54" opacity="0.13" strokeWidth="12" />
              </g>

              <g
                className={partClassName(2)}
                transform={partTransform(2, -24)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.025"
              >
                <path d="M392 262 C414 244 506 244 528 262 C522 308 511 365 498 414 C486 433 434 433 422 414 C409 365 398 308 392 262 Z" />
                <path d="M408 286 C430 300 490 300 512 286" fill="none" opacity="0.55" />
                <path d="M416 396 C435 408 485 408 504 396" fill="none" opacity="0.55" />
              </g>

              <g
                className={partClassName(3)}
                transform={partTransform(3, -34)}
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.03"
              >
                <path d="M370 118 C400 98 520 98 550 118" fill="none" opacity="0.55" />
                <ellipse cx="460" cy="126" rx="89" ry="12" fill="currentColor" fillOpacity="0.035" />
                <path d="M375 144 C394 124 526 124 545 144" fill="none" opacity="0.72" />
                <path d="M376 144 C338 194 339 360 374 430 C397 462 523 462 546 430 C581 360 582 194 544 144 C516 162 404 162 376 144 Z" />
                <path d="M374 196 C404 214 516 214 546 196" fill="none" opacity="0.7" />
                <path d="M357 250 C392 273 528 273 563 250" fill="none" opacity="0.7" />
                <path d="M350 306 C388 331 532 331 570 306" fill="none" opacity="0.7" />
                <path d="M356 364 C390 386 530 386 564 364" fill="none" opacity="0.7" />
                <path d="M376 420 C406 438 514 438 544 420" fill="none" opacity="0.7" />
                <path d="M376 144 C410 162 510 162 544 144" fill="none" opacity="0.5" />
                <ellipse cx="460" cy="116" rx="72" ry="7" fill="none" strokeWidth="1.7" />
              </g>

              <g className="text-ts-muted" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" strokeDasharray="4 7">
                <g className={annotationClassName(4)}>
                  <path d="M460 62 C460 82 460 96 460 110" />
                </g>
                <g className={annotationClassName(3)}>
                  <path d="M664 154 C626 165 590 184 556 212" />
                </g>
                <g className={annotationClassName(1)}>
                  <path d="M664 348 C598 348 535 365 486 382" />
                </g>
                <g className={annotationClassName(2)}>
                  <path d="M250 336 C301 327 350 304 397 276" />
                </g>
                <g className={annotationClassName(0)}>
                  <path d="M642 574 C591 559 548 536 514 503" />
                </g>
              </g>

              <g fontSize="17" fontStyle="italic" fill="currentColor">
                <g className={annotationClassName(4)}>
                  <text x="338" y="48">room — completes the light field</text>
                </g>
                <g className={annotationClassName(3)}>
                  <text x="678" y="150">shade — shapes the edge</text>
                </g>
                <g className={annotationClassName(1)}>
                  <text x="678" y="352">bulb — the source</text>
                </g>
                <g className={annotationClassName(2)}>
                  <text x="34" y="340">diffuser — softens the source</text>
                </g>
                <g className={annotationClassName(0)}>
                  <text x="656" y="580">stand — sets posture and scale</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
