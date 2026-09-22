import { describe, expect, it } from "vitest";
import { normaliseConfig } from "../src/config.js";
import {
  addActivity,
  addBlock,
  addSlot,
  countActivityUses,
  moveBlock,
  moveBlockBy,
  removeActivity,
  removeBlock,
  removeSlot,
  updateActivity,
  updateBlock,
  updateCard,
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
    slots: [{ slot: 1, start: "08:00", end: "08:45" }],
    schedule: {
      mon: [
        { activity: "english", start: "15:20", end: "16:20" },
        { activity: "judo", start: "17:30", end: "18:30" },
      ],
      tue: [{ activity: "english" }],
    },
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
  });
});

describe("blocks", () => {
  it("appends a block to a day", () => {
    const next = immutable((config) =>
      addBlock(config, "tue", { activity: "judo", end: "16:00" }),
    );
    expect(next.schedule.tue).toEqual([
      { activity: "english" },
      { activity: "judo", end: "16:00" },
    ]);
  });

  it("patches a block's activity", () => {
    const next = immutable((config) => updateBlock(config, "mon", 0, { activity: "judo" }));
    expect(next.schedule.mon![0]!.activity).toBe("judo");
  });

  it("clearing the start turns a range into the until form", () => {
    const next = updateBlock(base(), "mon", 0, { start: null });
    expect(next.schedule.mon![0]).toEqual({ activity: "english", end: "16:20" });
  });

  it("clearing the end turns a range into the after form", () => {
    const next = updateBlock(base(), "mon", 0, { end: "" });
    expect(next.schedule.mon![0]).toEqual({ activity: "english", start: "15:20" });
  });

  it("clearing both times gives the bare form", () => {
    const next = updateBlock(base(), "mon", 0, { start: null, end: null });
    expect(next.schedule.mon![0]).toEqual({ activity: "english" });
  });

  it("setting a time on a bare block gives the until form", () => {
    const next = updateBlock(base(), "tue", 0, { end: "16:00" });
    expect(next.schedule.tue![0]).toEqual({ activity: "english", end: "16:00" });
  });

  it("removes a block", () => {
    const next = immutable((config) => removeBlock(config, "mon", 0));
    expect(next.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
  });

  it("ignores an out-of-range block index", () => {
    const config = base();
    expect(removeBlock(config, "mon", 9)).toBe(config);
    expect(updateBlock(config, "mon", 9, { activity: "judo" })).toBe(config);
  });
});

describe("moving blocks", () => {
  it("reorders within a day", () => {
    const next = immutable((config) =>
      moveBlock(config, { day: "mon", index: 0 }, { day: "mon", index: 1 }),
    );
    expect(next.schedule.mon!.map((block) => block.activity)).toEqual(["judo", "english"]);
  });

  it("moves to another day and removes it from the source exactly once", () => {
    const next = moveBlock(base(), { day: "mon", index: 0 }, { day: "tue", index: 0 });
    expect(next.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
    expect(next.schedule.tue!.map((block) => block.activity)).toEqual(["english", "english"]);
  });

  it("clamps a target index past the end", () => {
    const next = moveBlock(base(), { day: "mon", index: 0 }, { day: "tue", index: 99 });
    expect(next.schedule.tue!).toHaveLength(2);
  });

  it("moveBlockBy shifts up and down", () => {
    const down = immutable((config) => moveBlockBy(config, "mon", 0, 1));
    expect(down.schedule.mon!.map((block) => block.activity)).toEqual(["judo", "english"]);
    const up = immutable((config) =>
      moveBlockBy(moveBlockBy(config, "mon", 0, 1), "mon", 1, -1),
    );
    expect(up.schedule.mon!.map((block) => block.activity)).toEqual(["english", "judo"]);
  });

  it("moveBlockBy is a no-op at either end", () => {
    const config = base();
    expect(moveBlockBy(config, "mon", 0, -1)).toBe(config);
    expect(moveBlockBy(config, "mon", 1, 1)).toBe(config);
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
    expect(countActivityUses(next, "english")).toBe(2);
  });

  it("removes an activity, leaving referencing blocks as orphans", () => {
    const next = immutable((config) => removeActivity(config, 0));
    expect(next.activities.map((activity) => activity.id)).toEqual(["judo"]);
    expect(next.schedule.mon![0]!.activity).toBe("english");
  });

  it("counts uses across every day", () => {
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
    const next = immutable((config) => addSlot(config));
    expect(next.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 2, start: "08:45", end: "09:30" },
    ]);
  });

  it("seeds the first slot when the config has none", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      schedule: { mon: [], tue: [] },
    });
    const next = addSlot(config);
    expect(next.slots).toEqual([{ slot: 1, start: "08:00", end: "08:45" }]);
  });

  it("patches a slot", () => {
    const patched = immutable((config) => updateSlot(config, 0, { end: "09:00" }));
    expect(patched.slots![0]!.end).toBe("09:00");
  });

  it("removes a slot", () => {
    const removed = immutable((config) => removeSlot(updateSlot(config, 0, { end: "09:00" }), 0));
    expect(removed.slots).toEqual([]);
  });

  it("ignores out-of-range slot indices", () => {
    const config = base();
    expect(updateSlot(config, 9, { end: "09:00" })).toBe(config);
    expect(removeSlot(config, 9)).toBe(config);
  });
});
