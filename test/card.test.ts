import { beforeAll, describe, expect, it } from "vitest";
import "../src/card.js";
import type { WeeklyTimetableCard } from "../src/card.js";
import { getStubConfig } from "../src/config.js";
import { BG_24H, EN_12H } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "maths", label: "Математика", color: "#22c55e" },
  ],
  people: [
    { name: "Иван", emoji: "🥋", schedule: { mon: [{ activity: "english" }], tue: [] } },
    { name: "Мария", emoji: "🎻", schedule: { mon: [{ activity: "maths" }], tue: [] } },
  ],
};

async function makeCard(config: unknown, hass = BG_24H): Promise<WeeklyTimetableCard> {
  const card = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
  card.hass = hass;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
}

const shadow = (card: WeeklyTimetableCard) => card.shadowRoot!;

describe("WeeklyTimetableCard", () => {
  beforeAll(() => {
    document.body.innerHTML = "";
  });

  it("is registered under the distinct element name", () => {
    expect(customElements.get("weekly-timetable-card")).toBeDefined();
  });

  it("advertises itself to the Add-card picker", () => {
    const entry = (window as unknown as { customCards?: Array<Record<string, unknown>> })
      // HA's card picker prepends "custom:" itself when it builds the config,
      // so the registry entry carries the bare element name. Verified against
      // the upstream lovelace-timetable-card, which pushes "timetable-card".
      .customCards?.find((card) => card.type === "weekly-timetable-card");
    expect(entry).toBeDefined();
    expect(entry!.preview).toBe(true);
  });

  it("propagates a config error from setConfig so HA can display it", () => {
    const card = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
    expect(() => card.setConfig({})).toThrow(/people/);
  });

  it("renders the blocks layout by default", async () => {
    const card = await makeCard(raw);
    expect(shadow(card).querySelector(".week")).not.toBeNull();
    expect(shadow(card).querySelector(".grid")).toBeNull();
  });

  it("renders the grid layout when configured", async () => {
    const card = await makeCard({
      ...raw,
      layout: "grid",
      people: [
        {
          name: "Иван",
          slots: [{ slot: 1, start: "08:00", end: "08:45" }],
          schedule: { mon: [{ activity: "english", start: "08:00", end: "08:45" }], tue: [] },
        },
      ],
    });
    expect(shadow(card).querySelector(".grid")).not.toBeNull();
  });

  it("falls back to the blocks layout when stacked, even in grid mode", async () => {
    const card = await makeCard({ ...raw, layout: "grid" });
    card.density = "stacked";
    await card.updateComplete;
    expect(shadow(card).querySelector(".week")).not.toBeNull();
    expect(shadow(card).querySelector(".grid")).toBeNull();
  });

  it("exposes the density on the body so CSS can key off it", async () => {
    const card = await makeCard(raw);
    card.density = "compact";
    await card.updateComplete;
    expect(shadow(card).querySelector(".body")!.getAttribute("data-density")).toBe("compact");
  });

  it("renders the title only when one is configured", async () => {
    expect(shadow(await makeCard(raw)).querySelector(".card-title")).toBeNull();
    const titled = await makeCard({ ...raw, title: "Седмична програма" });
    expect(shadow(titled).querySelector(".card-title")!.textContent!.trim())
      .toBe("Седмична програма");
  });

  it("never renders person tabs", async () => {
    const el = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
    document.body.append(el);
    el.setConfig(getStubConfig());
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector(".tabs")).toBeNull();
    el.remove();
  });

  it("re-renders in the viewer's language when hass changes", async () => {
    const card = await makeCard(raw, BG_24H);
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("понеделник");

    card.hass = EN_12H;
    await card.updateComplete;
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("Monday");
  });

  it("sets the header colour and a contrasting header text colour", async () => {
    const card = await makeCard({ ...raw, header_color: "#ffffff" });
    const haCard = shadow(card).querySelector<HTMLElement>("ha-card")!;
    expect(haCard.style.getPropertyValue("--wtc-header-color")).toBe("#ffffff");
    expect(haCard.style.getPropertyValue("--wtc-header-text")).toBe("#0f172a");
  });

  it("recomputes density when the day count changes without a resize", async () => {
    // jsdom has no ResizeObserver, so the card never measures a real width.
    // Poke the cached width the observer would have recorded, the same way a
    // real resize does, then trigger a re-render through a config change
    // rather than a resize — that is exactly the gap this test guards.
    const card = await makeCard({ ...raw, days: ["mon", "tue", "wed", "thu", "fri"] });
    (card as unknown as { _measuredWidth: number })._measuredWidth = 400;
    card.requestUpdate();
    await card.updateComplete;
    // 400px / 5 days = 80px per column: compact (>=72, <110).
    expect(card.density).toBe("compact");

    card.setConfig({
      ...raw,
      days: ["mon", "tue", "wed", "thu", "fri"],
      people: [
        { ...raw.people[0], days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
        raw.people[1],
      ],
    });
    await card.updateComplete;
    // Same 400px, but now 7 days: 400/7 ≈ 57px per column: stacked (<72).
    expect(card.density).toBe("stacked");
  });

  it("offers a stub config for the card picker", () => {
    const stub = (customElements.get("weekly-timetable-card") as typeof WeeklyTimetableCard)
      .getStubConfig(BG_24H);
    expect(stub.people).toHaveLength(1);
    expect(stub.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });
});

describe("editor wiring", () => {
  it("returns the editor element for HA's config dialog", () => {
    const element = (customElements.get("weekly-timetable-card") as typeof WeeklyTimetableCard)
      .getConfigElement();
    expect(element.tagName.toLowerCase()).toBe("weekly-timetable-card-editor");
  });
});
