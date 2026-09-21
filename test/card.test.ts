import { beforeAll, describe, expect, it } from "vitest";
import "../src/card.js";
import type { WeeklyTimetableCard } from "../src/card.js";
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
      .customCards?.find((card) => card.type === "custom:weekly-timetable-card");
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

  it("shows tabs only when there is more than one person", async () => {
    const many = await makeCard(raw);
    expect(shadow(many).querySelectorAll(".tab")).toHaveLength(2);

    const one = await makeCard({ ...raw, people: [raw.people[0]] });
    expect(shadow(one).querySelector(".tabs")).toBeNull();
  });

  it("switches person when a tab is clicked", async () => {
    const card = await makeCard(raw);
    const tabs = shadow(card).querySelectorAll<HTMLButtonElement>(".tab");
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Английски");

    tabs[1]!.click();
    await card.updateComplete;
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Математика");
    expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("re-renders in the viewer's language when hass changes", async () => {
    const card = await makeCard(raw, BG_24H);
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("понеделник");

    card.hass = EN_12H;
    await card.updateComplete;
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("Monday");
  });

  it("clamps the active person when the config shrinks", async () => {
    const card = await makeCard(raw);
    shadow(card).querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await card.updateComplete;

    card.setConfig({ ...raw, people: [raw.people[0]] });
    await card.updateComplete;
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Английски");
  });

  it("sets the header colour and a contrasting header text colour", async () => {
    const card = await makeCard({ ...raw, header_color: "#ffffff" });
    const haCard = shadow(card).querySelector<HTMLElement>("ha-card")!;
    expect(haCard.style.getPropertyValue("--wtc-header-color")).toBe("#ffffff");
    expect(haCard.style.getPropertyValue("--wtc-header-text")).toBe("#0f172a");
  });

  it("offers a stub config for the card picker", () => {
    const stub = (customElements.get("weekly-timetable-card") as typeof WeeklyTimetableCard)
      .getStubConfig(BG_24H);
    expect(stub.people).toHaveLength(1);
    expect(stub.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });
});
