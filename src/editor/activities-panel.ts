import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { activityTitle } from "../activity.js";
import { activityBorder, activityFill, toHexInputValue } from "../color.js";
import type { Activity } from "../types.js";
import {
  addActivity,
  countActivityUses,
  removeActivity,
  updateActivity,
} from "./mutations.js";
import { inputValue, type PanelContext } from "./panel-context.js";

const NEW_ACTIVITY_COLOR = "#64748b";

export function renderActivitiesPanel(ctx: PanelContext): TemplateResult {
  const { config, strings, commit } = ctx;

  const onRemove = (index: number, activity: Activity) => {
    const uses = countActivityUses(config, activity.id);
    if (uses > 0) {
      const message = `${strings.editor.activityInUse(activityTitle(activity), uses)} ${
        strings.editor.confirmRemoveActivity
      }`;
      if (!window.confirm(message)) return;
    }
    commit(removeActivity(config, index));
  };

  // The title and subtitle inputs trim here, at the input site, rather than in
  // updateActivity, which stays a plain spread: only normaliseConfig trims, and
  // the editor's in-memory config never passes through it. A whitespace-only
  // subtitle is truthy, so it would render an empty .block-subtitle — a phantom
  // line on every block using that activity, including HA's live preview inside
  // the edit dialog. "   " trims to "", which the renderer already treats as
  // absent and normaliseConfig drops on the next load.
  return html`
    <div class="panel">
      ${config.activities.map(
        (activity, index) => html`
          <div class="row" data-activity=${activity.id}>
            <input
              type="color"
              data-field="color"
              .value=${toHexInputValue(activity.color, NEW_ACTIVITY_COLOR)}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { color: inputValue(event) }))}
            />
            <input
              class="grow"
              type="text"
              data-field="title"
              .value=${activity.title}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { title: inputValue(event).trim() }))}
            />
            <input
              class="grow"
              type="text"
              data-field="subtitle"
              placeholder=${strings.editor.activitySubtitle}
              .value=${activity.subtitle ?? ""}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { subtitle: inputValue(event).trim() }))}
            />
            <button
              class="icon-button"
              type="button"
              data-action="remove-activity"
              title=${strings.editor.remove}
              @click=${() => onRemove(index, activity)}
            >
              ×
            </button>
          </div>
        `,
      )}

      <div class="row">
        <input
          class="grow"
          type="text"
          data-field="new-title"
          placeholder=${strings.editor.newActivityTitle}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${strings.editor.addActivity}
          @click=${(event: Event) => {
            const button = event.currentTarget as HTMLElement;
            const field = button.parentElement!.querySelector<HTMLInputElement>(
              '[data-field="new-title"]',
            )!;
            const title = field.value.trim();
            if (title.length === 0) return;
            field.value = "";
            commit(addActivity(config, title, NEW_ACTIVITY_COLOR));
          }}
        >
          +
        </button>
      </div>

      <div class="palette">
        ${config.activities.map(
          (activity) => html`
            <div
              class="block"
              style=${styleMap({
                "--wtc-block-fill": activityFill(activity.color),
                "--wtc-block-border": activityBorder(activity.color),
              })}
            >
              <div class="block-text">
                <div class="block-title">${activityTitle(activity)}</div>
                ${activity.subtitle
                  ? html`<div class="block-subtitle">${activity.subtitle}</div>`
                  : nothing}
              </div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
