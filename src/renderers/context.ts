import { todayKey } from "../days.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import type { Strings } from "../i18n/types.js";
import type { CardConfig, DayKey, Density, Hass, Lang } from "../types.js";

export interface RenderContext {
  config: CardConfig;
  days: DayKey[];
  strings: Strings;
  lang: Lang;
  hass?: Hass;
  density: Density;
  /** null when highlight_today is off, so renderers never re-check the flag. */
  today: DayKey | null;
}

export interface BuildContextParams {
  config: CardConfig;
  hass?: Hass;
  density: Density;
  now?: Date;
}

export function buildContext(params: BuildContextParams): RenderContext {
  const { config, hass, density, now } = params;
  const lang = resolveLang(config, hass);
  return {
    config,
    days: config.days,
    strings: stringsFor(lang),
    lang,
    hass,
    density,
    today: config.highlight_today ? todayKey(now) : null,
  };
}
