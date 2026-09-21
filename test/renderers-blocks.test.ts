import { describe, expect, it } from "vitest";
import { dayHeading, renderBlocks } from "../src/renderers/blocks.js";
import { BG_24H, makeContext, renderToHost, textsOf } from "./helpers.js";

const raw = {
  days: ["mon", "tue", "wed", "thu", "fri"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [
    {
      name: "Иван",
      schedule: {
        mon: [
          { activity: "english", start: "15:20", end: "16:20" },
          { activity: "judo", start: "17:30", end: "18:30" },
        ],
        tue: [{ activity: "daycare", end: "16:00" }],
      },
    },
  ],
};

// 2026-09-21 is a Monday.
const MONDAY = new Date(2026, 8, 21, 9, 0);

describe("dayHeading", () => {
  it("uses full names at full density", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "full" });
    expect(dayHeading(ctx, "mon")).toBe("понеделник");
  });

  it("uses authored short names at compact density", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "compact" });
    expect(dayHeading(ctx, "thu")).toBe("чт");
  });

  it("uses full names again when stacked, where width is not the constraint", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "stacked" });
    expect(dayHeading(ctx, "thu")).toBe("четвъртък");
  });
});

describe("renderBlocks", () => {
  it("renders one column per day in the configured order", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    expect(textsOf(host, ".day-head")).toEqual([
      "понеделник", "вторник", "сряда", "четвъртък", "петък",
    ]);
  });

  it("exposes the day count so the grid template can size itself", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    expect(host.querySelector(".week")!.getAttribute("style"))
      .toContain("--wtc-day-count: 5");
  });

  it("stacks a day's blocks in order", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const monday = host.querySelectorAll(".day")[0]!;
    expect([...monday.querySelectorAll(".block-label")].map((n) => n.textContent))
      .toEqual(["Английски", "Джудо"]);
  });

  it("marks exactly one column as today", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const today = host.querySelectorAll(".day.today");
    expect(today).toHaveLength(1);
    expect(today[0]!.querySelector(".day-head")!.textContent!.trim()).toBe("понеделник");
  });

  it("marks no column when highlight_today is off", () => {
    const ctx = makeContext({
      raw: { ...raw, highlight_today: false },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(host.querySelectorAll(".day.today")).toHaveLength(0);
  });

  it("marks no column when today is not in the configured days", () => {
    const ctx = makeContext({
      raw: { ...raw, days: ["sat", "sun"] },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(host.querySelectorAll(".day.today")).toHaveLength(0);
  });

  it("renders an empty-day message rather than a collapsed column", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const wednesday = host.querySelectorAll(".day")[2]!;
    expect(wednesday.querySelector(".empty")!.textContent!.trim()).toBe("Няма занимания");
  });

  it("follows a person's own day list", () => {
    const ctx = makeContext({
      raw: {
        ...raw,
        days: ["mon", "tue"],
        people: [{ name: "Иван", days: ["sat"], schedule: { sat: [{ activity: "judo" }] } }],
      },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(textsOf(host, ".day-head")).toEqual(["събота"]);
  });
});
