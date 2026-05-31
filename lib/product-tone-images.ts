export type ToneImageMode = "unlit" | "illuminated";

export type ToneImagePair = {
  tone: string;
  toneIndex: number;
  unlit: string | null;
  illuminated: string | null;
  complete: boolean;
};

export const TONE_IMAGE_MODE_LABELS: Record<ToneImageMode, string> = {
  unlit: "No light",
  illuminated: "Illuminated",
};

export function toneImageRequirement(tones: string[]): number {
  return tones.length * 2;
}

export function buildToneImagePairs(tones: string[], images: string[]): ToneImagePair[] {
  return tones.map((tone, toneIndex) => {
    const offset = toneIndex * 2;
    const unlit = images[offset] ?? null;
    const illuminated = images[offset + 1] ?? null;

    return {
      tone,
      toneIndex,
      unlit,
      illuminated,
      complete: Boolean(unlit && illuminated),
    };
  });
}

export function toneImageForMode(
  pair: ToneImagePair | null | undefined,
  mode: ToneImageMode,
  fallback: string,
): string {
  if (!pair) return fallback;

  if (mode === "unlit") {
    return pair.unlit ?? pair.illuminated ?? fallback;
  }

  return pair.illuminated ?? pair.unlit ?? fallback;
}

export function preferredToneImage(
  pair: ToneImagePair | null | undefined,
  fallback: string,
): string {
  return toneImageForMode(pair, "illuminated", fallback);
}
