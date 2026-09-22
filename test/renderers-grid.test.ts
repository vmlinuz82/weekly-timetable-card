import { describe, expect, it } from "vitest";
import { renderGrid } from "../src/renderers/grid.js";
import { BG_24H, makeContext, renderToHost, textsOf } from "./helpers.js";

const MONDAY = new Date(2026, 8, 21, 9, 0);

const raw = {
  layout: "grid",
  days: ["mon", "tue"],
  activities: [
    { id: "maths", title: "Математика", color: "#3b82f6" },
    { id: "daycare", title: "Занималня", color: "#64748b" },
    { id: "judo", title: "Джудо", color: "#f97316" },
  ],
  slots: [
    { slot: 1, start: "08:00", end: "08:45" },
    { slot: 2, start: "08:45", end: "09:30" },
  ],
  schedule: {
    mon: [
      { activity: "maths", start: "08:00", end: "08:45" },
      { activity: "daycare", end: "16:00" },
    ],
    tue: [{ activity: "judo", start: "17:30", end: "18:30" }],
  },
};

describe("renderGrid", () => {
  it("renders a header per day plus a leading corner cell", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    expect(textsOf(host, ".grid-head")).toEqual(["понеделник", "вторник"]);
    expect(host.querySelectorAll(".grid-corner")).toHaveLength(1);
  });

  it("labels each slot row with its time range", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    expect(textsOf(host, ".slot-label")).toEqual(["08:00–08:45", "08:45–09:30"]);
  });

  it("places a matching range block in its slot cell", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    const firstRowMonday = host.querySelectorAll(".grid-cell")[0]!;
    expect(firstRowMonday.querySelector(".block-title")!.textContent!.trim())
      .toBe("Математика");
  });

  it("puts open-ended and unmatched blocks in the strip above the grid", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    const strip = host.querySelector(".strip")!;
    expect([...strip.querySelectorAll(".block-title")].map((n) => n.textContent!.trim()))
      .toEqual(["Занималня", "Джудо"]);
    // The strip precedes the grid in document order.
    expect(strip.compareDocumentPosition(host.querySelector(".grid")!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("omits the strip entirely when every block sits on the ruler", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            slots: raw.slots,
            schedule: { mon: [{ activity: "maths", start: "08:00", end: "08:45" }], tue: [] },
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(host.querySelector(".strip")).toBeNull();
  });

  it("marks today's cells", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    // Two slot rows, Monday column in each.
    expect(host.querySelectorAll(".grid-cell.today")).toHaveLength(2);
  });

  it("prompts for slots and shows only the strip when none are defined", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            slots: undefined,
            schedule: { mon: [{ activity: "judo" }], tue: [] },
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(host.querySelector(".grid")).toBeNull();
    expect(host.querySelector(".no-slots")!.textContent!.trim())
      .toBe("Добавете часови интервали, за да използвате изгледа „Мрежа“.");
    expect(host.querySelector(".strip")).not.toBeNull();
  });

  it("marks today's column header, not only its cells", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    const marked = [...host.querySelectorAll(".grid-head.today")];
    expect(marked).toHaveLength(1);
    expect(marked[0]!.textContent!.trim()).toBe("понеделник");
  });

  it("still names the day columns when no slots are defined", () => {
    // The .grid element owns the day headers, and it is replaced by the
    // no-slots prompt — so the strip above would otherwise sit under
    // unlabelled columns.
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            slots: undefined,
            schedule: { mon: [{ activity: "judo" }], tue: [] },
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(host.querySelector(".grid")).toBeNull();
    expect(host.querySelector(".no-slots")).not.toBeNull();
    expect(textsOf(host, ".grid-heads .grid-head")).toEqual(["понеделник", "вторник"]);
  });

  it("orders slot rows by slot number, not config order", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            slots: [
              { slot: 2, start: "08:45", end: "09:30" },
              { slot: 1, start: "08:00", end: "08:45" },
            ],
            schedule: { mon: [], tue: [] },
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(textsOf(host, ".slot-label")).toEqual(["08:00–08:45", "08:45–09:30"]);
  });

  it("does not repeat the slot's time inside a block placed on that slot", () => {
    const ctx = makeContext({
      raw: {
        layout: "grid",
        days: ["mon"],
        activities: [{ id: "english", title: "Английски", color: "#3b82f6" }],
        slots: [{ slot: 1, start: "15:20", end: "16:20" }],
        schedule: { mon: [{ activity: "english", start: "15:20", end: "16:20" }] },
      },
      hass: BG_24H,
    });
    const host = renderToHost(renderGrid(ctx));

    const cell = host.querySelector(".grid-cell")!;
    expect(cell.querySelector(".block-title")!.textContent!.trim()).toBe("Английски");
    expect(cell.querySelector(".block-time")).toBeNull();
  });

  it("keeps the time on a block in the open-ended strip, which has no row", () => {
    const ctx = makeContext({
      raw: {
        layout: "grid",
        days: ["mon"],
        activities: [{ id: "daycare", title: "Занималня", color: "#64748b" }],
        slots: [{ slot: 1, start: "15:20", end: "16:20" }],
        schedule: { mon: [{ activity: "daycare", end: "16:00" }] },
      },
      hass: BG_24H,
    });
    const host = renderToHost(renderGrid(ctx));

    const strip = host.querySelector(".strip-cell")!;
    expect(strip.querySelector(".block-time-top")!.textContent!.trim()).toBe("до");
    expect(strip.querySelector(".block-time-bottom")!.textContent!.trim()).toBe("16:00");
  });
});
