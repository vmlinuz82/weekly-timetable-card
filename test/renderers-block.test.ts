import { describe, expect, it } from "vitest";
import { blockTimeLabel, blockTimeLines, renderBlock } from "../src/renderers/block.js";
import { BG_24H, EN_12H, makeContext, renderToHost, textOf } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
    { id: "daycare", title: "Занималня", color: "#64748b" },
    { id: "home", title: "Връщане вкъщи", color: "#22c55e" },
    { id: "free", title: "Свободен следобед", color: "#22c55e" },
  ],
  schedule: {},
};

const bg = makeContext({ raw, hass: BG_24H });
const en = makeContext({ raw, hass: EN_12H });
/**
 * Since ICU 72, `Intl` separates the time from AM/PM with U+202F (narrow
 * no-break space) rather than U+0020 — and ICU 76 reverted it. Node 22.x has
 * shipped both, and all three workflows pin a floating `node-version: 22`, so
 * the assertions below must accept either. The class holds U+0020 and U+202F —
 * indistinguishable on screen, so check the bytes before editing this line.
 */
const flat = (value: string) => value.replace(/[  ]/g, " ");

describe("blockTimeLabel", () => {
  it("renders a range", () => {
    expect(blockTimeLabel(bg, { activity: "english", start: "15:20", end: "16:20" }))
      .toBe("15:20–16:20");
  });

  it("renders the until form in Bulgarian and English", () => {
    expect(blockTimeLabel(bg, { activity: "daycare", end: "16:00" })).toBe("до 16:00");
    expect(flat(blockTimeLabel(en, { activity: "daycare", end: "16:00" })))
      .toBe("until 4:00 PM");
  });

  it("renders the after form in Bulgarian and English", () => {
    expect(blockTimeLabel(bg, { activity: "home", start: "18:30" })).toBe("след 18:30");
    expect(flat(blockTimeLabel(en, { activity: "home", start: "18:30" })))
      .toBe("after 6:30 PM");
  });

  it("renders nothing for a bare block", () => {
    expect(blockTimeLabel(bg, { activity: "free" })).toBe("");
  });
});

describe("renderBlock", () => {
  it("shows the activity title and the time line", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }),
    );
    expect(textOf(host, ".block-title")).toBe("Английски");
    expect(textOf(host, ".block-time-top")).toBe("15:20");
    expect(textOf(host, ".block-time-bottom")).toBe("16:20");
  });

  it("omits the time element entirely for a bare block", () => {
    const host = renderToHost(renderBlock(bg, { activity: "free" }));
    expect(host.querySelector(".block-time")).toBeNull();
    expect(textOf(host, ".block-title")).toBe("Свободен следобед");
  });

  it("sets the derived fill and border custom properties", () => {
    const host = renderToHost(renderBlock(bg, { activity: "english" }));
    const style = host.querySelector(".block")!.getAttribute("style") ?? "";
    expect(style).toContain("--wtc-block-fill");
    expect(style).toContain("#3b82f6 14%");
    expect(style).toContain("#3b82f6 35%");
  });

  it("renders an orphaned reference as a grey block showing the raw id", () => {
    const host = renderToHost(renderBlock(bg, { activity: "gone" }));
    const block = host.querySelector(".block")!;
    expect(block.classList.contains("orphan")).toBe(true);
    expect(textOf(host, ".block-title")).toBe("gone");
    expect(host.querySelector(".block-subtitle")).toBeNull();
    expect(block.getAttribute("title")).toBe(bg.strings.editor.orphanActivity);
  });

  it("does not mark a known activity as an orphan", () => {
    const host = renderToHost(renderBlock(bg, { activity: "english" }));
    const block = host.querySelector(".block")!;
    expect(block.classList.contains("orphan")).toBe(false);
    expect(block.hasAttribute("title")).toBe(false);
  });

  it("renders the time as two stacked lines beside a title and subtitle", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }),
    );
    expect(textOf(host, ".block-time-top")).toBe("15:20");
    expect(textOf(host, ".block-time-bottom")).toBe("16:20");
    expect(host.querySelector(".block-time > .block-time-top")).not.toBeNull();
    expect(host.querySelector(".block-time > .block-time-bottom")).not.toBeNull();
    expect(textOf(host, ".block-title")).toBe("Английски");
    expect(textOf(host, ".block-subtitle")).toBe("Стая 12");
    expect(host.querySelector(".block-text > .block-title")).not.toBeNull();
    expect(host.querySelector(".block-text > .block-subtitle")).not.toBeNull();
  });

  it("omits the subtitle element when the activity has none", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "daycare", start: "15:20", end: "16:20" }),
    );
    expect(textOf(host, ".block-title")).toBe("Занималня");
    expect(host.querySelector(".block-subtitle")).toBeNull();
  });

  it("renders the id as the title when the activity's title is blank", () => {
    const blank = makeContext({
      raw: { activities: [{ id: "english", title: "", color: "#3b82f6" }], schedule: {} },
      hass: BG_24H,
    });
    const host = renderToHost(renderBlock(blank, { activity: "english" }));
    expect(textOf(host, ".block-title")).toBe("english");
    expect(host.querySelector(".block")!.classList.contains("orphan")).toBe(false);
  });

  it("omits the time column when asked to hide it", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }, { hideTime: true }),
    );
    expect(host.querySelector(".block-time")).toBeNull();
    expect(textOf(host, ".block-title")).toBe("Английски");
  });
});

describe("blockTimeLines", () => {
  it("stacks start over end for a range", () => {
    expect(blockTimeLines(bg, { activity: "english", start: "15:20", end: "16:20" })).toEqual({
      top: "15:20",
      bottom: "16:20",
    });
  });

  it("puts the wording word above the time for an end-only block", () => {
    expect(blockTimeLines(bg, { activity: "daycare", end: "16:00" })).toEqual({
      top: "до",
      bottom: "16:00",
    });
    const lines = blockTimeLines(en, { activity: "daycare", end: "16:00" })!;
    expect(lines.top).toBe("until");
    expect(flat(lines.bottom)).toBe("4:00 PM");
  });

  it("puts the wording word above the time for a start-only block", () => {
    expect(blockTimeLines(bg, { activity: "home", start: "18:30" })).toEqual({
      top: "след",
      bottom: "18:30",
    });
    const lines = blockTimeLines(en, { activity: "home", start: "18:30" })!;
    expect(lines.top).toBe("after");
    expect(flat(lines.bottom)).toBe("6:30 PM");
  });

  it("returns null for a block with no times at all", () => {
    expect(blockTimeLines(bg, { activity: "free" })).toBeNull();
  });

  it("keeps an end-only and a start-only block distinguishable", () => {
    // The wording word is the only thing separating them once the time is on
    // its own line — this is the assertion that fails if it is ever dropped.
    expect(blockTimeLines(bg, { activity: "english", end: "16:00" })).not.toEqual(
      blockTimeLines(bg, { activity: "english", start: "16:00" }),
    );
  });
});
