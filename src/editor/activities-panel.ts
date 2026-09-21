import { html, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
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
      const message = `${strings.editor.activityInUse(activity.label, uses)} ${
        strings.editor.confirmRemoveActivity
      }`;
      if (!window.confirm(message)) return;
    }
    commit(removeActivity(config, index));
  };

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
              data-field="label"
              .value=${activity.label}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { label: inputValue(event) }))}
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
          data-field="new-label"
          placeholder=${strings.editor.label}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${strings.editor.addActivity}
          @click=${(event: Event) => {
            const button = event.currentTarget as HTMLElement;
            const field = button.parentElement!.querySelector<HTMLInputElement>(
              '[data-field="new-label"]',
            )!;
            const label = field.value.trim();
            if (label.length === 0) return;
            field.value = "";
            commit(addActivity(config, label, NEW_ACTIVITY_COLOR));
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
              <div class="block-label">${activity.label}</div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
