import { describe, expect, it, vi } from "vitest";
import "../src/editor/editor.js";
import type { WeeklyTimetableCardEditor } from "../src/editor/editor.js";
import type { CardConfig } from "../src/types.js";
import { BG_24H, EN_12H } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [{ id: "english", label: "Английски", color: "#3b82f6" }],
  people: [
    { name: "Иван", schedule: { mon: [{ activity: "english" }], tue: [] } },
    { name: "Мария", schedule: { mon: [], tue: [] } },
  ],
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

  it("renders Settings, a tab per person, add and Activities", async () => {
    const { shadow } = await mount();
    const labels = [...shadow.querySelectorAll(".tab")].map((tab) => tab.textContent!.trim());
    expect(labels).toEqual(["Settings", "Иван", "Мария", "＋", "Activities"]);
  });

  it("opens on the Settings panel", async () => {
    const { shadow } = await mount();
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
  });

  it("switches to a person panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;
    expect(shadow.querySelector<HTMLInputElement>('[data-field="name"]')!.value).toBe("Иван");
  });

  it("switches to the Activities panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelector<HTMLButtonElement>('[data-tab="activities"]')!.click();
    await editor.updateComplete;
    expect(shadow.querySelector('[data-field="new-label"]')).not.toBeNull();
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

  it("returns to Settings when the open person is removed from within the editor", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;

    shadow.querySelector<HTMLButtonElement>('[data-action="remove-person"]')!.click();
    await editor.updateComplete;

    // Settings panel is showing, not a blank panel and not the other person's.
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
    expect(shadow.querySelector('[data-field="name"]')).toBeNull();
  });

  it("adds a person and selects the new tab", async () => {
    const { editor, events, shadow } = await mount();
    shadow.querySelector<HTMLButtonElement>('[data-tab="add"]')!.click();
    await editor.updateComplete;

    expect(events[0]!.people).toHaveLength(3);
    expect(shadow.querySelector<HTMLInputElement>('[data-field="name"]')!.value).toBe("");
  });

  it("falls back to Settings when the open person tab disappears", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[2]!.click();
    await editor.updateComplete;

    editor.setConfig({ ...raw, people: [raw.people[0]] });
    await editor.updateComplete;
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
  });

  it("renders its own chrome in the viewer's language", async () => {
    const { shadow } = await mount(raw, BG_24H);
    expect(shadow.querySelector(".tab")!.textContent!.trim()).toBe("Настройки");
  });

  it("tears down drag listeners when the editor is removed from the DOM", async () => {
    const { editor } = await mount();
    const removeSpy = vi.spyOn(window, "removeEventListener");

    editor.remove();
    await Promise.resolve();

    const removed = removeSpy.mock.calls.map((call) => call[0]);
    expect(removed).toContain("pointermove");
    expect(removed).toContain("pointerup");
    expect(removed).toContain("pointercancel");
    removeSpy.mockRestore();
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
