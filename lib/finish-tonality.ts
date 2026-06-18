// lib/finish-tonality.ts

/**
 * Maps material finish names to ambient tonality colours.
 *
 * Each entry produces an rgba string at low opacity suitable for use as a
 * radial gradient overlay that conveys the "room temperature" of the selected
 * finish without replacing the time-state palette.
 */

export interface FinishTonality {
  /** CSS colour value (rgba at low opacity) for the gradient centre */
  colour: string;
  /** Slightly higher-opacity variant for the inner ring (optional emphasis) */
  colourInner: string;
}

const TONALITY_MAP: Record<string, FinishTonality> = {
  Sand: {
    colour: "rgba(216, 199, 170, 0.10)", // --color-sand
    colourInner: "rgba(216, 199, 170, 0.14)",
  },
  Limestone: {
    colour: "rgba(185, 173, 152, 0.09)", // --color-limestone (cool grey)
    colourInner: "rgba(185, 173, 152, 0.13)",
  },
  "Clear PLA": {
    colour: "rgba(250, 247, 240, 0.08)", // --color-off-white
    colourInner: "rgba(250, 247, 240, 0.11)",
  },
  Shell: {
    colour: "rgba(244, 239, 230, 0.09)", // --color-shell
    colourInner: "rgba(244, 239, 230, 0.13)",
  },
  "Coastal Blue": {
    colour: "rgba(158, 184, 189, 0.10)", // --color-coastal-blue
    colourInner: "rgba(158, 184, 189, 0.14)",
  },
  "Warm Amber": {
    colour: "rgba(185, 130, 75, 0.10)", // --color-warm-amber
    colourInner: "rgba(185, 130, 75, 0.15)",
  },
};

/**
 * Returns the ambient tonality for a given finish name, or null if no mapping
 * exists (in which case no overlay should be rendered).
 */
export function getFinishTonality(finish: string): FinishTonality | null {
  return TONALITY_MAP[finish] ?? null;
}
