"use client";

import { useEffect, useMemo, useState } from "react";

import type { AtelierStoryChapter } from "@/lib/atelier-story";
import { cn } from "@/lib/utils";

type StoryNavigationChapter = Pick<AtelierStoryChapter, "id" | "navLabel" | "title">;

function chapterNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function StoryNavigation({ chapters }: { chapters: StoryNavigationChapter[] }) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "light");

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        chapters.findIndex((chapter) => chapter.id === activeId),
      ),
    [activeId, chapters],
  );
  const activeChapter = chapters[activeIndex] ?? chapters[0];

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id as StoryNavigationChapter["id"]);
        }
      },
      {
        rootMargin: "-32% 0px -46% 0px",
        threshold: [0, 0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    const scrollToHash = (behavior: ScrollBehavior) => {
      const id = window.location.hash.slice(1);
      const chapter = chapters.find((item) => item.id === id);
      const target = chapter ? document.getElementById(chapter.id) : null;

      if (!target || !chapter) return;

      target.scrollIntoView({ block: "start", behavior });
      setActiveId(chapter.id);
    };

    const firstFrame = window.requestAnimationFrame(() => scrollToHash("auto"));
    const settleTimer = window.setTimeout(() => scrollToHash("auto"), 350);
    const handleHashChange = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollToHash(reducedMotion ? "auto" : "smooth");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [chapters]);

  return (
    <>
      <nav
        aria-label="Homepage chapters"
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-full border border-limestone/45 bg-off-white/86 px-3 py-4 shadow-sm shadow-charcoal/10 backdrop-blur min-[1700px]:block"
      >
        <ol className="space-y-3 border-l border-charcoal/15 pl-3">
          {chapters.map((chapter, index) => {
            const active = chapter.id === activeId;

            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  aria-current={active ? "step" : undefined}
                  className="group grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-2 text-left"
                >
                  <span
                    className={cn(
                      "relative -ml-[1.05rem] flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                      active
                        ? "border-warm-amber bg-warm-amber text-charcoal"
                        : "border-charcoal/20 bg-shell/90 text-charcoal/45 group-hover:border-warm-amber/70",
                    )}
                  >
                    {chapterNumber(index)}
                  </span>
                  <span
                    className={cn(
                      "max-w-28 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
                      active ? "text-charcoal" : "text-charcoal/42 group-hover:text-charcoal/75",
                    )}
                  >
                    {chapter.navLabel}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {activeChapter && (
        <nav
          aria-label="Current homepage chapter"
          className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-limestone/55 bg-off-white/92 px-3 py-2 shadow-sm shadow-charcoal/10 backdrop-blur sm:inset-x-auto sm:left-1/2 sm:w-[min(36rem,calc(100vw-2rem))] sm:-translate-x-1/2 min-[1700px]:hidden"
        >
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">
              <span className="text-weathered-post">{chapterNumber(activeIndex)}</span>
              <span className="mx-2 text-limestone">/</span>
              <span>{activeChapter.navLabel}</span>
            </p>
            <div className="flex shrink-0 gap-1">
              {chapters.map((chapter, index) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  aria-label={`Go to chapter ${chapterNumber(index)}, ${chapter.navLabel}`}
                  className="flex h-7 w-5 items-center justify-center rounded-full"
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      chapter.id === activeId ? "bg-warm-amber" : "bg-limestone/60",
                    )}
                  />
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
