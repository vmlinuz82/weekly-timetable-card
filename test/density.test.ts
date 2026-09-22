import { describe, expect, it } from "vitest";
import { DENSITY_COMPACT_MIN, DENSITY_FULL_MIN, densityFor } from "../src/density.js";

describe("densityFor", () => {
  it("uses the documented thresholds", () => {
    expect(DENSITY_FULL_MIN).toBe(150);
    expect(DENSITY_COMPACT_MIN).toBe(110);
  });

  it("is full at or above 150px per column", () => {
    expect(densityFor(750, 5)).toBe("full");
    expect(densityFor(1050, 7)).toBe("full");
  });

  it("drops to compact just below the full threshold", () => {
    expect(densityFor(1049, 7)).toBe("compact");
    expect(densityFor(749, 5)).toBe("compact");
    expect(densityFor(550, 5)).toBe("compact");
  });

  /**
   * A phone reported this as shipped: five days on a 390px card computed
   * `compact`, which left each block 50px wide — titles broken to one syllable
   * per line and the second time clipped off. A block carries a time column and
   * a title, so the floor has to clear both; below it there is no arrangement
   * that fits and the day list must go to one column per row.
   */
  it("stacks rather than shrinking columns at any phone width", () => {
    for (const width of [320, 360, 390, 412, 430]) {
      expect(densityFor(width, 5), `${width}px with 5 days`).toBe("stacked");
      expect(densityFor(width, 7), `${width}px with 7 days`).toBe("stacked");
    }
  });

  it("stacks below 72px per column", () => {
    expect(densityFor(359, 5)).toBe("stacked");
    expect(densityFor(300, 7)).toBe("stacked");
  });

  it("stacks defensively for a zero width or no days", () => {
    expect(densityFor(0, 5)).toBe("stacked");
    expect(densityFor(800, 0)).toBe("stacked");
  });
});
