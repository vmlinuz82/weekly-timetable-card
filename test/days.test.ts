import { describe, expect, it } from "vitest";
import {
  daysFromFirstWeekday,
  isDayKey,
  normaliseDays,
  toggleDayList,
  todayKey,
} from "../src/days.js";
import type { DayKey } from "../src/types.js";

const WEEKDAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];

describe("isDayKey", () => {
  it("accepts the seven keys and rejects anything else", () => {
    expect(isDayKey("mon")).toBe(true);
    expect(isDayKey("sun")).toBe(true);
    expect(isDayKey("Mo")).toBe(false);
    expect(isDayKey(3)).toBe(false);
    expect(isDayKey(undefined)).toBe(false);
  });
});

describe("normaliseDays", () => {
  it("falls back when the value is not an array", () => {
    expect(normaliseDays(undefined, WEEKDAYS)).toEqual(WEEKDAYS);
    expect(normaliseDays("mon", WEEKDAYS)).toEqual(WEEKDAYS);
  });

  it("drops unknown keys and preserves the author's order", () => {
    expect(normaliseDays(["fri", "nope", "mon"], WEEKDAYS)).toEqual(["fri", "mon"]);
  });

  it("de-duplicates while keeping the first occurrence", () => {
    expect(normaliseDays(["mon", "tue", "mon"], WEEKDAYS)).toEqual(["mon", "tue"]);
  });

  it("falls back when every entry is invalid", () => {
    expect(normaliseDays(["nope", 7], WEEKDAYS)).toEqual(WEEKDAYS);
  });

  it("returns a copy, not the fallback array itself", () => {
    const out = normaliseDays(undefined, WEEKDAYS);
    expect(out).not.toBe(WEEKDAYS);
  });
});

describe("todayKey", () => {
  it("maps Sunday to sun and Monday to mon", () => {
    expect(todayKey(new Date(2026, 8, 20, 12, 0))).toBe("sun");
    expect(todayKey(new Date(2026, 8, 21, 12, 0))).toBe("mon");
    expect(todayKey(new Date(2026, 8, 26, 12, 0))).toBe("sat");
  });
});

describe("daysFromFirstWeekday", () => {
  it("defaults to a Monday-first week", () => {
    expect(daysFromFirstWeekday()).toEqual([
      "mon", "tue", "wed", "thu", "fri", "sat", "sun",
    ]);
  });

  it("rotates to an explicit first weekday", () => {
    expect(daysFromFirstWeekday({ locale: { first_weekday: "sunday" } })).toEqual([
      "sun", "mon", "tue", "wed", "thu", "fri", "sat",
    ]);
  });

  it("treats 'language' as Sunday-first only for US English", () => {
    expect(daysFromFirstWeekday({ language: "en-US", locale: { first_weekday: "language" } })[0]).toBe("sun");
    expect(daysFromFirstWeekday({ language: "bg", locale: { first_weekday: "language" } })[0]).toBe("mon");
  });
});

describe("toggleDayList", () => {
  const order: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  it("removes a selected day", () => {
    expect(toggleDayList(["mon", "tue", "wed"], "tue", order)).toEqual(["mon", "wed"]);
  });

  it("inserts an unselected day at its canonical position", () => {
    expect(toggleDayList(["mon", "wed"], "tue", order)).toEqual(["mon", "tue", "wed"]);
    expect(toggleDayList(["mon", "tue"], "sat", order)).toEqual(["mon", "tue", "sat"]);
  });

  it("preserves an author's custom order rather than re-sorting", () => {
    expect(toggleDayList(["fri", "mon"], "sun", order)).toEqual(["fri", "mon", "sun"]);
  });

  it("refuses to empty the list", () => {
    const only: DayKey[] = ["mon"];
    expect(toggleDayList(only, "mon", order)).toBe(only);
  });

  it("does not mutate the input", () => {
    const days: DayKey[] = ["mon", "wed"];
    toggleDayList(days, "tue", order);
    expect(days).toEqual(["mon", "wed"]);
  });
});
