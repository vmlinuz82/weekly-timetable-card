import type { Density } from "./types.js";

/**
 * Recalibrated for the two-column block: 110 was measured when a block was a
 * single centred column and the title had the block's whole width. With the
 * time column beside it, a 129px column leaves the title roughly 35px, which
 * shreds it into two or three characters per line. Below 150 the compact tier
 * stacks the block internally instead, giving the title the full block width.
 */
export const DENSITY_FULL_MIN = 150;
export const DENSITY_COMPACT_MIN = 110;

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
