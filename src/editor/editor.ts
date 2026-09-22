import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normaliseConfig } from "../config.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import { editorStyles } from "../styles.js";
import type { CardConfig, Hass } from "../types.js";
import { renderActivitiesPanel } from "./activities-panel.js";
import { fireEvent } from "./fire-event.js";
import type { PanelContext } from "./panel-context.js";
import { renderSchedulePanel } from "./schedule-panel.js";
import { renderSettingsPanel } from "./settings-panel.js";

type Tab = "settings" | "schedule" | "activities";

@customElement("weekly-timetable-card-editor")
export class WeeklyTimetableCardEditor extends LitElement {
  static override styles = editorStyles;

  @property({ attribute: false }) hass?: Hass;

  @state() private _config?: CardConfig;
  @state() private _tab: Tab = "settings";
  @state() private _selectedActivity: string | null = null;

  setConfig(config: unknown): void {
    this._config = normaliseConfig(config);
  }

  private _commit(next: CardConfig): void {
    this._config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const strings = stringsFor(resolveLang(config, this.hass));
    const ctx: PanelContext = {
      config,
      strings,
      hass: this.hass,
      commit: (next) => this._commit(next),
    };

    return html`
      <div class="tabs" role="tablist">
        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="settings"
          aria-selected=${this._tab === "settings" ? "true" : "false"}
          @click=${() => {
            this._tab = "settings";
          }}
        >
          ${strings.editor.tabSettings}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="schedule"
          aria-selected=${this._tab === "schedule" ? "true" : "false"}
          @click=${() => {
            this._tab = "schedule";
          }}
        >
          ${strings.editor.tabSchedule}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="activities"
          aria-selected=${this._tab === "activities" ? "true" : "false"}
          @click=${() => {
            this._tab = "activities";
          }}
        >
          ${strings.editor.tabActivities}
        </button>
      </div>

      ${this._renderPanel(ctx)}
    `;
  }

  private _renderPanel(ctx: PanelContext): TemplateResult {
    if (this._tab === "settings") return renderSettingsPanel(ctx);
    if (this._tab === "activities") return renderActivitiesPanel(ctx);
    return renderSchedulePanel(ctx, {
      selectedActivity: this._selectedActivity,
      onSelectActivity: (id) => {
        this._selectedActivity = id;
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weekly-timetable-card-editor": WeeklyTimetableCardEditor;
  }
}
