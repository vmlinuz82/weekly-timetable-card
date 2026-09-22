import { html, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import type { DayKey } from "../types.js";
import { renderBlock } from "./block.js";
import type { RenderContext } from "./context.js";

/**
 * Short names exist to buy horizontal room. Stacked gives each day a full row,
 * so it goes back to the full name.
 */
export function dayHeading(ctx: RenderContext, day: DayKey): string {
  const names = ctx.strings.days[day];
  return ctx.density === "compact" ? names.short : names.full;
}

export function renderBlocks(ctx: RenderContext): TemplateResult {
  return html`
    <div class="week" style=${styleMap({ "--wtc-day-count": String(ctx.days.length) })}>
      ${ctx.days.map((day) => renderDayColumn(ctx, day))}
    </div>
  `;
}

function renderDayColumn(ctx: RenderContext, day: DayKey): TemplateResult {
  const blocks = ctx.person.schedule[day] ?? [];
  return html`
    <section class=${ctx.today === day ? "day today" : "day"}>
      <header class="day-head">${dayHeading(ctx, day)}</header>
      <div class="day-body">
        ${blocks.length > 0
          ? blocks.map((block) => renderBlock(ctx, block))
          : html`<div class="empty">${ctx.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `;
}
