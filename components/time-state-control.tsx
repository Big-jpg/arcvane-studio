// components/time-state-control.tsx
"use client";

import type { KeyboardEvent } from "react";

import { TIME_STATES, type TimeState, useTimeState } from "@/lib/time-state";
import { cn } from "@/lib/utils";

const glyphPositions: Record<TimeState, { cx: number; cy: number }> = {
  dawn: { cx: 8, cy: 19 },
  midday: { cx: 16, cy: 8 },
  dusk: { cx: 24, cy: 19 },
  evening: { cx: 16, cy: 24 },
};

const shortLabels: Record<TimeState, string> = {
  dawn: "Da",
  midday: "Mi",
  dusk: "Du",
  evening: "Ev",
};

function getAdjacentTimeState(currentTimeState: TimeState, direction: 1 | -1) {
  const currentIndex = TIME_STATES.findIndex((state) => state.key === currentTimeState);
  const nextIndex = (currentIndex + direction + TIME_STATES.length) % TIME_STATES.length;

  return TIME_STATES[nextIndex].key;
}

export function TimeStateControl() {
  const { currentTimeState, isTimeStateEnabled, selectTimeState } = useTimeState();
  const glyphPosition = glyphPositions[currentTimeState];

  if (!isTimeStateEnabled) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTimeState(getAdjacentTimeState(currentTimeState, 1));
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTimeState(getAdjacentTimeState(currentTimeState, -1));
    }
  };

  return (
    <div
      className="hidden items-center gap-2 rounded-full border border-limestone/45 bg-shell/65 px-2 py-1 shadow-[0_1px_0_rgba(32,32,29,0.04)] backdrop-blur-sm sm:flex"
      role="group"
      aria-label="Time-state navigation"
      onKeyDown={handleKeyDown}
    >
      <svg
        className="h-7 w-7 shrink-0 text-charcoal/55"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path d="M5 20H27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M7.5 20A8.5 8.5 0 0 1 24.5 20"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle
          cx={glyphPosition.cx}
          cy={glyphPosition.cy}
          r="3.2"
          className="transition-all duration-300 ease-out"
          fill="var(--accent, var(--color-warm-amber))"
        />
      </svg>

      <div className="flex items-center gap-1">
        {TIME_STATES.map((state) => {
          const isCurrent = state.key === currentTimeState;

          return (
            <button
              key={state.key}
              type="button"
              className={cn(
                "flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-amber/35 focus-visible:ring-offset-2 focus-visible:ring-offset-off-white",
                isCurrent
                  ? "text-charcoal shadow-[0_1px_3px_rgba(32,32,29,0.16)]"
                  : "text-charcoal/55 hover:bg-off-white/80 hover:text-charcoal",
              )}
              style={
                isCurrent
                  ? { backgroundColor: "var(--accent, var(--color-warm-amber))" }
                  : undefined
              }
              aria-label={`Select ${state.label} time state`}
              aria-pressed={isCurrent}
              onClick={() => selectTimeState(state.key)}
            >
              <span aria-hidden="true">{shortLabels[state.key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
