import { describe, expect, it, vi } from "vitest";
import { getStubConfig } from "../src/config.js";
import "../src/editor/editor.js";
import type { WeeklyTimetableCardEditor } from "../src/editor/editor.js";
import type { CardConfig } from "../src/types.js";
import { BG_24H, EN_12H } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [{ id: "english", title: "Английски", color: "#3b82f6" }],
  schedule: { mon: [{ activity: "english" }], tue: [] },
};

async function mount(config: unknown = raw, hass = EN_12H) {
  const editor = document.createElement(
    "weekly-timetable-card-editor",
  ) as WeeklyTimetableCardEditor;
  editor.hass = hass;
  editor.setConfig(config);
  document.body.append(editor);
  await editor.updateComplete;

  const events: CardConfig[] = [];
  editor.addEventListener("config-changed", (event) => {
    events.push((event as CustomEvent<{ config: CardConfig }>).detail.config);
  });
  return { editor, events, shadow: editor.shadowRoot! };
}

describe("WeeklyTimetableCardEditor", () => {
  it("is registered", () => {
    expect(customElements.get("weekly-timetable-card-editor")).toBeDefined();
  });

  it("exposes exactly three fixed tabs", async () => {
    const el = document.createElement("weekly-timetable-card-editor") as WeeklyTimetableCardEditor;
    document.body.append(el);
    el.setConfig(getStubConfig());
    await el.updateComplete;

    const tabs = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".tab")];
    expect(tabs.map((tab) => tab.dataset.tab)).toEqual(["settings", "schedule", "activities"]);
    expect(el.shadowRoot!.querySelector('[data-tab="add"]')).toBeNull();
    expect(el.shadowRoot!.querySelector('[data-tab="person"]')).toBeNull();
    el.remove();
  });

  it("opens on the Settings panel", async () => {
    const { shadow } = await mount();
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
  });

  it("switches to the schedule panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;
    expect(shadow.querySelector('[data-day="mon"]')).not.toBeNull();
  });

  it("switches to the Activities panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelector<HTMLButtonElement>('[data-tab="activities"]')!.click();
    await editor.updateComplete;
    expect(shadow.querySelector('[data-field="new-title"]')).not.toBeNull();
  });

  it("fires config-changed with a new object when a panel commits", async () => {
    const { editor, events, shadow } = await mount();
    const input = shadow.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "Седмична програма";
    input.dispatchEvent(new Event("change"));
    await editor.updateComplete;

    expect(events).toHaveLength(1);
    expect(events[0]!.title).toBe("Седмична програма");
  });

  it("fires a config-changed event that bubbles and is composed", async () => {
    const { editor, shadow } = await mount();
    const listener = vi.fn<(event: Event) => void>();
    document.body.addEventListener("config-changed", listener);

    const input = shadow.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "X";
    input.dispatchEvent(new Event("change"));
    await editor.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    // `composed` is what lets the event escape the editor's shadow root. Assert
    // it directly: bubbling alone would reach document.body in this test even
    // if composed were false, so a call-count assertion proves nothing here.
    expect(listener.mock.calls[0]![0].composed).toBe(true);
    document.body.removeEventListener("config-changed", listener);
  });

  it("renders its own chrome in the viewer's language", async () => {
    const { shadow } = await mount(raw, BG_24H);
    expect(shadow.querySelector(".tab")!.textContent!.trim()).toBe("Настройки");
  });

  it("keeps a tap-to-place selection across a re-render", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;

    shadow.querySelector<HTMLButtonElement>(".palette-chip")!.click();
    await editor.updateComplete;
    expect(shadow.querySelector(".palette-chip")!.getAttribute("aria-pressed")).toBe("true");
  });
});
