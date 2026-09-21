import { describe, expect, it } from "vitest";
import { gridPlacement } from "../src/grid-placement.js";
import type { Slot } from "../src/types.js";

const slots: Slot[] = [
  { slot: 1, start: "08:00", end: "08:45" },
  { slot: 2, start: "08:45", end: "09:30" },
];

describe("gridPlacement", () => {
  it("places a range block on the slot whose times it matches exactly", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "maths", start: "08:45", end: "09:30" },
    ]);
    expect(bySlot.get(2)).toEqual([{ activity: "maths", start: "08:45", end: "09:30" }]);
    expect(loose).toEqual([]);
  });

  it("sends a range matching no slot to the loose strip", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "judo", start: "17:30", end: "18:30" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose).toHaveLength(1);
  });

  it("sends every open-ended and bare block to the loose strip", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "daycare", end: "16:00" },
      { activity: "home", start: "18:30" },
      { activity: "free" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose.map((block) => block.activity)).toEqual(["daycare", "home", "free"]);
  });

  it("keeps several blocks in one slot, in order", () => {
    const { bySlot } = gridPlacement(slots, [
      { activity: "a", start: "08:00", end: "08:45" },
      { activity: "b", start: "08:00", end: "08:45" },
    ]);
    expect(bySlot.get(1)!.map((block) => block.activity)).toEqual(["a", "b"]);
  });

  it("treats everything as loose when there are no slots", () => {
    const { bySlot, loose } = gridPlacement([], [
      { activity: "maths", start: "08:00", end: "08:45" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose).toHaveLength(1);
  });

  it("does not mutate the blocks it is given", () => {
    const blocks = [{ activity: "maths", start: "08:00", end: "08:45" }];
    const snapshot = JSON.stringify(blocks);
    gridPlacement(slots, blocks);
    expect(JSON.stringify(blocks)).toBe(snapshot);
  });
});
