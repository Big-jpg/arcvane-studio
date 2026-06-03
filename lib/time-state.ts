// lib/time-state.ts
"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type TimeState = "dawn" | "midday" | "dusk" | "evening";

export const TIME_STATES: { key: TimeState; label: string; target: string }[] = [
  { key: "dawn", label: "Dawn", target: "chapter-dawn" },
  { key: "midday", label: "Midday", target: "chapter-midday" },
  { key: "dusk", label: "Dusk", target: "chapter-dusk" },
  { key: "evening", label: "Evening", target: "chapter-evening" },
];

type TimeStateContextValue = {
  currentTimeState: TimeState;
  isTimeStateEnabled: boolean;
  setTimeState: (key: TimeState) => void;
  selectTimeState: (key: TimeState) => void;
};

type TimeStateProviderProps = {
  children: ReactNode;
  enabled?: boolean;
};

const DEFAULT_TIME_STATE: TimeState = "dawn";

const TimeStateContext = createContext<TimeStateContextValue | null>(null);

function getTargetId(key: TimeState) {
  return TIME_STATES.find((state) => state.key === key)?.target;
}

function getScrollBehavior(): ScrollBehavior {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "auto";
  }

  return "smooth";
}

export function TimeStateProvider({ children, enabled = true }: TimeStateProviderProps) {
  const [currentTimeState, setCurrentTimeState] = useState<TimeState>(DEFAULT_TIME_STATE);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.removeAttribute("data-time");
      return;
    }

    document.documentElement.dataset.time = currentTimeState;
  }, [currentTimeState, enabled]);

  const setTimeState = useCallback(
    (key: TimeState) => {
      setCurrentTimeState(key);

      if (enabled) {
        document.documentElement.dataset.time = key;
      }
    },
    [enabled],
  );

  const selectTimeState = useCallback(
    (key: TimeState) => {
      setTimeState(key);

      if (!enabled) {
        return;
      }

      const targetId = getTargetId(key);
      const target = targetId ? document.getElementById(targetId) : null;

      target?.scrollIntoView({
        block: "start",
        behavior: getScrollBehavior(),
      });
    },
    [enabled, setTimeState],
  );

  const value = useMemo<TimeStateContextValue>(
    () => ({
      currentTimeState,
      isTimeStateEnabled: enabled,
      setTimeState,
      selectTimeState,
    }),
    [currentTimeState, enabled, selectTimeState, setTimeState],
  );

  return createElement(TimeStateContext.Provider, { value }, children);
}

export function useTimeState() {
  const context = useContext(TimeStateContext);

  if (!context) {
    throw new Error("useTimeState must be used within TimeStateProvider");
  }

  return context;
}
