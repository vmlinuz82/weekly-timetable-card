import { describe, expect, it } from "vitest";
import { normaliseConfig } from "../src/config.js";
import {
  addActivity,
  addBlock,
  addPerson,
  addSlot,
  countActivityUses,
  moveBlock,
  moveBlockBy,
  removeActivity,
  removeBlock,
  removePerson,
  removeSlot,
  updateActivity,
  updateBlock,
  updateCard,
  updatePerson,
  updateSlot,
} from "../src/editor/mutations.js";
import type { CardConfig } from "../src/types.js";

const base = (): CardConfig =>
  normaliseConfig({
    days: ["mon", "tue"],
    activities: [
      { id: "english", label: "Английски", color: "#3b82f6" },
      { id: "judo", label: "Джудо", color: "#f97316" },
    ],
    people: [
      {
        name: "Иван",
        slots: [{ slot: 1, start: "08:00", end: "08:45" }],
        schedule: {
          mon: [
            { activity: "english", start: "15:20", end: "16:20" },
            { activity: "judo", start: "17:30", end: "18:30" },
          ],
          tue: [{ activity: "english" }],
        },
      },
      { name: "Мария", schedule: { mon: [], tue: [] } },
    ],
  });

/** Runs a mutation and asserts it neither returned nor mutated the input. */
function immutable(run: (config: CardConfig) => CardConfig): CardConfig {
  const config = base();
  const snapshot = JSON.stringify(config);
  const next = run(config);
  expect(JSON.stringify(config)).toBe(snapshot);
  expect(next).not.toBe(config);
  return next;
}

describe("updateCard", () => {
  it("patches card-level fields", () => {
    const next = immutable((config) => updateCard(config, { layout: "grid", title: "X" }));
    expect(next.layout).toBe("grid");
    expect(next.title).toBe("X");
    expect(next.people).toHaveLength(2);
  });
});

describe("people", () => {
  it("appends a person with an empty schedule", () => {
    const next = immutable((config) => addPerson(config, "Нов"));
    expect(next.people).toHaveLength(3);
    expect(next.people[2]).toEqual({ name: "Нов", schedule: {} });
  });

  it("removes a person", () => {
    const next = immutable((config) => removePerson(config, 0));
    expect(next.people.map((person) => person.name)).toEqual(["Мария"]);
  });

  it("refuses to remove the last person", () => {
    const config = normaliseConfig({ people: [{ name: "Solo", schedule: {} }] });
    expect(removePerson(config, 0)).toBe(config);
  });

  it("patches a person's name", () => {
    const next = immutable((config) => updatePerson(config, 1, { name: "Мери" }));
    expect(next.people[1]!.name).toBe("Мери");
    expect(next.people[0]!.name).toBe("Иван");
  });

  it("clears an optional field with null and sets it with a value", () => {
    const withEmoji = updatePerson(base(), 0, { emoji: "🎻", color: "#123456" });
    expect(withEmoji.people[0]!.emoji).toBe("🎻");
    const cleared = updatePerson(withEmoji, 0, { emoji: null, color: null });
    expect("emoji" in cleared.people[0]!).toBe(false);
    expect("color" in cleared.people[0]!).toBe(false);
  });

  it("clears a day override with null so the person inherits again", () => {
    const narrowed = updatePerson(base(), 0, { days: ["sat"] });
    expect(narrowed.people[0]!.days).toEqual(["sat"]);
    const restored = updatePerson(narrowed, 0, { days: null });
    expect("days" in restored.people[0]!).toBe(false);
  });

  it("treats an empty day list as clearing the override", () => {
    const next = updatePerson(base(), 0, { days: [] });
    expect("days" in next.people[0]!).toBe(false);
  });

  it("creates empty schedule arrays for days the override adds", () => {
    const next = updatePerson(base(), 0, { days: ["mon", "sat"] });
    expect(next.people[0]!.schedule.sat).toEqual([]);
    expect(next.people[0]!.schedule.mon).toHaveLength(2);
  });

  it("ignores an out-of-range person index", () => {
    const config = base();
    expect(updatePerson(config, 9, { name: "X" })).toBe(config);
  });
});

describe("blocks", () => {
  it("appends a block to a day", () => {
    const next = immutable((config) =>
      addBlock(config, 0, "tue", { activity: "judo", end: "16:00" }),
    );
    expect(next.people[0]!.schedule.tue).toEqual([
      { activity: "english" },
      { activity: "judo", end: "16:00" },
    ]);
  });

  it("patches a block's activity", () => {
    const next = immutable((config) => updateBlock(config, 0, "mon", 0, { activity: "judo" }));
    expect(next.people[0]!.schedule.mon![0]!.activity).toBe("judo");
  });

  it("clearing the start turns a range into the until form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { start: null });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english", end: "16:20" });
  });

  it("clearing the end turns a range into the after form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { end: "" });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english", start: "15:20" });
  });

  it("clearing both times gives the bare form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { start: null, end: null });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english" });
  });

  it("setting a time on a bare block gives the until form", () => {
    const next = updateBlock(base(), 0, "tue", 0, { end: "16:00" });
    expect(next.people[0]!.schedule.tue![0]).toEqual({ activity: "english", end: "16:00" });
  });

  it("removes a block", () => {
    const next = immutable((config) => removeBlock(config, 0, "mon", 0));
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
  });

  it("ignores an out-of-range block index", () => {
    const config = base();
    expect(removeBlock(config, 0, "mon", 9)).toBe(config);
    expect(updateBlock(config, 0, "mon", 9, { activity: "judo" })).toBe(config);
  });
});

