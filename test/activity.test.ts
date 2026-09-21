import { describe, expect, it } from "vitest";
import { findActivity, slugifyActivityId, uniqueActivityId } from "../src/activity.js";
import type { Activity } from "../src/types.js";

describe("slugifyActivityId", () => {
  it("slugs Latin labels", () => {
    expect(slugifyActivityId("Chess Club")).toBe("chess-club");
  });

  it("keeps Cyrillic letters instead of stripping them to nothing", () => {
    expect(slugifyActivityId("Английски")).toBe("английски");
    expect(slugifyActivityId("Почивка и хапване")).toBe("почивка-и-хапване");
  });

  it("collapses runs of separators and trims the ends", () => {
    expect(slugifyActivityId("  Judo // Training!  ")).toBe("judo-training");
  });

  it("returns an empty string when nothing survives", () => {
    expect(slugifyActivityId("!!!")).toBe("");
  });
});

describe("uniqueActivityId", () => {
  it("uses the slug when it is free", () => {
    expect(uniqueActivityId("Шах", [])).toBe("шах");
  });

  it("suffixes on collision", () => {
    expect(uniqueActivityId("Шах", ["шах"])).toBe("шах-2");
    expect(uniqueActivityId("Шах", ["шах", "шах-2"])).toBe("шах-3");
  });

  it("falls back to a generic base when the label slugs to nothing", () => {
    expect(uniqueActivityId("!!!", [])).toBe("activity");
    expect(uniqueActivityId("!!!", ["activity"])).toBe("activity-2");
  });
});

describe("findActivity", () => {
  const activities: Activity[] = [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ];

  it("finds by id", () => {
    expect(findActivity(activities, "judo")?.label).toBe("Джудо");
  });

  it("returns undefined for an orphaned reference", () => {
    expect(findActivity(activities, "gone")).toBeUndefined();
  });
});
