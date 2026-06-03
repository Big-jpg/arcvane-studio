// components/time-state-provider.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TimeStateProvider as TimeStateContextProvider } from "@/lib/time-state";

type TimeStateProviderProps = {
  children: ReactNode;
};

export function TimeStateProvider({ children }: TimeStateProviderProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return <TimeStateContextProvider enabled={!isAdminRoute}>{children}</TimeStateContextProvider>;
}
