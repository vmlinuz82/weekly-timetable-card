import { html, nothing, type TemplateResult } from "lit";
import { blockForm } from "../block.js";
import { blockTimeLabel, type TimeLabelContext } from "../renderers/block.js";
import { resolveLang } from "../i18n/index.js";
import type { Block, DayKey, Slot } from "../types.js";
import {
  addBlock,
  addSlot,
  moveBlock,
  moveBlockBy,
  removeBlock,
  removeSlot,
  updateBlock,
  updateSlot,
} from "./mutations.js";
import { inputValue, type PanelContext } from "./panel-context.js";

function timeLabelContext(ctx: PanelContext): TimeLabelContext {
  return { strings: ctx.strings, hass: ctx.hass, lang: resolveLang(ctx.config, ctx.hass) };
}

export interface SchedulePanelOptions {
  selectedActivity: string | null;
  onSelectActivity: (id: string | null) => void;
}

export function renderSchedulePanel(
  ctx: PanelContext,
  options: SchedulePanelOptions,
): TemplateResult {
  const { config, strings } = ctx;
  const days = config.days;

  return html`
    <div class="panel">
      ${config.layout === "grid" ? renderSlots(ctx) : nothing}

      <div class="palette">
        ${config.activities.map(
          (activity) => html`
            <button
              type="button"
              class="palette-chip"
              data-palette-activity=${activity.id}
              aria-pressed=${options.selectedActivity === activity.id ? "true" : "false"}
              @click=${() =>
                options.onSelectActivity(
                  options.selectedActivity === activity.id ? null : activity.id,
                )}
            >
              ${activity.title}
            </button>
          `,
        )}
      </div>
      <div class="hint">${strings.editor.placeHint}</div>

      ${days.map((day) => renderDayGroup(ctx, options, day))}
    </div>
  `;
}

