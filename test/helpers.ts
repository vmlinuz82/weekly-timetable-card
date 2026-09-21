import { render, type TemplateResult } from "lit";
import { normaliseConfig } from "../src/config.js";
import { buildContext, type RenderContext } from "../src/renderers/context.js";
import type { Density, Hass } from "../src/types.js";

export function renderToHost(template: TemplateResult): HTMLElement {
  const host = document.createElement("div");
  render(template, host);
  return host;
}

export function textOf(host: HTMLElement, selector: string): string {
  return host.querySelector(selector)?.textContent?.trim() ?? "";
}

export function textsOf(host: HTMLElement, selector: string): string[] {
  return [...host.querySelectorAll(selector)].map(
    (node) => node.textContent?.trim() ?? "",
  );
}

export interface ContextOptions {
  raw: unknown;
  personIndex?: number;
  hass?: Hass;
  density?: Density;
  now?: Date;
}

/** Builds a context the same way the card does, from raw (un-normalised) config. */
export function makeContext(options: ContextOptions): RenderContext {
  return buildContext({
    config: normaliseConfig(options.raw),
    personIndex: options.personIndex ?? 0,
    hass: options.hass,
    density: options.density ?? "full",
    now: options.now,
  });
}

export const BG_24H: Hass = { language: "bg", locale: { time_format: "24" } };
export const EN_12H: Hass = { language: "en-US", locale: { time_format: "12" } };
