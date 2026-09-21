import { afterEach, describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderActivitiesPanel } from "../src/editor/activities-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [{ name: "Иван", schedule: { mon: [{ activity: "english" }] } }],
};

function mount(source: unknown = raw) {
  const config = normaliseConfig(source);
  const commit = vi.fn<(next: CardConfig) => void>();
  const host = renderToHost(
    renderActivitiesPanel({ config, strings: en, hass: undefined, commit }),
  );
  return { config, commit, host };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("renderActivitiesPanel", () => {
  it("lists every activity with its label and colour", () => {
    const { host } = mount();
    const labels = [...host.querySelectorAll<HTMLInputElement>('[data-field="label"]')];
    expect(labels.map((input) => input.value)).toEqual(["Английски", "Джудо"]);
    expect(host.querySelector<HTMLInputElement>('[data-field="color"]')!.value).toBe("#3b82f6");
  });

  it("renames without changing the id", () => {
    const { commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="label"]')[0]!;
    input.value = "English";
    input.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.activities[0]).toEqual({ id: "english", label: "English", color: "#3b82f6" });
  });

  it("commits a colour change", () => {
    const { commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="color"]')[1]!;
    input.value = "#ff0000";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].activities[1]!.color).toBe("#ff0000");
  });

  it("adds an activity from the new-activity field", () => {
    const { commit, host } = mount();
    const input = host.querySelector<HTMLInputElement>('[data-field="new-label"]')!;
    input.value = "Шах";
    host.querySelector<HTMLButtonElement>('[data-action="add-activity"]')!.click();

    const next = commit.mock.calls[0]![0];
    expect(next.activities[2]).toMatchObject({ id: "шах", label: "Шах" });
  });

  it("ignores an add with a blank label", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLInputElement>('[data-field="new-label"]')!.value = "   ";
    host.querySelector<HTMLButtonElement>('[data-action="add-activity"]')!.click();
    expect(commit).not.toHaveBeenCalled();
  });

  it("removes an unused activity without asking", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[1]!.click();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(commit.mock.calls[0]![0].activities.map((a) => a.id)).toEqual(["english"]);
  });

  it("warns before removing an activity still in use, naming the count", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[0]!.click();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(confirmSpy.mock.calls[0]![0]).toContain("1 block");
    expect(commit).toHaveBeenCalledOnce();
  });

  it("keeps the activity when the warning is declined", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[0]!.click();
    expect(commit).not.toHaveBeenCalled();
  });

  it("shows a live preview chip per activity", () => {
    const { host } = mount();
    expect(host.querySelectorAll(".block")).toHaveLength(2);
  });
});
