import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { findActivity } from "../activity.js";
import { blockForm } from "../block.js";
import { activityBorder, activityFill } from "../color.js";
import { formatTime } from "../time.js";
import type { Strings } from "../i18n/types.js";
import type { Block, Hass, Lang } from "../types.js";
import type { RenderContext } from "./context.js";

/**
 * Everything needed to word a block's time line. Narrower than RenderContext so
 * the editor can call this too — the mapping from a block's times to its wording
 * must exist in exactly one place, or the two drift (and once did: the editor's
 * copy dropped the until/after wording entirely, leaving a start-only and an
 * end-only block indistinguishable).
 */
export interface TimeLabelContext {
  strings: Strings;
  hass?: Hass;
  lang: Lang;
}

export function blockTimeLabel(ctx: TimeLabelContext, block: Block): string {
  const fmt = (value: string) => formatTime(value, ctx.hass, ctx.lang);
  switch (blockForm(block)) {
    case "range":
      return ctx.strings.range(fmt(block.start!), fmt(block.end!));
    case "until":
      return ctx.strings.until(fmt(block.end!));
    case "after":
      return ctx.strings.after(fmt(block.start!));
    case "bare":
      return "";
  }
}

/**
 * The two-line form for the card's left-hand time column. `blockTimeLabel`
 * above keeps the one-line wording for the editor, which has no room to stack.
 * Both switch on the same `blockForm()` result: the form is derived in exactly
 * one place, and only the presentation differs. Letting the two drift is a real
 * failure mode — the editor's copy once dropped the until/after wording
 * entirely, making an end-only and a start-only block indistinguishable.
 */
export function blockTimeLines(
  ctx: TimeLabelContext,
  block: Block,
): { top: string; bottom: string } | null {
  const fmt = (value: string) => formatTime(value, ctx.hass, ctx.lang);
  switch (blockForm(block)) {
    case "range":
      return { top: fmt(block.start!), bottom: fmt(block.end!) };
    case "until":
      return { top: ctx.strings.untilWord, bottom: fmt(block.end!) };
    case "after":
      return { top: ctx.strings.afterWord, bottom: fmt(block.start!) };
    case "bare":
      return null;
  }
}

export function renderBlock(ctx: RenderContext, block: Block): TemplateResult {
  const activity = findActivity(ctx.config.activities, block.activity);
  const time = blockTimeLabel(ctx, block);
  const styles = activity
    ? {
        "--wtc-block-fill": activityFill(activity.color),
        "--wtc-block-border": activityBorder(activity.color),
      }
    : {};

  return html`
    <div
      class=${activity ? "block" : "block orphan"}
      style=${styleMap(styles)}
      title=${activity ? nothing : ctx.strings.editor.orphanActivity}
    >
      ${time ? html`<div class="block-time">${time}</div>` : nothing}
      <div class="block-label">${activity ? activity.title : block.activity}</div>
    </div>
  `;
}
