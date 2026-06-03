// components/time-state/apparatus-scroll-sequence.tsx

"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  "Stand",
  "Socket",
  "LED bulb",
  "Diffuser",
  "Accent shade",
  "Shade",
  "Shade set",
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
              viewBox="0 0 980 700"
              role="img"
              aria-label="Scroll-led drawing of the ArcVane tripod stand, socket adapter with cord, E27 LED bulb, diffuser, accent shade, outer shade, and interchangeable shade profiles assembling together."
              className="relative h-auto w-full"
            >
              <defs>
                <radialGradient id="apparatusDiffuseGlow" cx="50%" cy="42%" r="58%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="55%" stopColor="currentColor" stopOpacity="0.07" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
              </defs>

              <g className="text-ts-muted opacity-25" stroke="currentColor" strokeWidth="1" fill="none">
                <path d="M300 106 H680" strokeDasharray="2 12" />
                <path d="M300 188 H680" strokeDasharray="2 12" />
                <path d="M300 300 H680" strokeDasharray="2 12" />
                <path d="M300 430 H680" strokeDasharray="2 12" />
                <path d="M300 560 H680" strokeDasharray="2 12" />
                <path d="M352 82 V630" strokeDasharray="3 14" />
                <path d="M628 82 V630" strokeDasharray="3 14" />
                <path d="M352 650 H628" />
                <path d="M352 642 v16 M628 642 v16" />
              </g>

              <g className={partClassName(6)} transform={partTransform(6, -16)}>
                <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" fill="none" opacity="0.72">
                  <path d="M350 128 C374 112 414 107 442 119 C415 176 413 415 444 485 C407 492 373 482 351 456 C322 380 320 207 350 128 Z" strokeDasharray="6 8" />
                  <path d="M535 119 C566 100 633 112 660 139 C690 220 684 397 655 470 C626 490 574 495 541 481 C574 404 574 193 535 119 Z" strokeDasharray="4 9" />
                  <path d="M402 151 L582 151 L622 460 L362 460 Z" strokeDasharray="5 8" />
                </g>
                <g className="text-ts-accent" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5">
                  <path d="M276 474 C330 494 391 506 458 510" />
                  <path d="M704 472 C648 494 589 506 522 510" />
                </g>
              </g>

              <g className={partClassName(3)} transform={partTransform(3, -18)}>
                <ellipse cx="490" cy="330" rx="206" ry="235" fill="url(#apparatusDiffuseGlow)" />
                <g stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" fill="none">
                  <path d="M438 296 C386 252 334 224 282 211" opacity="0.36" />
                  <path d="M542 296 C594 252 646 224 698 211" opacity="0.36" />
                  <path d="M430 372 C360 373 298 363 244 342" opacity="0.3" />
                  <path d="M550 372 C620 373 682 363 736 342" opacity="0.3" />
                  <path d="M440 438 C394 474 348 504 302 528" opacity="0.25" />
                  <path d="M540 438 C586 474 632 504 678 528" opacity="0.25" />
                </g>
              </g>

              <g
                className={partClassName(0)}
                transform={partTransform(0, 30)}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <ellipse cx="490" cy="520" rx="67" ry="15" fill="currentColor" fillOpacity="0.045" />
                <path d="M490 526 L342 662" />
                <path d="M490 526 L638 662" />
                <path d="M490 526 L490 668" />
                <path d="M394 662 H586" opacity="0.6" />
                <circle cx="490" cy="520" r="17" fill="currentColor" fillOpacity="0.08" />
                <path d="M434 536 C454 549 526 549 546 536" strokeWidth="1.5" opacity="0.65" />
              </g>

              <g
                className={partClassName(1)}
                transform={partTransform(1, 18)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <path d="M468 448 Q468 430 486 430 H494 Q512 430 512 448 V506 H468 Z" fill="currentColor" fillOpacity="0.035" />
                <ellipse cx="490" cy="448" rx="22" ry="7" />
                <path d="M475 466 H505" opacity="0.55" />
                <path d="M475 480 H505" opacity="0.55" />
                <path d="M468 492 C428 494 389 500 354 510 C326 518 299 526 270 528" />
                <rect x="230" y="515" width="45" height="18" rx="9" fill="currentColor" fillOpacity="0.035" />
                <path d="M230 524 C205 524 187 530 166 545" />
                <path d="M156 539 L169 551" />
                <path d="M150 548 L163 560" />
              </g>

              <g
                className={partClassName(2)}
                transform={partTransform(2, -18)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.025"
              >
                <path d="M458 290 C458 268 474 254 490 254 C506 254 522 268 522 290 V412 C522 430 508 442 490 442 C472 442 458 430 458 412 Z" />
                <path d="M462 304 H518" fill="none" opacity="0.55" />
                <path d="M462 326 H518" fill="none" opacity="0.55" />
                <path d="M462 348 H518" fill="none" opacity="0.55" />
                <path d="M462 370 H518" fill="none" opacity="0.55" />
                <path d="M462 392 H518" fill="none" opacity="0.55" />
                <path d="M472 260 H508" fill="none" opacity="0.45" />
                <path d="M469 423 H511" fill="none" opacity="0.6" />
                <path d="M474 442 V452 H506 V442" fill="none" />
                <circle cx="476" cy="316" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
                <circle cx="504" cy="316" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
                <circle cx="476" cy="360" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
                <circle cx="504" cy="360" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
                <circle cx="476" cy="404" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
                <circle cx="504" cy="404" r="2.2" fill="currentColor" fillOpacity="0.32" stroke="none" />
              </g>

              <g
                className={partClassName(3)}
                transform={partTransform(3, -24)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.022"
              >
                <path d="M426 238 C448 222 532 222 554 238 C562 294 556 385 534 446 C518 465 462 465 446 446 C424 385 418 294 426 238 Z" />
                <path d="M441 264 C463 277 517 277 539 264" fill="none" opacity="0.5" />
                <path d="M446 426 C466 438 514 438 534 426" fill="none" opacity="0.5" />
              </g>

              <g
                className={partClassName(4)}
                transform={partTransform(4, -28)}
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.024"
              >
                <path d="M396 192 C426 170 554 170 584 192 C604 255 601 392 570 464 C546 492 434 492 410 464 C379 392 376 255 396 192 Z" />
                <path d="M404 216 C435 233 545 233 576 216" fill="none" opacity="0.55" />
                <path d="M398 320 C432 341 548 341 582 320" fill="none" opacity="0.45" />
                <path d="M410 448 C440 466 540 466 570 448" fill="none" opacity="0.55" />
              </g>

              <g
                className={partClassName(5)}
                transform={partTransform(5, -34)}
                stroke="currentColor"
                strokeWidth="2.35"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.03"
              >
                <path d="M368 104 C400 84 580 84 612 104" fill="none" opacity="0.52" />
                <ellipse cx="490" cy="115" rx="96" ry="12" fill="currentColor" fillOpacity="0.035" />
                <path d="M369 138 C402 112 578 112 611 138" fill="none" opacity="0.72" />
                <path d="M370 138 C334 202 337 393 374 495 C405 534 575 534 606 495 C643 393 646 202 610 138 C574 160 406 160 370 138 Z" />
                <path d="M370 190 C410 212 570 212 610 190" fill="none" opacity="0.68" />
                <path d="M354 248 C400 274 580 274 626 248" fill="none" opacity="0.68" />
                <path d="M348 310 C398 338 582 338 632 310" fill="none" opacity="0.68" />
                <path d="M354 374 C400 400 580 400 626 374" fill="none" opacity="0.68" />
                <path d="M374 486 C414 508 566 508 606 486" fill="none" opacity="0.68" />
                <path d="M624 172 C646 222 650 412 620 484" fill="none" strokeDasharray="8 9" opacity="0.35" />
                <path d="M356 172 C334 222 330 412 360 484" fill="none" strokeDasharray="8 9" opacity="0.35" />
              </g>

              <g className="text-ts-muted" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" strokeDasharray="4 7">
                <g className={annotationClassName(6)}>
                  <path d="M300 64 C340 86 386 104 430 128" />
                </g>
                <g className={annotationClassName(5)}>
                  <path d="M744 134 C692 143 650 166 610 202" />
                </g>
                <g className={annotationClassName(4)}>
                  <path d="M734 286 C672 286 618 304 578 334" />
                </g>
                <g className={annotationClassName(3)}>
                  <path d="M260 340 C318 331 373 302 426 258" />
                </g>
                <g className={annotationClassName(2)}>
                  <path d="M734 420 C650 411 584 394 522 368" />
                </g>
                <g className={annotationClassName(1)}>
                  <path d="M244 560 C304 541 378 516 468 486" />
                </g>
                <g className={annotationClassName(0)}>
                  <path d="M694 632 C632 612 581 582 546 536" />
                </g>
              </g>

              <g fontSize="16" fontStyle="italic" fill="currentColor">
                <g className={annotationClassName(6)}>
                  <text x="120" y="58">alternate profiles — nested, swapped, layered</text>
                </g>
                <g className={annotationClassName(5)}>
                  <text x="758" y="134">shade — interchangeable, additive</text>
                </g>
                <g className={annotationClassName(4)}>
                  <text x="748" y="290">accent — shapes the inner glow</text>
                </g>
                <g className={annotationClassName(3)}>
                  <text x="46" y="344">diffuser — softens the source</text>
                </g>
                <g className={annotationClassName(2)}>
                  <text x="748" y="424">LED bulb — 6000K, high CRI, low heat</text>
                </g>
                <g className={annotationClassName(1)}>
                  <text x="42" y="564">socket adapter — AU plug, inline switch</text>
                </g>
                <g className={annotationClassName(0)}>
                  <text x="708" y="638">stand — the base</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
