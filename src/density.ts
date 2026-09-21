import type { Density } from "./types.js";

export const DENSITY_FULL_MIN = 110;
export const DENSITY_COMPACT_MIN = 72;

/**
 * Measured from the card's own width, never the viewport: a Lovelace card in a
 * masonry dashboard can be 300px wide on a 2560px screen.
 */
export function densityFor(width: number, dayCount: number): Density {
  if (dayCount <= 0 || width <= 0) return "stacked";
  const perColumn = width / dayCount;
  if (perColumn >= DENSITY_FULL_MIN) return "full";
  if (perColumn >= DENSITY_COMPACT_MIN) return "compact";
  return "stacked";
}