describe("moving blocks", () => {
  it("reorders within a day", () => {
    const next = immutable((config) =>
      moveBlock(config, 0, { day: "mon", index: 0 }, { day: "mon", index: 1 }),
    );
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "judo", "english",
    ]);
  });

  it("moves to another day and removes it from the source exactly once", () => {
    const next = moveBlock(base(), 0, { day: "mon", index: 0 }, { day: "tue", index: 0 });
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
    expect(next.people[0]!.schedule.tue!.map((block) => block.activity)).toEqual([
      "english", "english",
    ]);
  });

  it("clamps a target index past the end", () => {
    const next = moveBlock(base(), 0, { day: "mon", index: 0 }, { day: "tue", index: 99 });
    expect(next.people[0]!.schedule.tue!).toHaveLength(2);
  });

  it("moveBlockBy shifts up and down", () => {
    const down = moveBlockBy(base(), 0, "mon", 0, 1);
    expect(down.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "judo", "english",
    ]);
    const up = moveBlockBy(down, 0, "mon", 1, -1);
    expect(up.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "english", "judo",
    ]);
  });

  it("moveBlockBy is a no-op at either end", () => {
    const config = base();
    expect(moveBlockBy(config, 0, "mon", 0, -1)).toBe(config);
    expect(moveBlockBy(config, 0, "mon", 1, 1)).toBe(config);
  });
});

describe("activities", () => {
  it("adds an activity with a generated id", () => {
    const next = immutable((config) => addActivity(config, "Шах", "#a855f7"));
    expect(next.activities[2]).toEqual({ id: "шах", label: "Шах", color: "#a855f7" });
  });

  it("suffixes a colliding generated id", () => {
    const once = addActivity(base(), "Шах", "#a855f7");
    const twice = addActivity(once, "Шах", "#000000");
    expect(twice.activities.map((activity) => activity.id)).toContain("шах-2");
  });

  it("renaming does not change the id, so blocks keep resolving", () => {
    const next = immutable((config) => updateActivity(config, 0, { label: "English" }));
    expect(next.activities[0]).toEqual({ id: "english", label: "English", color: "#3b82f6" });
    // The base() fixture has "english" in exactly two blocks (mon[0] and
    // tue[0]) across both people — not three. This corrects an arithmetic
    // mismatch in the brief's own test literal; see task-12-report.md.
    expect(countActivityUses(next, "english")).toBe(2);
  });

  it("removes an activity, leaving referencing blocks as orphans", () => {
    const next = immutable((config) => removeActivity(config, 0));
    expect(next.activities.map((activity) => activity.id)).toEqual(["judo"]);
    expect(next.people[0]!.schedule.mon![0]!.activity).toBe("english");
  });

  it("counts uses across every person and day", () => {
    // See the note above: the fixture has "english" in two blocks, not three.
    expect(countActivityUses(base(), "english")).toBe(2);
    expect(countActivityUses(base(), "judo")).toBe(1);
    expect(countActivityUses(base(), "missing")).toBe(0);
  });

  it("ignores out-of-range activity indices", () => {
    const config = base();
    expect(updateActivity(config, 9, { label: "X" })).toBe(config);
    expect(removeActivity(config, 9)).toBe(config);
  });
});

describe("slots", () => {
  it("appends a slot continuing from the previous one", () => {
    const next = immutable((config) => addSlot(config, 0));
    expect(next.people[0]!.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 2, start: "08:45", end: "09:30" },
    ]);
  });

  it("seeds the first slot when a person has none", () => {
    const next = addSlot(base(), 1);
    expect(next.people[1]!.slots).toEqual([{ slot: 1, start: "08:00", end: "08:45" }]);
  });

  it("patches and removes a slot", () => {
    const patched = updateSlot(base(), 0, 0, { end: "09:00" });
    expect(patched.people[0]!.slots![0]!.end).toBe("09:00");
    expect(removeSlot(patched, 0, 0).people[0]!.slots).toEqual([]);
  });

  it("ignores out-of-range slot indices", () => {
    const config = base();
    expect(updateSlot(config, 0, 9, { end: "09:00" })).toBe(config);
    expect(removeSlot(config, 0, 9)).toBe(config);
  });
});
