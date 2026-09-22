import { describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderSettingsPanel } from "../src/editor/settings-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

function mount(raw: unknown) {
  const config = normaliseConfig(raw);
  const commit = vi.fn<(next: CardConfig) => void>();
  const host = renderToHost(
    renderSettingsPanel({ config, strings: en, hass: undefined, commit }),
  );
  return { config, commit, host };
}

const raw = { schedule: {} };

describe("renderSettingsPanel", () => {
  it("shows the current values", () => {
    const { host } = mount({ ...raw, title: "Week", layout: "grid", header_color: "#ffffff" });
    expect(host.querySelector<HTMLInputElement>('[data-field="title"]')!.value).toBe("Week");
    expect(host.querySelector<HTMLSelectElement>('[data-field="layout"]')!.value).toBe("grid");
    expect(host.querySelector<HTMLInputElement>('[data-field="header_color"]')!.value)
      .toBe("#ffffff");
    expect(host.querySelector<HTMLInputElement>('[data-field="highlight_today"]')!.checked)
      .toBe(true);
  });

  it("commits a new config object on title change", () => {
    const { config, commit, host } = mount(raw);
    const input = host.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "Седмична програма";
    input.dispatchEvent(new Event("change"));

    expect(commit).toHaveBeenCalledOnce();
    const next = commit.mock.calls[0]![0];
    expect(next).not.toBe(config);
    expect(next.title).toBe("Седмична програма");
  });

  it("clears the title back to undefined when emptied", () => {
    const { commit, host } = mount({ ...raw, title: "Week" });
    const input = host.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].title).toBeUndefined();
  });

  it("commits a layout change", () => {
    const { commit, host } = mount(raw);
    const select = host.querySelector<HTMLSelectElement>('[data-field="layout"]')!;
    select.value = "grid";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].layout).toBe("grid");
  });

  it("renders all seven day chips with the configured ones pressed", () => {
    const { host } = mount(raw);
    const chips = host.querySelectorAll<HTMLButtonElement>(".chip[data-day]");
    expect(chips).toHaveLength(7);
    const pressed = [...chips].filter((chip) => chip.getAttribute("aria-pressed") === "true");
    expect(pressed.map((chip) => chip.dataset.day)).toEqual([
      "mon", "tue", "wed", "thu", "fri",
    ]);
  });

  it("adds a day when an unpressed chip is clicked", () => {
    const { commit, host } = mount(raw);
    host.querySelector<HTMLButtonElement>('.chip[data-day="sat"]')!.click();
    expect(commit.mock.calls[0]![0].days).toEqual(["mon", "tue", "wed", "thu", "fri", "sat"]);
  });

  it("removes a day when a pressed chip is clicked", () => {
    const { commit, host } = mount(raw);
    host.querySelector<HTMLButtonElement>('.chip[data-day="wed"]')!.click();
    expect(commit.mock.calls[0]![0].days).toEqual(["mon", "tue", "thu", "fri"]);
  });

  it("commits the language and highlight-today controls", () => {
    const { commit, host } = mount(raw);

    const language = host.querySelector<HTMLSelectElement>('[data-field="language"]')!;
    language.value = "bg";
    language.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].language).toBe("bg");

    const toggle = host.querySelector<HTMLInputElement>('[data-field="highlight_today"]')!;
    toggle.checked = false;
    toggle.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[1]![0].highlight_today).toBe(false);
  });

  it("orders the day chips by the Home Assistant first weekday", () => {
    const config = normaliseConfig(raw);
    const host = renderToHost(
      renderSettingsPanel({
        config,
        strings: en,
        hass: { locale: { first_weekday: "sunday" } },
        commit: vi.fn(),
      }),
    );
    const chips = [...host.querySelectorAll<HTMLButtonElement>(".chip[data-day]")];
    expect(chips[0]!.dataset.day).toBe("sun");
  });
});
