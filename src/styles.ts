import { css } from "lit";

/**
 * A block looks the same wherever it appears — in the card, and in the editor's
 * activity preview. Shared as its own CSSResult and composed into both style
 * sheets, rather than duplicated or (worse) defined only in cardStyles, which
 * would leave the editor's previews unstyled.
 */
export const blockStyles = css`
  .block {
    display: flex;
    align-items: baseline;
    gap: 8px;
    border-radius: 8px;
    padding: 8px 10px;
    text-align: left;
    /* Not a color-mix fallback. --wtc-block-fill carries a color-mix() value,
       and if a browser cannot resolve it the declaration below is invalid at
       computed-value time: background becomes the initial value (transparent),
       it does not revert to this one — the cascade already chose the later
       declaration. What this line does cover is a browser with no custom
       properties at all, where the var() below is unparseable and that whole
       declaration is dropped at parse time instead, leaving this one to apply. */
    background: var(--secondary-background-color);
    background: var(--wtc-block-fill, var(--secondary-background-color));
    border: 1px solid var(--divider-color);
    border-color: var(--wtc-block-border, var(--divider-color));
  }

  .block.orphan {
    border-style: dashed;
    background: var(--secondary-background-color);
  }

  /* Content-sized so the text column takes the remainder, and right-aligned so
     the two stacked times line up with each other rather than with the title.
     The words until/after are the widest content and set the column's floor. */
  .block-time {
    flex: 0 0 auto;
    text-align: right;
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }

  .block-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .block-title {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    color: var(--primary-text-color);
    overflow-wrap: break-word;
  }

  .block-subtitle {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
    overflow-wrap: break-word;
  }
`;

export const cardStyles = css`
  ${blockStyles}

  :host {
    display: block;
  }

  ha-card {
    padding: 12px;
    overflow: hidden;
  }

  .card-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .week {
    display: grid;
    grid-template-columns: repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
  }

  .day {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    overflow: hidden;
    background: var(--card-background-color);
  }

  .day-head {
    padding: 10px 6px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .day-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }

  .day.today .day-head {
    background: color-mix(in srgb, var(--wtc-header-color, #1e3a5f) 85%, white 15%);
  }

  .day.today .day-body {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .empty {
    padding: 4px 0;
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  [data-density="compact"] .day-head {
    padding: 8px 4px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  [data-density="compact"] .day-body {
    gap: 6px;
    padding: 6px;
  }
  [data-density="compact"] .block {
    padding: 5px 7px;
    gap: 6px;
  }
  /* Below the full threshold the two columns stop paying for themselves: a
     ~129px day column leaves the title about 35px, and it shreds into two or
     three characters per line. Stack the block internally instead — the time on
     one line, in reading order, above the text at full block width. Verified in
     the harness at 700px with seven days: all seven stay visible and titles wrap
     at word boundaries. The stacked tier is deliberately untouched; there each
     day has the card's full width, where two columns are the right shape. */
  [data-density="compact"] .block {
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }
  [data-density="compact"] .block-time {
    display: flex;
    gap: 4px;
    text-align: left;
  }
  [data-density="compact"] .block-time,
  [data-density="compact"] .block-subtitle {
    font-size: 10px;
  }
  [data-density="compact"] .block-title {
    font-size: 12px;
  }
  [data-density="compact"] .grid-head {
    padding: 8px 4px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  [data-density="compact"] .slot-label {
    padding: 4px 6px;
    font-size: 10px;
  }
  [data-density="compact"] .grid-cell {
    gap: 4px;
    min-height: 32px;
    padding: 3px;
  }

  [data-density="stacked"] .week {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  [data-density="stacked"] .day-head {
    padding-left: 12px;
    text-align: left;
  }

  .grid-wrap {
    display: grid;
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 10px 6px;
  }

  .grid,
  .grid-heads {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: stretch;
  }

  .grid {
    row-gap: 6px;
  }

  .grid-head {
    padding: 10px 6px;
    border-radius: 8px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .grid-head.today {
    background: color-mix(in srgb, var(--wtc-header-color, #1e3a5f) 85%, white 15%);
  }

  .grid-corner {
    background: transparent;
  }

  .slot-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  .grid-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 40px;
    padding: 4px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .grid-cell.today {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .strip {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }

  .strip-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .strip-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .no-slots {
    grid-column: 1 / -1;
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`;

export const editorStyles = css`
  ${blockStyles}

  :host {
    display: block;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .tab {
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  .tab[aria-selected="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #ffffff));
    font-weight: 600;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .field.inline {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  input[type="text"],
  input[type="time"],
  input[type="number"],
  select {
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
  }

  input[type="color"] {
    width: 40px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: none;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    padding: 5px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .chip[aria-pressed="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color, #ffffff));
    color: var(--primary-text-color);
    font-weight: 600;
  }

  /* Home Assistant's card-config dialog gives the editor about 390px. A block
     row holds seven controls, and the two time inputs alone take ~216px there,
     so an unconstrained min-width of 0 collapsed the activity select - the one
     field that says what the row IS - to 18px. Wrap instead of crushing. */
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  .row .grow {
    flex: 1 1 7rem;
    min-width: 7rem;
  }

  .icon-button {
    width: 30px;
    height: 30px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    line-height: 1;
    cursor: pointer;
  }

  .icon-button[disabled] {
    opacity: 0.4;
    cursor: default;
  }

  .day-group {
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .day-group > h4 {
    margin: 0 0 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
  }

  .block-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .palette-chip {
    padding: 6px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .palette-chip[aria-pressed="true"] {
    outline: 2px solid var(--primary-color);
  }
`;
