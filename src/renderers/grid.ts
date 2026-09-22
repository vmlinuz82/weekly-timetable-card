import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { gridPlacement, type GridPlacement } from "../grid-placement.js";
import { formatTime } from "../time.js";
import type { DayKey } from "../types.js";
import { renderBlock } from "./block.js";
import { dayHeading } from "./blocks.js";
import type { RenderContext } from "./context.js";

export function renderGrid(ctx: RenderContext): TemplateResult {
  const slots = [...(ctx.config.slots ?? [])].sort((a, b) => a.slot - b.slot);

  const placements = new Map<DayKey, GridPlacement>();
  for (const day of ctx.days) {
    placements.set(day, gridPlacement(slots, ctx.config.schedule[day] ?? []));
  }

  const hasLoose = ctx.days.some((day) => placements.get(day)!.loose.length > 0);
  const sizing = styleMap({ "--wtc-day-count": String(ctx.days.length) });

  const dayHeadCells = ctx.days.map(
    (day) => html`<div class=${ctx.today === day ? "grid-head today" : "grid-head"}>${dayHeading(ctx, day)}</div>`,
  );

  // `.grid-wrap` owns the shared column tracks (day-count sized from its own
  // `--wtc-day-count`), and `.strip`/`.grid`/`.grid-heads` each opt into those
  // same tracks via `grid-template-columns: subgrid` rather than sizing their
  // own max-content column independently — which is what previously let the
  // two grids' day columns drift out of alignment. The per-slot row below is
  // built with flatMap into one array fed straight to `.grid`'s own
  // children — rather than a per-slot sub-template nesting a day-cells
  // array inside it — so `.slot-label` and each `.grid-cell` land as direct
  // children of `.grid`, which subgrid requires to place them into columns
  // correctly.
  return html`
    <div class="grid-wrap" style=${sizing}>
      ${slots.length === 0
        ? html`
            <div class="grid-heads">
              <div class="grid-corner"></div>
              ${dayHeadCells}
            </div>
          `
        : nothing}
      ${hasLoose
        ? html`
            <div class="strip">
              <div class="strip-label"></div>
              ${ctx.days.map(
                (day) => html`
                  <div class="strip-cell">
                    ${placements.get(day)!.loose.map((block) => renderBlock(ctx, block))}
                  </div>
                `,
              )}
            </div>
          `
        : nothing}
      ${slots.length === 0
        ? html`<div class="no-slots">${ctx.strings.editor.noSlots}</div>`
        : html`
            <div class="grid">
              <div class="grid-corner"></div>
              ${dayHeadCells}
              ${slots.flatMap((slot) => [
                html`
                  <div class="slot-label">
                    ${ctx.strings.range(
                      formatTime(slot.start, ctx.hass, ctx.lang),
                      formatTime(slot.end, ctx.hass, ctx.lang),
                    )}
                  </div>
                `,
                ...ctx.days.map(
                  (day) => html`
                    <div class=${ctx.today === day ? "grid-cell today" : "grid-cell"}>
                      ${(placements.get(day)!.bySlot.get(slot.slot) ?? []).map((block) =>
                        renderBlock(ctx, block),
                      )}
                    </div>
                  `,
                ),
              ])}
            </div>
          `}
    </div>
  `;
}
