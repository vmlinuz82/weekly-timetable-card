import { effectiveDays, todayKey } from "../days.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import type { Strings } from "../i18n/types.js";
import type { CardConfig, DayKey, Density, Hass, Lang, Person } from "../types.js";

export interface RenderContext {
  config: CardConfig;
  person: Person;
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
  personIndex: number;
  hass?: Hass;
  density: Density;
  now?: Date;
}

export function buildContext(params: BuildContextParams): RenderContext {
  const { config, hass, density, now } = params;
  const index = Math.min(Math.max(params.personIndex, 0), config.people.length - 1);
  const person = config.people[index]!;
  const lang = resolveLang(config, hass);
  return {
    config,
    person,
    days: effectiveDays(config, person),
    strings: stringsFor(lang),
    lang,
    hass,
    density,
    today: config.highlight_today ? todayKey(now) : null,
  };
}
