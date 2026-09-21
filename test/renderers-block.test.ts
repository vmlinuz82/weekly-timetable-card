import { describe, expect, it } from "vitest";
import { blockTimeLabel, renderBlock } from "../src/renderers/block.js";
import { BG_24H, EN_12H, makeContext, renderToHost, textOf } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "home", label: "Връщане вкъщи", color: "#22c55e" },
    { id: "free", label: "Свободен следобед", color: "#22c55e" },
  ],
  people: [{ name: "Иван", schedule: {} }],
};

const bg = makeContext({ raw, hass: BG_24H });
const en = makeContext({ raw, hass: EN_12H });
const flat = (value: string) => value.replace(/ /g, " ");

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
  it("shows the activity label and the time line", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }),
    );
    expect(textOf(host, ".block-label")).toBe("Английски");
    expect(textOf(host, ".block-time")).toBe("15:20–16:20");
  });

  it("omits the time element entirely for a bare block", () => {
    const host = renderToHost(renderBlock(bg, { activity: "free" }));
    expect(host.querySelector(".block-time")).toBeNull();
    expect(textOf(host, ".block-label")).toBe("Свободен следобед");
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
    expect(textOf(host, ".block-label")).toBe("gone");
    expect(block.getAttribute("title")).toBe(bg.strings.editor.orphanActivity);
  });

  it("does not mark a known activity as an orphan", () => {
    const host = renderToHost(renderBlock(bg, { activity: "english" }));
    const block = host.querySelector(".block")!;
    expect(block.classList.contains("orphan")).toBe(false);
    expect(block.hasAttribute("title")).toBe(false);
  });
});