function renderSlots(ctx: PanelContext): TemplateResult {
  const { config, strings, commit } = ctx;
  const slots: Slot[] = config.slots ?? [];
  return html`
    <div class="day-group" data-section="slots">
      <h4>${strings.editor.slots}</h4>
      <div class="block-rows">
        ${slots.map(
          (slot, index) => html`
            <div class="row" data-slot-index=${index}>
              <span class="hint" style="width: 2rem">${slot.slot}</span>
              <input
                type="time"
                data-field="slot-start"
                .value=${slot.start}
                @change=${(event: Event) =>
                  commit(updateSlot(config, index, { start: inputValue(event) }))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${slot.end}
                @change=${(event: Event) =>
                  commit(updateSlot(config, index, { end: inputValue(event) }))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${strings.editor.remove}
                @click=${() => commit(removeSlot(config, index))}
              >
                ×
              </button>
            </div>
          `,
        )}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${() => commit(addSlot(config))}
        >
          ＋ ${strings.editor.addSlot}
        </button>
      </div>
    </div>
  `;
}

function renderDayGroup(
  ctx: PanelContext,
  options: SchedulePanelOptions,
  day: DayKey,
): TemplateResult {
  const { config, strings, commit } = ctx;
  const blocks = config.schedule[day] ?? [];
  const firstActivity = config.activities[0]?.id;

  return html`
    <div
      class="day-group"
      data-day=${day}
      @click=${() => {
        if (!options.selectedActivity) return;
        commit(addBlock(config, day, { activity: options.selectedActivity }));
        options.onSelectActivity(null);
      }}
    >
      <h4>${strings.days[day].full}</h4>
      <div class="block-rows">
        ${blocks.map((block, index) =>
          renderBlockRow(ctx, options, day, block, index, blocks.length),
        )}
        ${firstActivity
          ? html`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${(event: Event) => {
                  event.stopPropagation();
                  commit(addBlock(config, day, { activity: firstActivity }));
                }}
              >
                ＋ ${strings.editor.addBlock}
              </button>
            `
          : html`
              <button class="chip" type="button" data-action="add-block" disabled>
                ＋ ${strings.editor.addBlock}
              </button>
              <div class="hint">${strings.editor.addBlockNeedsActivity}</div>
            `}
      </div>
    </div>
  `;
}

function renderBlockRow(
  ctx: PanelContext,
  options: SchedulePanelOptions,
  day: DayKey,
  block: Block,
  index: number,
  total: number,
): TemplateResult {
  const { config, strings, commit } = ctx;

  return html`
    <div class="row" data-block-index=${index} @click=${(event: Event) => event.stopPropagation()}>
      <select
        class="grow"
        data-field="activity"
        @change=${(event: Event) =>
          commit(updateBlock(config, day, index, { activity: inputValue(event) }))}
      >
        ${config.activities.map(
          (activity) => html`
            <option value=${activity.id} .selected=${activity.id === block.activity}>
              ${activity.title}
            </option>
          `,
        )}
        ${config.activities.some((activity) => activity.id === block.activity)
          ? nothing
          : html`<option value=${block.activity} .selected=${true}>${block.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${strings.editor.moveToDay}
        @change=${(event: Event) => {
          const target = inputValue(event) as DayKey;
          if (target === day) return;
          const targetLength = (config.schedule[target] ?? []).length;
          commit(moveBlock(config, { day, index }, { day: target, index: targetLength }));
        }}
      >
        ${config.days.map(
          (candidate) => html`
            <option value=${candidate} .selected=${candidate === day}>
              ${strings.days[candidate].short}
            </option>
          `,
        )}
      </select>

      ${config.layout === "grid"
        ? renderSlotSelect(ctx, day, block, index, config.slots ?? [])
        : html`
            <input
              type="time"
              data-field="start"
              .value=${block.start ?? ""}
              @change=${(event: Event) =>
                commit(updateBlock(config, day, index, { start: inputValue(event) || null }))}
            />
            ${block.start
              ? html`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-start"
                    title=${strings.editor.clearTime}
                    @click=${() => commit(updateBlock(config, day, index, { start: null }))}
                  >
                    ⌫
                  </button>
                `
              : nothing}
            <input
              type="time"
              data-field="end"
              .value=${block.end ?? ""}
              @change=${(event: Event) =>
                commit(updateBlock(config, day, index, { end: inputValue(event) || null }))}
            />
            ${block.end
              ? html`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-end"
                    title=${strings.editor.clearTime}
                    @click=${() => commit(updateBlock(config, day, index, { end: null }))}
                  >
                    ⌫
                  </button>
                `
              : nothing}
          `}

      <button
        class="icon-button"
        type="button"
        data-action="move-up"
        title=${strings.editor.moveUp}
        ?disabled=${index === 0}
        @click=${() => commit(moveBlockBy(config, day, index, -1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${strings.editor.moveDown}
        ?disabled=${index >= total - 1}
        @click=${() => commit(moveBlockBy(config, day, index, 1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${strings.editor.remove}
        @click=${() => commit(removeBlock(config, day, index))}
      >
        ×
      </button>
    </div>
  `;
}

function renderSlotSelect(
  ctx: PanelContext,
  day: DayKey,
  block: Block,
  index: number,
  slots: readonly Slot[],
): TemplateResult {
  const { config, strings, commit } = ctx;
  const current =
    blockForm(block) === "range"
      ? slots.find((slot) => slot.start === block.start && slot.end === block.end)
      : undefined;
  // The dropdown replaces the time fields entirely in grid layout, so a block
  // that matches no slot would otherwise look like it has no times at all —
  // even though they are preserved and still render on the card.
  const showRawTimes = current === undefined && (block.start !== undefined || block.end !== undefined);

  return html`
    <select
      data-field="slot"
      @change=${(event: Event) => {
        const raw = inputValue(event);
        if (raw === "") {
          commit(updateBlock(config, day, index, { start: null, end: null }));
          return;
        }
        const slot = slots.find((candidate) => String(candidate.slot) === raw);
        if (!slot) return;
        commit(updateBlock(config, day, index, { start: slot.start, end: slot.end }));
      }}
    >
      <option value="" .selected=${current === undefined}>${strings.editor.slotNone}</option>
      ${slots.map(
        (slot) => html`
          <option value=${String(slot.slot)} .selected=${current?.slot === slot.slot}>
            ${slot.slot}. ${slot.start}–${slot.end}
          </option>
        `,
      )}
    </select>
    ${showRawTimes
      ? html`<span class="hint">${blockTimeLabel(timeLabelContext(ctx), block)}</span>`
      : nothing}
  `;
}
