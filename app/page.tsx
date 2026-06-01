import type { Metadata } from "next";

import { CollectionFeature } from "@/components/atelier/collection-feature";
import { LightStudy } from "@/components/atelier/light-study";
import { StoryNavigation } from "@/components/atelier/story-navigation";
import { StoryPanel } from "@/components/atelier/story-panel";
import { atelierChapters } from "@/lib/atelier-story";
import { getProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "ArcVane Studio",
  description:
    "A Western Australian lighting atelier exploring coastal light, translucent PLA, and a modular E27 shade language.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <StoryNavigation chapters={atelierChapters} />
      {atelierChapters.map((chapter, index) => {
        const nextChapter = atelierChapters[index + 1];
        const studies = chapter.studies ? (
          <LightStudy studies={chapter.studies} treatment={chapter.treatment} />
        ) : null;

        if (chapter.id === "collection") {
          return (
            <StoryPanel key={chapter.id} chapter={chapter} index={index} nextChapter={nextChapter}>
              <CollectionFeature products={products} />
            </StoryPanel>
          );
        }

        return (
          <StoryPanel key={chapter.id} chapter={chapter} index={index} nextChapter={nextChapter}>
            {studies}
          </StoryPanel>
        );
      })}
    </>
  );
}
