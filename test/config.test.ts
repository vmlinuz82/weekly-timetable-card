import { describe, expect, it } from "vitest";
import {
  DEFAULT_HEADER_COLOR,
  getStubConfig,
  normaliseConfig,
  normaliseTimeString,
} from "../src/config.js";

const minimal = { people: [{ name: "Иван", schedule: {} }] };

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
  it("throws when people is missing or empty", () => {
    expect(() => normaliseConfig({})).toThrow(/people/);
    expect(() => normaliseConfig({ people: [] })).toThrow(/people/);
    expect(() => normaliseConfig(undefined)).toThrow(/people/);
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

  it("gives every effective day an array so renderers never see undefined", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "english" }] } }],
    });
    const person = config.people[0]!;
    expect(person.schedule.mon).toHaveLength(1);
    expect(person.schedule.fri).toEqual([]);
  });

  it("treats a person's days as a replacement, including days the card omits", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      people: [{ name: "A", days: ["sat"], schedule: { sat: [{ activity: "judo" }] } }],
    });
    const person = config.people[0]!;
    expect(person.days).toEqual(["sat"]);
    expect(person.schedule.sat).toHaveLength(1);
    expect(person.schedule.mon).toBeUndefined();
  });

  it("leaves person.days undefined when absent, so it inherits", () => {
    expect(normaliseConfig(minimal).people[0]!.days).toBeUndefined();
  });

  it("preserves blocks for stored days outside the current list, so narrowing is reversible", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      people: [
        {
          name: "A",
          schedule: {
            mon: [{ activity: "english" }],
            fri: [{ activity: "judo" }],
          },
        },
      ],
    });
    const person = config.people[0]!;
    expect(person.schedule.tue).toEqual([]);
    expect(person.schedule.fri).toEqual([{ activity: "judo" }]);
  });

  it("drops blocks with no usable activity id", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "" }, {}, { activity: "judo" }] } }],
    });
    expect(config.people[0]!.schedule.mon).toEqual([{ activity: "judo" }]);
  });

  it("keeps an activity id that matches no activity, for the orphan renderer", () => {
    const config = normaliseConfig({
      activities: [{ id: "judo", label: "Джудо", color: "#f97316" }],
      people: [{ name: "A", schedule: { mon: [{ activity: "gone" }] } }],
    });
    expect(config.people[0]!.schedule.mon).toEqual([{ activity: "gone" }]);
  });

  it("omits absent times rather than storing empty strings", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "x", start: "", end: "16:00" }] } }],
    });
    expect(config.people[0]!.schedule.mon![0]).toEqual({ activity: "x", end: "16:00" });
  });

  it("normalises activities and drops unusable ones", () => {
    const config = normaliseConfig({
      ...minimal,
      activities: [
        { id: "judo", label: "Джудо", color: "#f97316" },
        { id: "", label: "No id", color: "#000" },
        { label: "No id at all" },
        { id: "chess", label: "", color: "" },
      ],
    });
    expect(config.activities.map((a) => a.id)).toEqual(["judo", "chess"]);
    expect(config.activities[1]).toEqual({ id: "chess", label: "chess", color: "#888888" });
  });

  it("normalises slots and drops ones without both times", () => {
    const config = normaliseConfig({
      people: [
        {
          name: "A",
          slots: [
            { slot: 1, start: "08:00", end: "08:45" },
            { slot: 2, start: "08:45" },
            { start: "09:00", end: "09:45" },
          ],
          schedule: {},
        },
      ],
    });
    expect(config.people[0]!.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 3, start: "09:00", end: "09:45" },
    ]);
  });

  it("does not mutate the input", () => {
    const raw = { people: [{ name: "A", schedule: {} }] };
    const snapshot = JSON.stringify(raw);
    normaliseConfig(raw);
    expect(JSON.stringify(raw)).toBe(snapshot);
  });
});

describe("getStubConfig", () => {
  it("builds a Monday-to-Friday week regardless of first_weekday", () => {
    const config = getStubConfig({ locale: { first_weekday: "sunday" } });
    expect(config.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });

  it("uses Bulgarian example labels for a Bulgarian user", () => {
    const config = getStubConfig({ language: "bg" });
    expect(config.activities.some((a) => a.label === "Английски")).toBe(true);
  });

  it("uses English example labels otherwise", () => {
    const config = getStubConfig({ language: "de" });
    expect(config.activities.some((a) => a.label === "English")).toBe(true);
  });

  it("returns a config that survives normalisation unchanged", () => {
    const config = getStubConfig({ language: "bg" });
    expect(normaliseConfig(config)).toEqual(config);
  });

  it("references only activities it defines", () => {
    const config = getStubConfig();
    const ids = new Set(config.activities.map((a) => a.id));
    for (const person of config.people) {
      for (const blocks of Object.values(person.schedule)) {
        for (const block of blocks ?? []) {
          expect(ids.has(block.activity)).toBe(true);
        }
      }
    }
  });
});
