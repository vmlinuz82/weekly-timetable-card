import { describe, expect, it } from "vitest";
import {
  adjustForRemoval,
  insertionIndex,
  parseDragSource,
  type Bounds,
  type DragSource,
} from "../src/editor/dnd.js";

function fixture(): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = `
    <div class="day-group" data-day="mon">
      <div class="row" data-block-index="0">
        <span class="drag-handle" data-drag-block="0" data-drag-day="mon">handle</span>
      </div>
    </div>
    <button class="palette-chip" data-palette-activity="judo"><span>Judo</span></button>
    <button class="chip" data-action="add-block">add</button>
  `;
  return host;
}

describe("parseDragSource", () => {
  it("reads a block source from the handle, including a click on a child node", () => {
    const host = fixture();
    const handle = host.querySelector("[data-drag-block]")!;
    expect(parseDragSource(handle)).toEqual({ kind: "block", day: "mon", index: 0 });
    expect(parseDragSource(handle.firstChild as Element | null ?? handle))
      .toEqual({ kind: "block", day: "mon", index: 0 });
  });

  it("reads an activity source from a palette chip, including from its inner span", () => {
    const host = fixture();
    expect(parseDragSource(host.querySelector(".palette-chip")!))
      .toEqual({ kind: "activity", activityId: "judo" });
    expect(parseDragSource(host.querySelector(".palette-chip span")!))
      .toEqual({ kind: "activity", activityId: "judo" });
  });

  it("returns null for anything that is not a drag source", () => {
    const host = fixture();
    expect(parseDragSource(host.querySelector('[data-action="add-block"]')!)).toBeNull();
    expect(parseDragSource(null)).toBeNull();
  });

  it("rejects a handle with an invalid day", () => {
    const host = document.createElement("div");
    host.innerHTML = `<span data-drag-block="0" data-drag-day="xx"></span>`;
    expect(parseDragSource(host.firstElementChild)).toBeNull();
  });
});

describe("parseDragSource with allowRow", () => {
  function rowFixture(): HTMLElement {
    const host = document.createElement("div");
    host.innerHTML = `
      <div class="day-group" data-day="tue">
        <div class="block-rows">
          <div class="row" data-block-index="2">
            <span class="drag-handle" data-drag-block="2" data-drag-day="tue">handle</span>
            <select data-field="activity"><option>x</option></select>
            <input type="time" data-field="start" />
            <button data-action="remove-block">x</button>
          </div>
        </div>
      </div>
    `;
    return host;
  }

  it("treats the row itself as a block source when rows are allowed", () => {
    const row = rowFixture().querySelector<HTMLElement>("[data-block-index]")!;
    expect(parseDragSource(row, true)).toEqual({ kind: "block", day: "tue", index: 2 });
  });

  it("ignores the row when rows are not allowed (touch keeps grip-only)", () => {
    const row = rowFixture().querySelector<HTMLElement>("[data-block-index]")!;
    expect(parseDragSource(row, false)).toBeNull();
    expect(parseDragSource(row)).toBeNull();
  });

  it("never starts a drag from a control inside the row", () => {
    const host = rowFixture();
    for (const selector of ["select", "input", "button"]) {
      expect(parseDragSource(host.querySelector(selector), true), selector).toBeNull();
    }
  });

  it("still reads the grip regardless of the row flag", () => {
    const grip = rowFixture().querySelector<HTMLElement>("[data-drag-block]")!;
    expect(parseDragSource(grip, false)).toEqual({ kind: "block", day: "tue", index: 2 });
  });
});

describe("insertionIndex", () => {
  const bounds: Bounds[] = [
    { top: 0, bottom: 20 },
    { top: 20, bottom: 40 },
    { top: 40, bottom: 60 },
  ];

  it("inserts before a row when above its midpoint", () => {
    expect(insertionIndex(bounds, 5)).toBe(0);
    expect(insertionIndex(bounds, 25)).toBe(1);
  });

  it("inserts after a row when below its midpoint", () => {
    expect(insertionIndex(bounds, 15)).toBe(1);
    expect(insertionIndex(bounds, 35)).toBe(2);
  });

  it("appends past the last row", () => {
    expect(insertionIndex(bounds, 100)).toBe(3);
  });

  it("returns 0 for an empty day", () => {
    expect(insertionIndex([], 100)).toBe(0);
  });
});

describe("adjustForRemoval", () => {
  const block: DragSource = { kind: "block", day: "mon", index: 1 };

  it("decrements a same-day target below the source, because the source is spliced out first", () => {
    expect(adjustForRemoval(block, "mon", 3)).toBe(2);
    expect(adjustForRemoval(block, "mon", 2)).toBe(1);
  });

  it("leaves a same-day target at or above the source alone", () => {
    expect(adjustForRemoval(block, "mon", 1)).toBe(1);
    expect(adjustForRemoval(block, "mon", 0)).toBe(0);
  });

  it("leaves a cross-day target alone", () => {
    expect(adjustForRemoval(block, "tue", 3)).toBe(3);
  });

  it("leaves an activity source alone", () => {
    expect(adjustForRemoval({ kind: "activity", activityId: "judo" }, "mon", 3)).toBe(3);
  });
});
