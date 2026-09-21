import { describe, expect, it } from "vitest";
import { DENSITY_COMPACT_MIN, DENSITY_FULL_MIN, densityFor } from "../src/density.js";

describe("densityFor", () => {
  it("uses the documented thresholds", () => {
    expect(DENSITY_FULL_MIN).toBe(110);
    expect(DENSITY_COMPACT_MIN).toBe(72);
  });

  it("is full at or above 110px per column", () => {
    expect(densityFor(550, 5)).toBe("full");
    expect(densityFor(770, 7)).toBe("full");
  });

  it("drops to compact just below the full threshold", () => {
    expect(densityFor(769, 7)).toBe("compact");
    expect(densityFor(360, 5)).toBe("compact");
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
