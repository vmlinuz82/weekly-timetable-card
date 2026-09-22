import { describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderSchedulePanel } from "../src/editor/schedule-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  slots: [
    { slot: 1, start: "08:00", end: "08:45" },
    { slot: 2, start: "08:45", end: "09:30" },
  ],
  schedule: {
    mon: [
      { activity: "english", start: "15:20", end: "16:20" },
      { activity: "judo", start: "17:30", end: "18:30" },
    ],
    tue: [{ activity: "english", end: "16:00" }],
  },
};

function mount(source: unknown = raw) {
  const config = normaliseConfig(source);
  const commit = vi.fn<(next: CardConfig) => void>();
  const onSelectActivity = vi.fn<(id: string | null) => void>();
  const host = renderToHost(
    renderSchedulePanel(
      { config, strings: en, hass: undefined, commit },
      { selectedActivity: null, onSelectActivity },
    ),
  );
  return { config, commit, onSelectActivity, host };
}

const rows = (host: HTMLElement, day: string) =>
  [...host.querySelectorAll<HTMLElement>(`[data-day="${day}"] [data-block-index]`)];

describe("slots", () => {
  it("are hidden in the blocks layout", () => {
    const { host } = mount();
    expect(host.querySelector('[data-section="slots"]')).toBeNull();
  });

  it("are listed in the grid layout", () => {
    const { host } = mount({ ...raw, layout: "grid" });
    expect(host.querySelectorAll('[data-section="slots"] [data-slot-index]')).toHaveLength(2);
  });

  it("appends a slot", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    host.querySelector<HTMLButtonElement>('[data-action="add-slot"]')!.click();
    expect(commit.mock.calls[0]![0].slots).toHaveLength(3);
  });

  it("edits and removes a slot", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    const end = host.querySelectorAll<HTMLInputElement>('[data-field="slot-end"]')[0]!;
    end.value = "09:00";
    end.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].slots![0]!.end).toBe("09:00");

    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-slot"]')[0]!.click();
    expect(commit.mock.calls[1]![0].slots).toHaveLength(1);
  });
});

