import type { CardConfig, Hass, Lang } from "../types.js";
import { bg } from "./bg.js";
import { en } from "./en.js";
import type { Strings } from "./types.js";

export type { DayNames, EditorStrings, Strings } from "./types.js";
export { bg } from "./bg.js";
export { en } from "./en.js";

export function resolveLang(
  config: Pick<CardConfig, "language">,
  hass?: Hass,
): Lang {
  if (config.language === "en" || config.language === "bg") return config.language;
  return (hass?.language ?? "en").toLowerCase().startsWith("bg") ? "bg" : "en";
}

export function stringsFor(lang: Lang): Strings {
  return lang === "bg" ? bg : en;
}
