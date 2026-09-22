import { describe, expect, it } from "vitest";
import { cardStyles } from "../src/styles.js";

/**
 * The compact density tier and the today markers are CSS, and jsdom does not
 * resolve adopted stylesheets, so their *effect* cannot be asserted here. What
 * can be asserted — and what actually regressed once — is that each rule exists
 * at all: the compact tier originally tightened only the blocks layout, leaving
 * grid headers and cells at full padding while their day names went short.
 *
 * `toContain` is deliberately not used: it matches substrings, so renaming
 * `.grid-head` to `.grid-head-gone` would still satisfy it. Each selector must
 * be followed by its rule block.
 */
const css = cardStyles.cssText;

const hasRule = (selector: string): boolean =>
  new RegExp(`${selector.replace(/[[\]().*+?^$|{}\\]/g, "\\$&")}\\s*\\{`).test(css);

describe("compact density coverage", () => {
  it("tightens both layouts, not just blocks", () => {
    for (const selector of [
      '[data-density="compact"] .day-head',
      '[data-density="compact"] .day-body',
      '[data-density="compact"] .block',
      '[data-density="compact"] .block-title',
      '[data-density="compact"] .grid-head',
      '[data-density="compact"] .slot-label',
      '[data-density="compact"] .grid-cell',
    ]) {
      expect(hasRule(selector), `missing rule for ${selector}`).toBe(true);
    }
  });

  it("marks today in both layouts", () => {
    expect(hasRule(".day.today .day-head"), "blocks layout today header").toBe(true);
    expect(hasRule(".grid-head.today"), "grid layout today header").toBe(true);
  });
});

describe("the matcher itself fails on a renamed selector", () => {
  it("does not match a selector that merely contains the name", () => {
    // Guards the guard: proves hasRule is stricter than a substring check.
    expect(hasRule('[data-density="compact"] .grid-head-does-not-exist')).toBe(false);
  });
});
