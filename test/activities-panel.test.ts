import { afterEach, describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderActivitiesPanel } from "../src/editor/activities-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", title: "Английски", color: "#3b82f6" },
    { id: "judo", title: "Джудо", color: "#f97316" },
  ],
  schedule: { mon: [{ activity: "english" }] },
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
  it("lists every activity with its title and colour", () => {
    const { host } = mount();
    const titles = [...host.querySelectorAll<HTMLInputElement>('[data-field="title"]')];
    expect(titles.map((input) => input.value)).toEqual(["Английски", "Джудо"]);
    expect(host.querySelector<HTMLInputElement>('[data-field="color"]')!.value).toBe("#3b82f6");
  });

  it("renames without changing the id", () => {
    const { commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="title"]')[0]!;
    input.value = "English";
    input.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.activities[0]).toEqual({ id: "english", title: "English", color: "#3b82f6" });
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
    const input = host.querySelector<HTMLInputElement>('[data-field="new-title"]')!;
    input.value = "Шах";
    host.querySelector<HTMLButtonElement>('[data-action="add-activity"]')!.click();

    const next = commit.mock.calls[0]![0];
    expect(next.activities[2]).toMatchObject({ id: "шах", title: "Шах" });
  });

  it("ignores an add with a blank title", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLInputElement>('[data-field="new-title"]')!.value = "   ";
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

  it("edits an activity's subtitle", () => {
    const { commit, host } = mount();
    const input = host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!;
    input.value = "Стая 12";
    input.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.activities[0]).toEqual({
      id: "english",
      title: "Английски",
      subtitle: "Стая 12",
      color: "#3b82f6",
    });
  });

  it("shows an existing subtitle in the field", () => {
    const { host } = mount({
      activities: [
        { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
      ],
      schedule: {},
    });
    expect(host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!.value)
      .toBe("Стая 12");
  });

  it("emptying the field commits an empty subtitle, which normalisation then drops", () => {
    const { commit, host } = mount({
      activities: [
        { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
      ],
      schedule: {},
    });
    const input = host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!;
    input.value = "";
    input.dispatchEvent(new Event("change"));

    // updateActivity is a plain spread, so the in-editor config carries "".
    // The renderer treats "" as absent, and normaliseConfig strips the key on
    // the next load. Asserted so nobody "fixes" this into a delete and breaks
    // the round-trip.
    expect(commit.mock.calls[0]![0].activities[0]!.subtitle).toBe("");
  });

  it("edits the second row's subtitle without touching the first", () => {
    const { config, commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="subtitle"]')[1]!;
    input.value = "Зала 2";
    input.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.activities[1]!.subtitle).toBe("Зала 2");
    expect(next.activities[0]).toEqual(config.activities[0]);
  });
});
