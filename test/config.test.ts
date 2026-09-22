import { describe, expect, it } from "vitest";
import {
  CARD_TYPE,
  DEFAULT_HEADER_COLOR,
  getStubConfig,
  normaliseConfig,
  normaliseTimeString,
} from "../src/config.js";

const minimal = {};

describe("normaliseTimeString", () => {
  it("passes through a plain time", () => {
    expect(normaliseTimeString("15:20")).toBe("15:20");
  });

  it("trims surrounding whitespace", () => {
    expect(normaliseTimeString("  16:00 ")).toBe("16:00");
  });

  it("converts a YAML 1.1 sexagesimal number back to a time", () => {
    // Unquoted `16:00` in a YAML dashboard parses as 960.
    expect(normaliseTimeString(960)).toBe("16:00");
    expect(normaliseTimeString(920)).toBe("15:20");
  });

  it("drops empty and non-string, non-number values", () => {
    expect(normaliseTimeString("")).toBeUndefined();
    expect(normaliseTimeString("   ")).toBeUndefined();
    expect(normaliseTimeString(undefined)).toBeUndefined();
    expect(normaliseTimeString(null)).toBeUndefined();
    expect(normaliseTimeString({})).toBeUndefined();
  });

  it("keeps an unparseable string so it can render verbatim", () => {
    expect(normaliseTimeString("half four")).toBe("half four");
  });
});

