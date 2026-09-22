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

const escapeForRegExp = (text: string): string => text.replace(/[[\]().*+?^$|{}\\]/g, "\\$&");

const hasRule = (selector: string): boolean =>
  new RegExp(`${escapeForRegExp(selector)}\\s*\\{`).test(css);

describe("compact density coverage", () => {
  it("tightens both layouts, not just blocks", () => {
    for (const selector of [
      '[data-density="compact"] .day-head',
      '[data-density="compact"] .day-body',
      '[data-density="compact"] .block',
      '[data-density="compact"] .block-time',
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

/**
 * The value is matched too: asserting the property alone would be satisfied by
 * `overflow-wrap: normal`, which is the default and the exact regression this
 * guards against. `[^}]*` confines the search to the selector's own rule block.
 */
const hasProperty = (selector: string, property: string, value: string): boolean => {
  const pattern = new RegExp(
    `${escapeForRegExp(selector)}\\s*\\{[^}]*${escapeForRegExp(property)}\\s*:\\s*${escapeForRegExp(
      value,
    )}\\s*[;}]`,
  );
  return pattern.test(css);
};

describe("the matcher itself fails on a renamed selector", () => {
  it("does not match a selector that merely contains the name", () => {
    // Guards the guard: proves hasRule is stricter than a substring check.
    expect(hasRule('[data-density="compact"] .grid-head-does-not-exist')).toBe(false);
  });
});

describe("block text overflow handling", () => {
  it("wraps block titles to prevent overflow", () => {
    expect(
      hasProperty(".block-title", "overflow-wrap", "break-word"),
      "block-title must have overflow-wrap: break-word",
    ).toBe(true);
  });

  it("wraps block subtitles to prevent overflow", () => {
    expect(
      hasProperty(".block-subtitle", "overflow-wrap", "break-word"),
      "block-subtitle must have overflow-wrap: break-word",
    ).toBe(true);
  });

  it("is not satisfied by the default value", () => {
    // Guards the guard, as the hasRule case above does: proves hasProperty
    // reads the value and not just the property name.
    expect(hasProperty(".block-title", "overflow-wrap", "normal")).toBe(false);
  });
});
