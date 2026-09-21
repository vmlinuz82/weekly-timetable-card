import { html, type TemplateResult } from "lit";
import { toHexInputValue } from "../color.js";
import { DEFAULT_HEADER_COLOR } from "../config.js";
import { daysFromFirstWeekday, toggleDayList } from "../days.js";
import type { CardConfig, Layout } from "../types.js";
import { updateCard } from "./mutations.js";
import { checkboxValue, inputValue, type PanelContext } from "./panel-context.js";

export function renderSettingsPanel(ctx: PanelContext): TemplateResult {
  const { config, strings, commit } = ctx;
  const order = daysFromFirstWeekday(ctx.hass);

  return html`
    <div class="panel">
      <label class="field">
        <span>${strings.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${config.title ?? ""}
          @change=${(event: Event) =>
            commit(updateCard(config, { title: inputValue(event) || undefined }))}
        />
      </label>

      <label class="field">
        <span>${strings.editor.layout}</span>
        <select
          data-field="layout"
          @change=${(event: Event) =>
            commit(updateCard(config, { layout: inputValue(event) as Layout }))}
        >
          <option value="blocks" .selected=${config.layout === "blocks"}>
            ${strings.editor.layoutBlocks}
          </option>
          <option value="grid" .selected=${config.layout === "grid"}>
            ${strings.editor.layoutGrid}
          </option>
        </select>
      </label>

      <div class="field">
        <span>${strings.editor.days}</span>
        <div class="chips">
          ${order.map(
            (day) => html`
              <button
                type="button"
                class="chip"
                data-day=${day}
                aria-pressed=${config.days.includes(day) ? "true" : "false"}
                @click=${() =>
                  commit(updateCard(config, { days: toggleDayList(config.days, day, order) }))}
              >
                ${strings.days[day].short}
              </button>
            `,
          )}
        </div>
      </div>

      <label class="field">
        <span>${strings.editor.language}</span>
        <select
          data-field="language"
          @change=${(event: Event) =>
            commit(updateCard(config, { language: inputValue(event) as CardConfig["language"] }))}
        >
          <option value="auto" .selected=${config.language === "auto"}>
            ${strings.editor.languageAuto}
          </option>
          <option value="en" .selected=${config.language === "en"}>
            ${strings.editor.languageEnglish}
          </option>
          <option value="bg" .selected=${config.language === "bg"}>
            ${strings.editor.languageBulgarian}
          </option>
        </select>
      </label>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="highlight_today"
          .checked=${config.highlight_today}
          @change=${(event: Event) =>
            commit(updateCard(config, { highlight_today: checkboxValue(event) }))}
        />
        <span>${strings.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${toHexInputValue(config.header_color, DEFAULT_HEADER_COLOR)}
          @change=${(event: Event) =>
            commit(updateCard(config, { header_color: inputValue(event) }))}
        />
        <span>${strings.editor.headerColor}</span>
      </label>
    </div>
  `;
}