describe("normaliseConfig", () => {
  it("treats a fully empty or undefined config as valid, rendering an empty week", () => {
    expect(() => normaliseConfig(undefined)).not.toThrow();
    expect(normaliseConfig({}).schedule.mon).toEqual([]);
  });

  it("throws when activities is present but not a list", () => {
    expect(() => normaliseConfig({ ...minimal, activities: "no" })).toThrow(/activities/);
  });

  it("applies every default", () => {
    const config = normaliseConfig(minimal);
    expect(config.layout).toBe("blocks");
    expect(config.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
    expect(config.language).toBe("auto");
    expect(config.highlight_today).toBe(true);
    expect(config.header_color).toBe(DEFAULT_HEADER_COLOR);
    expect(config.activities).toEqual([]);
    expect(config.title).toBeUndefined();
  });

  it("accepts highlight_today false but not other falsy values", () => {
    expect(normaliseConfig({ ...minimal, highlight_today: false }).highlight_today).toBe(false);
    expect(normaliseConfig({ ...minimal, highlight_today: 0 }).highlight_today).toBe(true);
  });

  it("rejects an unknown layout by falling back to blocks", () => {
    expect(normaliseConfig({ ...minimal, layout: "timeline" }).layout).toBe("blocks");
    expect(normaliseConfig({ ...minimal, layout: "grid" }).layout).toBe("grid");
  });

  it("drops unknown day keys and de-duplicates", () => {
    const config = normaliseConfig({ ...minimal, days: ["sun", "mon", "sun", "xx"] });
    expect(config.days).toEqual(["sun", "mon"]);
  });

  it("gives every day an array so renderers never see undefined", () => {
    const config = normaliseConfig({ schedule: { mon: [{ activity: "english" }] } });
    expect(config.schedule.mon).toHaveLength(1);
    expect(config.schedule.fri).toEqual([]);
  });

  it("preserves blocks for stored days outside the current list, so narrowing is reversible", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      schedule: {
        mon: [{ activity: "english" }],
        fri: [{ activity: "judo" }],
      },
    });
    expect(config.schedule.tue).toEqual([]);
    expect(config.schedule.fri).toEqual([{ activity: "judo" }]);
  });

  it("drops blocks with no usable activity id", () => {
    const config = normaliseConfig({
      schedule: { mon: [{ activity: "" }, {}, { activity: "judo" }] },
    });
    expect(config.schedule.mon).toEqual([{ activity: "judo" }]);
  });

  it("keeps an activity id that matches no activity, for the orphan renderer", () => {
    const config = normaliseConfig({
      activities: [{ id: "judo", title: "Джудо", color: "#f97316" }],
      schedule: { mon: [{ activity: "gone" }] },
    });
    expect(config.schedule.mon).toEqual([{ activity: "gone" }]);
  });

  it("omits absent times rather than storing empty strings", () => {
    const config = normaliseConfig({
      schedule: { mon: [{ activity: "x", start: "", end: "16:00" }] },
    });
    expect(config.schedule.mon![0]).toEqual({ activity: "x", end: "16:00" });
  });

  it("normalises activities and drops unusable ones", () => {
    const config = normaliseConfig({
      ...minimal,
      activities: [
        { id: "judo", title: "Джудо", color: "#f97316" },
        { id: "", title: "No id", color: "#000" },
        { title: "No id at all" },
        { id: "chess", title: "", color: "" },
      ],
    });
    expect(config.activities.map((a) => a.id)).toEqual(["judo", "chess"]);
    expect(config.activities[1]).toEqual({ id: "chess", title: "chess", color: "#888888" });
  });

  it("normalises slots and drops ones without both times", () => {
    const config = normaliseConfig({
      slots: [
        { slot: 1, start: "08:00", end: "08:45" },
        { slot: 2, start: "08:45" },
        { start: "09:00", end: "09:45" },
      ],
      schedule: {},
    });
    expect(config.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 3, start: "09:00", end: "09:45" },
    ]);
  });

  it("does not mutate the input", () => {
    const raw = { schedule: {} };
    const snapshot = JSON.stringify(raw);
    normaliseConfig(raw);
    expect(JSON.stringify(raw)).toBe(snapshot);
  });

  it("rejects a legacy people config rather than guessing", () => {
    expect(() =>
      normaliseConfig({
        type: CARD_TYPE,
        people: [{ name: "Sami", schedule: { mon: [] } }],
      }),
    ).toThrow(/people/);
  });

  it("reads slots and schedule from the top level", () => {
    const config = normaliseConfig({
      type: CARD_TYPE,
      days: ["mon"],
      slots: [{ slot: 1, start: "08:00", end: "08:45" }],
      schedule: { mon: [{ activity: "english", start: "15:20", end: "16:20" }] },
    });
    expect(config.slots).toEqual([{ slot: 1, start: "08:00", end: "08:45" }]);
    expect(config.schedule.mon).toEqual([{ activity: "english", start: "15:20", end: "16:20" }]);
  });

  it("preserves schedule entries for days outside the day list", () => {
    const config = normaliseConfig({
      type: CARD_TYPE,
      days: ["mon"],
      schedule: { sat: [{ activity: "judo" }] },
    });
    expect(config.schedule.sat).toEqual([{ activity: "judo" }]);
  });

  it("reads an activity title and trims an optional subtitle", () => {
    const config = normaliseConfig({
      type: CARD_TYPE,
      schedule: {},
      activities: [{ id: "english", title: "  English  ", subtitle: "  Room 12  ", color: "#3b82f6" }],
    });
    expect(config.activities[0]).toEqual({
      id: "english",
      title: "English",
      subtitle: "Room 12",
      color: "#3b82f6",
    });
  });

  it("omits an empty subtitle entirely rather than passing an empty string on", () => {
    const config = normaliseConfig({
      type: CARD_TYPE,
      schedule: {},
      activities: [{ id: "judo", title: "Judo", subtitle: "   ", color: "#f97316" }],
    });
    expect(config.activities[0]).not.toHaveProperty("subtitle");
  });

  it("does not accept `label` as an alias for `title`", () => {
    const config = normaliseConfig({
      type: CARD_TYPE,
      schedule: {},
      activities: [{ id: "english", label: "English", color: "#3b82f6" }],
    });
    // With no title, the id stands in — the author sees the raw id and knows.
    expect(config.activities[0]!.title).toBe("english");
  });
});

describe("getStubConfig", () => {
  it("titles the stub with the example subject's name", () => {
    const config = getStubConfig();
    expect(config.title).toBe("Sami");
  });

  it("builds a Monday-to-Friday week regardless of first_weekday", () => {
    const config = getStubConfig({ locale: { first_weekday: "sunday" } });
    expect(config.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });

  it("uses Bulgarian example titles for a Bulgarian user", () => {
    const config = getStubConfig({ language: "bg" });
    expect(config.activities.some((a) => a.title === "Английски")).toBe(true);
  });

  it("uses English example titles otherwise", () => {
    const config = getStubConfig({ language: "de" });
    expect(config.activities.some((a) => a.title === "English")).toBe(true);
  });

  it("returns a config that survives normalisation unchanged", () => {
    const config = getStubConfig({ language: "bg" });
    expect(normaliseConfig(config)).toEqual(config);
  });

  it("references only activities it defines", () => {
    const config = getStubConfig();
    const ids = new Set(config.activities.map((a) => a.id));
    for (const blocks of Object.values(config.schedule)) {
      for (const block of blocks ?? []) {
        expect(ids.has(block.activity)).toBe(true);
      }
    }
  });
});
