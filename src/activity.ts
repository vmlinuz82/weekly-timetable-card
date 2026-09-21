import type { Activity } from "./types.js";

const SEPARATORS = /[^\p{L}\p{N}]+/gu;
const EDGE_HYPHENS = /^-+|-+$/g;

/**
 * Unicode-aware: an ASCII-only slug of "Английски" is the empty string, which
 * would collide for every Bulgarian activity.
 */
export function slugifyActivityId(label: string): string {
  return label.toLowerCase().replace(SEPARATORS, "-").replace(EDGE_HYPHENS, "");
}

/**
 * Called once, when an activity is created. Ids are never regenerated from
 * labels afterwards: doing so would orphan every block referencing an activity
 * the moment it was renamed.
 */
export function uniqueActivityId(label: string, existing: readonly string[]): string {
  const base = slugifyActivityId(label) || "activity";
  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function findActivity(
  activities: readonly Activity[],
  id: string,
): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}
