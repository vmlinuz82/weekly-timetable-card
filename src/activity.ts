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

/**
 * `normaliseActivity` already falls back to the id for a blank title, but it
 * runs only at config-parse time and the editor renders its own un-normalised
 * config. Without this at the presentation layer, clearing a title leaves the
 * preview chip, the palette chip and every block-row option blank — during
 * exactly the session in which the author is trying to fix it. Never use it for
 * an `<input>` value: those must show the real stored string, empty or not.
 */
export function activityTitle(activity: Activity): string {
  return activity.title.trim() || activity.id;
}

export function findActivity(
  activities: readonly Activity[],
  id: string,
): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}
