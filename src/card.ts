import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { contrastTextColor } from "./color.js";
import { CARD_TYPE, DEFAULT_DAYS, getStubConfig, normaliseConfig } from "./config.js";
import { densityFor } from "./density.js";
import "./editor/editor.js";
import { renderBlocks } from "./renderers/blocks.js";
import { buildContext } from "./renderers/context.js";
import { renderGrid } from "./renderers/grid.js";
import { cardStyles } from "./styles.js";
import type { CardConfig, Density, Hass } from "./types.js";
import { CARD_VERSION } from "./version.js";

@customElement("weekly-timetable-card")
export class WeeklyTimetableCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) density: Density = "full";

  @state() private _config?: CardConfig;
  @state() private _personIndex = 0;

  private _observer?: ResizeObserver;
  // Cached from the last ResizeObserver reading. `_dayCount()` also changes
  // when a person with their own `days` override is selected or edited, with
  // no resize in between, so density must be re-derived from this cached
  // width on every update — not only inside the observer callback. Left at 0
  // until the first real measurement (jsdom never provides one), which the
  // guard in `willUpdate` treats as "don't know yet" rather than "stacked".
  private _measuredWidth = 0;

  static getConfigElement(): HTMLElement {
    return document.createElement("weekly-timetable-card-editor");
  }

  static getStubConfig(hass?: Hass): CardConfig {
    return getStubConfig(hass);
  }

  static getLayoutOptions(): { grid_columns: string; grid_rows: string } {
    return { grid_columns: "full", grid_rows: "auto" };
  }

  setConfig(config: unknown): void {
    this._config = normaliseConfig(config);
    this._personIndex = Math.min(this._personIndex, this._config.people.length - 1);
  }

  getCardSize(): number {
    return 6;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver === "undefined") return;
    this._observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      this._measuredWidth = width;
      const next = densityFor(width, this._dayCount());
      if (next !== this.density) this.density = next;
    });
    this._observer.observe(this);
  }

  override disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = undefined;
    super.disconnectedCallback();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    if (this._measuredWidth <= 0) return;
    const next = densityFor(this._measuredWidth, this._dayCount());
    if (next !== this.density) this.density = next;
  }

  private _dayCount(): number {
    const config = this._config;
    if (!config) return DEFAULT_DAYS.length;
    const person = config.people[Math.min(this._personIndex, config.people.length - 1)];
    return (person?.days ?? config.days).length;
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const ctx = buildContext({
      config,
      personIndex: this._personIndex,
      hass: this.hass,
      density: this.density,
    });

    const body =
      this.density === "stacked" || config.layout === "blocks"
        ? renderBlocks(ctx)
        : renderGrid(ctx);

    const cardStyle = styleMap({
      "--wtc-header-color": config.header_color,
      "--wtc-header-text": contrastTextColor(config.header_color),
      "--wtc-accent": ctx.person.color ?? "var(--primary-color)",
    });

    return html`
      <ha-card style=${cardStyle}>
        ${config.title ? html`<h1 class="card-title">${config.title}</h1>` : nothing}
        ${config.people.length > 1 ? this._renderTabs(config) : nothing}
        <div class="body" data-density=${this.density}>${body}</div>
      </ha-card>
    `;
  }

  private _renderTabs(config: CardConfig): TemplateResult {
    return html`
      <div class="tabs" role="tablist">
        ${config.people.map(
          (person, index) => html`
            <button
              class="tab"
              role="tab"
              type="button"
              aria-selected=${index === this._personIndex ? "true" : "false"}
              style=${styleMap({ "--wtc-accent": person.color ?? "var(--primary-color)" })}
              @click=${() => {
                this._personIndex = index;
              }}
            >
              ${person.emoji ? html`<span>${person.emoji}</span>` : nothing}
              <span>${person.name}</span>
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weekly-timetable-card": WeeklyTimetableCard;
  }
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

console.info(
  `%c WEEKLY-TIMETABLE-CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px",
  "color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0",
);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE.replace(/^custom:/, ""),
  name: "Weekly Timetable Card",
  description: "Weekly timetable for one or more people, in English or Bulgarian",
  preview: true,
  documentationURL: "https://github.com/vmlinuz82/weekly-timetable-card",
});
