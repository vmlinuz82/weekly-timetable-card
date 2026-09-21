import type { Strings } from "../i18n/types.js";
import type { CardConfig, Hass } from "../types.js";

export interface PanelContext {
  config: CardConfig;
  strings: Strings;
  hass?: Hass;
  /** Always called with a NEW config object. See fire-event.ts. */
  commit: (next: CardConfig) => void;
}

export function inputValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

export function checkboxValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
