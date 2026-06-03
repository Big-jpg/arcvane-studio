// components/time-state/home-time-state-observer.tsx
"use client";

import { useEffect } from "react";

import { type TimeState, useTimeState } from "@/lib/time-state";

const timeStateKeys: TimeState[] = ["dawn", "midday", "dusk", "evening"];

function isTimeState(value: string): value is TimeState {
  return timeStateKeys.includes(value as TimeState);
}

export function HomeTimeStateObserver() {
  const { setTimeState } = useTimeState();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-time-chapter]"));

    if (sections.length === 0) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const documentElement = document.documentElement;

    function syncReducedMotionPreference() {
      documentElement.classList.toggle("time-state-reduced-motion", reducedMotionQuery.matches);
    }

    syncReducedMotionPreference();
    reducedMotionQuery.addEventListener("change", syncReducedMotionPreference);

    const visibleSections = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target);
          }
        }

        const activeEntry = Array.from(visibleSections.entries()).sort(([, firstRatio], [, secondRatio]) => {
          return secondRatio - firstRatio;
        })[0];

        const nextState = activeEntry?.[0].getAttribute("data-time-chapter");

        if (nextState && isTimeState(nextState)) {
          setTimeState(nextState);
        }
      },
      {
        root: null,
        rootMargin: "-28% 0px -42% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
      visibleSections.clear();
      reducedMotionQuery.removeEventListener("change", syncReducedMotionPreference);
      documentElement.classList.remove("time-state-reduced-motion");
    };
  }, [setTimeState]);

  return null;
}
