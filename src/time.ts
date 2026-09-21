import type { Hass, Lang } from "./types.js";

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

export function localeUsesHour12(locale: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat(locale, { hour: "numeric" }).formatToParts(
      new Date(2020, 0, 1, 13, 0),
    );
    return parts.some((part) => part.type === "dayPeriod");
  } catch {
    return false;
  }
}

// A bare Lang code ("en") is ambiguous to Intl and, on this ICU, resolves to
// US-style hour12 defaults. Map it to a concrete region so the fallback (no
// hass.language available) reflects this app's actual default: 24-hour.
const LANG_LOCALE: Record<Lang, string> = { en: "en-GB", bg: "bg" };

function localeFor(hass: Hass | undefined, lang: Lang): string {
  return hass?.language ?? LANG_LOCALE[lang];
}

export function resolveHour12(hass: Hass | undefined, lang: Lang): boolean {
  const setting = hass?.locale?.time_format;
  if (setting === "12") return true;
  if (setting === "24") return false;
  if (setting === "system") {
    const system = typeof navigator === "undefined" ? undefined : navigator.language;
    return localeUsesHour12(system ?? localeFor(hass, lang));
  }
  return localeUsesHour12(localeFor(hass, lang));
}

/**
 * The 24-hour path deliberately does not go through Intl: some locales render
 * midnight as "24:00" there, and we already hold the exact hour and minute.
 */
export function formatTime(value: string, hass: Hass | undefined, lang: Lang): string {
  const trimmed = value.trim();
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) return trimmed;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return trimmed;

  if (!resolveHour12(hass, lang)) {
    return `${String(hours).padStart(2, "0")}:${match[2]}`;
  }

  try {
    return new Intl.DateTimeFormat(localeFor(hass, lang), {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(2020, 0, 1, hours, minutes));
  } catch {
    return trimmed;
  }
}

const MINUTES_PER_DAY = 24 * 60;

/** Wraps around midnight in both directions. An unparseable value is returned unchanged. */
export function addMinutes(time: string, minutes: number): string {
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) return time;
  const base = Number(match[1]) * 60 + Number(match[2]);
  const total = ((base + minutes) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(total / 60);
  return `${String(hours).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
