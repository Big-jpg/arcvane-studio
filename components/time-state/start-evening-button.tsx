// components/time-state/start-evening-button.tsx
"use client";

import { useTimeState } from "@/lib/time-state";

export function StartEveningButton() {
  const { selectTimeState } = useTimeState();

  return (
    <button
      type="button"
      onClick={() => selectTimeState("evening")}
      className="inline-flex items-center justify-center rounded-full border border-ts-accent/40 px-6 py-3 text-sm font-semibold text-ts-text transition duration-300 hover:-translate-y-0.5 hover:border-ts-text hover:bg-ts-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ts-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      Start with Evening
    </button>
  );
}
