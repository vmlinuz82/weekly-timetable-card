import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { gridPlacement, type GridPlacement } from "../grid-placement.js";
import { formatTime } from "../time.js";
import type { DayKey } from "../types.js";
import { renderBlock } from "./block.js";
import { dayHeading } from "./blocks.js";
import type { RenderContext } from "./context.js";

export function renderGrid(ctx: RenderContext): TemplateResult {
  const slots = [...(ctx.person.slots ?? [])].sort((a, b) => a.slot - b.slot);

  const placements = new Map<DayKey, GridPlacement>();
  for (const day of ctx.days) {
    placements.set(day, gridPlacement(slots, ctx.person.schedule[day] ?? []));
  }

  const hasLoose = ctx.days.some((day) => placements.get(day)!.loose.length > 0);
  const sizing = styleMap({ "--wtc-day-count": String(ctx.days.length) });

  // Wrapped in a single <div>: an expression that sits at a template's own
  // root (not nested inside one of that template's elements) does not commit
  // its content here (confirmed with a minimal Lit + happy-dom repro). The
  // wrapper is invisible to styles.ts, which has no selector depending on
  // `.grid`/`.strip` being a direct child of the host. The same rule is why
  // the per-slot row below is built with flatMap into one array fed to
  // `.grid`'s own children, instead of returning a two-item template (label
  // + day cells) per slot: that per-slot template's day-cells expression
  // would itself be root-level and silently drop its content.
  return html`
    <div>
      ${hasLoose
        ? html`
            <div class="strip" style=${sizing}>
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
            <div class="grid" style=${sizing}>
              <div class="grid-corner"></div>
              ${ctx.days.map((day) => html`<div class="grid-head">${dayHeading(ctx, day)}</div>`)}
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
                    <div class="grid-cell ${ctx.today === day ? "today" : ""}">
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
