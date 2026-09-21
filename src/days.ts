import { DAY_KEYS } from "./types.js";
import type { CardConfig, DayKey, FirstWeekdaySetting, Hass, Person } from "./types.js";

export function isDayKey(value: unknown): value is DayKey {
  return typeof value === "string" && (DAY_KEYS as readonly string[]).includes(value);
}

export function normaliseDays(value: unknown, fallback: DayKey[]): DayKey[] {
  if (!Array.isArray(value)) return [...fallback];
  const out: DayKey[] = [];
  for (const entry of value) {
    if (isDayKey(entry) && !out.includes(entry)) out.push(entry);
  }
  return out.length > 0 ? out : [...fallback];
}

export function effectiveDays(
  config: Pick<CardConfig, "days">,
  person: Pick<Person, "days">,
): DayKey[] {
  return person.days && person.days.length > 0 ? person.days : config.days;
}

export function todayKey(now: Date = new Date()): DayKey {
  // Date#getDay is 0 for Sunday; DAY_KEYS starts at Monday.
  return DAY_KEYS[(now.getDay() + 6) % 7]!;
}

const FIRST_WEEKDAY_INDEX: Record<Exclude<FirstWeekdaySetting, "language">, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function daysFromFirstWeekday(hass?: Hass): DayKey[] {
  const setting = hass?.locale?.first_weekday;
  let offset = 0;
  if (setting && setting !== "language") {
    offset = FIRST_WEEKDAY_INDEX[setting];
  } else if (setting === "language") {
    offset = usesSundayFirst(hass?.language) ? 6 : 0;
  }
  return DAY_KEYS.map((_, i) => DAY_KEYS[(i + offset) % 7]!);
}

function usesSundayFirst(language?: string): boolean {
  if (!language) return false;
  const tag = language.toLowerCase();
  return tag === "en-us" || tag.startsWith("en-us");
}

/**
 * Inserts at the position implied by `order` while leaving the existing
 * relative order alone, so an author who hand-ordered days in YAML does not
 * have that order re-sorted by a click in the editor.
 */
export function toggleDayList(days: DayKey[], day: DayKey, order: DayKey[]): DayKey[] {
  if (days.includes(day)) {
    if (days.length <= 1) return days;
    return days.filter((entry) => entry !== day);
  }
  const rank = (entry: DayKey) => order.indexOf(entry);
  const position = days.findIndex((entry) => rank(entry) > rank(day));
  const next = [...days];
  next.splice(position === -1 ? next.length : position, 0, day);
  return next;
}