describe("schedule rows", () => {
  it("renders one group per day and one row per block", () => {
    const { host } = mount();
    expect(host.querySelectorAll("[data-day]")).toHaveLength(2);
    expect(rows(host, "mon")).toHaveLength(2);
    expect(rows(host, "tue")).toHaveLength(1);
  });

  it("shows start and end fields in the blocks layout", () => {
    const { host } = mount();
    const row = rows(host, "mon")[0]!;
    expect(row.querySelector<HTMLInputElement>('[data-field="start"]')!.value).toBe("15:20");
    expect(row.querySelector<HTMLInputElement>('[data-field="end"]')!.value).toBe("16:20");
    expect(row.querySelector('[data-field="slot"]')).toBeNull();
  });

  it("shows a slot dropdown instead of time fields in the grid layout", () => {
    const { host } = mount({ ...raw, layout: "grid" });
    const row = rows(host, "mon")[0]!;
    expect(row.querySelector('[data-field="start"]')).toBeNull();
    expect(row.querySelector<HTMLSelectElement>('[data-field="slot"]')).not.toBeNull();
  });

  it("changing the activity commits the new id", () => {
    const { commit, host } = mount();
    const select = rows(host, "mon")[0]!.querySelector<HTMLSelectElement>('[data-field="activity"]')!;
    select.value = "judo";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].schedule.mon![0]!.activity).toBe("judo");
  });

  it("clears a time with its clear button, producing the until form", () => {
    // Chrome's native time picker offers no way to empty the field, and the
    // open-ended forms are reached only by emptying it.
    const { commit, host } = mount();
    const row = rows(host, "mon")[0]!;
    row.querySelector<HTMLButtonElement>('[data-action="clear-start"]')!.click();
    expect(commit.mock.calls[0]![0].schedule.mon![0]!)
      .toEqual({ activity: "english", end: "16:20" });
  });

  it("offers a clear button only for a time that is set", () => {
    const { host } = mount();
    const range = rows(host, "mon")[0]!;
    expect(range.querySelector('[data-action="clear-start"]')).not.toBeNull();
    expect(range.querySelector('[data-action="clear-end"]')).not.toBeNull();

    const untilOnly = rows(host, "tue")[0]!;
    expect(untilOnly.querySelector('[data-action="clear-start"]')).toBeNull();
    expect(untilOnly.querySelector('[data-action="clear-end"]')).not.toBeNull();
  });

  it("clearing the start field produces the until form", () => {
    const { commit, host } = mount();
    const input = rows(host, "mon")[0]!.querySelector<HTMLInputElement>('[data-field="start"]')!;
    input.value = "";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].schedule.mon![0]!)
      .toEqual({ activity: "english", end: "16:20" });
  });

  it("choosing a slot writes both times, and the none option clears them", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    const select = rows(host, "tue")[0]!.querySelector<HTMLSelectElement>('[data-field="slot"]')!;
    select.value = "2";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].schedule.tue![0]!)
      .toEqual({ activity: "english", start: "08:45", end: "09:30" });

    select.value = "";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[1]![0].schedule.tue![0]!)
      .toEqual({ activity: "english" });
  });

  it("shows a block's real times when they match no slot in grid layout", () => {
    // The slot dropdown replaces the time fields, so without this the block
    // would read as having no times at all even though they are preserved.
    const { host } = mount({ ...raw, layout: "grid" });
    const row = rows(host, "tue")[0]!;
    expect(row.querySelector<HTMLSelectElement>('[data-field="slot"]')!.value).toBe("");
    // The panel renders with the English table, and the wording matters: a
    // bare "16:00" would not say whether it is a start or an end.
    expect(row.querySelector(".hint")!.textContent!.trim()).toBe("until 16:00");
  });

  it("reorders with the move buttons and disables them at the ends", () => {
    const { commit, host } = mount();
    const first = rows(host, "mon")[0]!;
    const last = rows(host, "mon")[1]!;

    expect(first.querySelector<HTMLButtonElement>('[data-action="move-up"]')!.disabled).toBe(true);
    expect(last.querySelector<HTMLButtonElement>('[data-action="move-down"]')!.disabled).toBe(true);

    first.querySelector<HTMLButtonElement>('[data-action="move-down"]')!.click();
    expect(commit.mock.calls[0]![0].schedule.mon!.map((b) => b.activity))
      .toEqual(["judo", "english"]);
  });

  it("moves a block to another day from the day dropdown", () => {
    const { commit, host } = mount();
    const select = rows(host, "mon")[0]!.querySelector<HTMLSelectElement>('[data-field="day"]')!;
    select.value = "tue";
    select.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
    expect(next.schedule.tue!.map((block) => block.activity)).toEqual(["english", "english"]);
  });

  it("does nothing when the day dropdown is set to the day it is already on", () => {
    const { commit, host } = mount();
    const select = rows(host, "mon")[0]!.querySelector<HTMLSelectElement>('[data-field="day"]')!;
    select.value = "mon";
    select.dispatchEvent(new Event("change"));
    expect(commit).not.toHaveBeenCalled();
  });

  it("removes a block", () => {
    const { commit, host } = mount();
    rows(host, "mon")[0]!.querySelector<HTMLButtonElement>('[data-action="remove-block"]')!.click();
    expect(commit.mock.calls[0]![0].schedule.mon!).toHaveLength(1);
  });

  it("adds a block to a day with the first activity", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLButtonElement>('[data-day="tue"] [data-action="add-block"]')!.click();
    expect(commit.mock.calls[0]![0].schedule.tue!).toEqual([
      { activity: "english", end: "16:00" },
      { activity: "english" },
    ]);
  });
});

describe("palette and tap-to-place", () => {
  it("renders a palette chip per activity", () => {
    const { host } = mount();
    expect(host.querySelectorAll(".palette-chip")).toHaveLength(2);
  });

  it("selects an activity on chip click", () => {
    const { onSelectActivity, host } = mount();
    host.querySelectorAll<HTMLButtonElement>(".palette-chip")[1]!.click();
    expect(onSelectActivity).toHaveBeenCalledWith("judo");
  });

  it("deselects when the selected chip is clicked again", () => {
    const config = normaliseConfig(raw);
    const onSelectActivity = vi.fn<(id: string | null) => void>();
    const host = renderToHost(
      renderSchedulePanel(
        { config, strings: en, hass: undefined, commit: vi.fn() },
        { selectedActivity: "judo", onSelectActivity },
      ),
    );
    host.querySelectorAll<HTMLButtonElement>(".palette-chip")[1]!.click();
    expect(onSelectActivity).toHaveBeenCalledWith(null);
  });

  it("appends the selected activity when a day group is clicked, then clears the selection", () => {
    const config = normaliseConfig(raw);
    const commit = vi.fn<(next: CardConfig) => void>();
    const onSelectActivity = vi.fn<(id: string | null) => void>();
    const host = renderToHost(
      renderSchedulePanel(
        { config, strings: en, hass: undefined, commit },
        { selectedActivity: "judo", onSelectActivity },
      ),
    );
    host.querySelector<HTMLElement>('[data-day="tue"]')!.click();

    const tueBlocks = commit.mock.calls[0]![0].schedule.tue!;
    expect(tueBlocks[tueBlocks.length - 1]).toEqual({ activity: "judo" });
    expect(onSelectActivity).toHaveBeenCalledWith(null);
  });

  it("does nothing on a day click with no selection", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLElement>('[data-day="tue"]')!.click();
    expect(commit).not.toHaveBeenCalled();
  });
});
