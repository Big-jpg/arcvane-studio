// app/timeline/page.tsx
import type { Metadata } from "next";

import { deployments } from "@/lib/deployments";

export const metadata: Metadata = {
  title: "Deployment Timeline — ArcVane Studio",
  description: "Visual deployment history of the ArcVane Studio project.",
  robots: { index: false, follow: false },
};

// Group deployments by month
function groupByMonth(deps: typeof deployments) {
  const months: Record<string, typeof deployments> = {};
  for (const d of deps) {
    const key = d.date.slice(0, 7); // YYYY-MM
    if (!months[key]) months[key] = [];
    months[key].push(d);
  }
  return months;
}

// Get all days in a month as a grid (starting Monday)
function getMonthGrid(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const grid: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  // Pad to complete the last week
  while (grid.length % 7 !== 0) grid.push(null);

  return grid;
}

function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

function getAuthorColor(author: string): string {
  const colors: Record<string, string> = {
    "atom-rossf": "bg-blue-500",
    "big-jpg": "bg-red-500",
    "Big-jpg": "bg-red-500",
    manus: "bg-emerald-500",
    "manus-ai": "bg-gray-400",
    "manus-agent": "bg-teal-500",
  };
  return colors[author] || "bg-purple-500";
}

export default function TimelinePage() {
  const grouped = groupByMonth(deployments);
  const sortedMonths = Object.keys(grouped).sort();

  // Build a lookup: "YYYY-MM-DD" -> deployments on that day
  const dayLookup: Record<string, typeof deployments> = {};
  for (const d of deployments) {
    if (!dayLookup[d.date]) dayLookup[d.date] = [];
    dayLookup[d.date].push(d);
  }

  // Unique authors for the legend
  const authors = [...new Set(deployments.map((d) => d.author))];

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-neutral-200 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-neutral-500">
            ArcVane Studio
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.04em] text-neutral-100 sm:text-5xl">
            Deployment Timeline
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-neutral-400">
            Every Vercel deployment since project inception. Each dot is a live
            preview you can visit.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-12 flex flex-wrap gap-4">
          {authors.map((author) => (
            <div key={author} className="flex items-center gap-2">
              <span
                className={`inline-block h-3 w-3 rounded-full ${getAuthorColor(author)}`}
              />
              <span className="text-xs text-neutral-400">{author}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full ring-2 ring-amber-400" />
            <span className="text-xs text-neutral-400">Production</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {sortedMonths.map((yearMonth) => {
            const grid = getMonthGrid(yearMonth);
            const [year, month] = yearMonth.split("-").map(Number);

            return (
              <div
                key={yearMonth}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5"
              >
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-300">
                  {formatMonth(yearMonth)}
                </h2>
                {/* Day headers */}
                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.6rem] uppercase tracking-wider text-neutral-600">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {grid.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="h-9" />;
                    }

                    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayDeps = dayLookup[dateStr];

                    if (!dayDeps || dayDeps.length === 0) {
                      return (
                        <div
                          key={dateStr}
                          className="flex h-9 items-center justify-center rounded-md text-xs text-neutral-600"
                        >
                          {day}
                        </div>
                      );
                    }

                    const hasProduction = dayDeps.some(
                      (d) => d.environment === "Production"
                    );
                    const primaryAuthor = dayDeps[0].author;

                    return (
                      <div
                        key={dateStr}
                        className="group relative flex h-9 items-center justify-center"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white transition-transform duration-200 group-hover:scale-125 ${getAuthorColor(primaryAuthor)} ${hasProduction ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-neutral-900" : ""}`}
                        >
                          {day}
                        </div>
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-72 -translate-x-1/2 rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-2xl group-hover:block">
                          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-400">
                            {new Date(dateStr).toLocaleDateString("en-AU", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <div className="space-y-2">
                            {dayDeps.map((dep, i) => (
                              <a
                                key={i}
                                href={dep.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pointer-events-auto block rounded-lg border border-neutral-800 bg-neutral-800/50 p-2 transition hover:border-neutral-600 hover:bg-neutral-800"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-block h-2 w-2 rounded-full ${getAuthorColor(dep.author)}`}
                                  />
                                  <span className="text-[0.6rem] uppercase tracking-wider text-neutral-500">
                                    {dep.environment}
                                  </span>
                                  {dep.pr && (
                                    <span className="text-[0.6rem] text-neutral-600">
                                      PR #{dep.pr}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 truncate text-xs text-neutral-200">
                                  {dep.message}
                                </p>
                                <p className="mt-0.5 truncate text-[0.6rem] text-neutral-500">
                                  {dep.branch} · {dep.commit.slice(0, 7)}
                                </p>
                              </a>
                            ))}
                          </div>
                        </div>
                        {/* Deployment count badge */}
                        {dayDeps.length > 1 && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[0.5rem] font-bold text-black">
                            {dayDeps.length}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-3xl font-medium text-neutral-100">
              {deployments.length}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Total deployments
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-3xl font-medium text-neutral-100">
              {deployments.filter((d) => d.environment === "Production").length}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Production releases
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-3xl font-medium text-neutral-100">
              {authors.length}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              Contributors
            </p>
          </div>
        </div>

        {/* Full list */}
        <div className="mt-16">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-400">
            All Deployments
          </h2>
          <div className="space-y-1">
            {deployments.map((dep, i) => (
              <a
                key={i}
                href={dep.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-lg px-3 py-2 transition hover:bg-neutral-800/50"
              >
                <span className="w-20 shrink-0 text-xs text-neutral-600">
                  {new Date(dep.date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${getAuthorColor(dep.author)}`}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-neutral-300 group-hover:text-neutral-100">
                  {dep.message}
                </span>
                <span className="hidden shrink-0 text-[0.6rem] uppercase tracking-wider text-neutral-600 sm:inline">
                  {dep.environment === "Production" ? (
                    <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-amber-400">
                      prod
                    </span>
                  ) : (
                    <span className="rounded-full border border-neutral-700 px-2 py-0.5">
                      preview
                    </span>
                  )}
                </span>
                <span className="hidden shrink-0 text-xs text-neutral-600 lg:inline">
                  {dep.branch}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 border-t border-neutral-800 pt-8 text-center">
          <p className="text-xs text-neutral-600">
            ArcVane Studio · Project inception May 2026 · Built with agents
          </p>
        </div>
      </div>
    </main>
  );
}
