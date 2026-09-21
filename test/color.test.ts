import { describe, expect, it } from "vitest";
import {
  activityBorder,
  activityFill,
  contrastTextColor,
  parseHexColor,
  relativeLuminance,
} from "../src/color.js";

describe("parseHexColor", () => {
  it("parses six-digit hex with and without a hash", () => {
    expect(parseHexColor("#1e3a5f")).toEqual({ r: 30, g: 58, b: 95 });
    expect(parseHexColor("1e3a5f")).toEqual({ r: 30, g: 58, b: 95 });
  });

  it("expands three-digit hex", () => {
    expect(parseHexColor("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexColor("#08f")).toEqual({ r: 0, g: 136, b: 255 });
  });

  it("is case-insensitive and tolerates whitespace", () => {
    expect(parseHexColor("  #1E3A5F ")).toEqual({ r: 30, g: 58, b: 95 });
  });

  it("returns null for anything that is not hex", () => {
    expect(parseHexColor("rebeccapurple")).toBeNull();
    expect(parseHexColor("var(--primary-color)")).toBeNull();
    expect(parseHexColor("#12345")).toBeNull();
    expect(parseHexColor("")).toBeNull();
  });
});

describe("relativeLuminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });

  it("puts the reference navy well below the crossover", () => {
    expect(relativeLuminance({ r: 30, g: 58, b: 95 })).toBeLessThan(0.179);
  });
});

describe("contrastTextColor", () => {
  it("picks white on the default navy header", () => {
    expect(contrastTextColor("#1e3a5f")).toBe("#ffffff");
  });

  it("picks near-black on light headers", () => {
    expect(contrastTextColor("#ffffff")).toBe("#0f172a");
    expect(contrastTextColor("#f9fafb")).toBe("#0f172a");
    expect(contrastTextColor("#808080")).toBe("#0f172a");
  });

  it("defaults to white when the colour cannot be parsed", () => {
    expect(contrastTextColor("var(--primary-color)")).toBe("#ffffff");
  });
});

describe("activity colour derivation", () => {
  it("mixes the activity colour into the card background so both themes work", () => {
    expect(activityFill("#3b82f6")).toBe(
      "color-mix(in srgb, #3b82f6 14%, var(--card-background-color, #ffffff))",
    );
    expect(activityBorder("#3b82f6")).toBe(
      "color-mix(in srgb, #3b82f6 35%, var(--card-background-color, #ffffff))",
    );
  });
});
