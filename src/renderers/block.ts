import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { findActivity } from "../activity.js";
import { blockForm } from "../block.js";
import { activityBorder, activityFill } from "../color.js";
import { formatTime } from "../time.js";
import type { Block } from "../types.js";
import type { RenderContext } from "./context.js";

export function blockTimeLabel(ctx: RenderContext, block: Block): string {
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
      class="block ${activity ? "" : "orphan"}"
      style=${styleMap(styles)}
      title=${activity ? nothing : ctx.strings.editor.orphanActivity}
    >
      ${time ? html`<div class="block-time">${time}</div>` : nothing}
      <div class="block-label">${activity ? activity.label : block.activity}</div>
    </div>
  `;
}
