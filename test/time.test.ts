import { describe, expect, it } from "vitest";
import { addMinutes, formatTime, localeUsesHour12, resolveHour12 } from "../src/time.js";

const flat = (value: string) => value.replace(/ /g, " ");

describe("localeUsesHour12", () => {
  it("is true for US English and false for Bulgarian and British English", () => {
    expect(localeUsesHour12("en-US")).toBe(true);
    expect(localeUsesHour12("bg")).toBe(false);
    expect(localeUsesHour12("en-GB")).toBe(false);
  });

  it("is false for an unusable locale rather than throwing", () => {
    expect(localeUsesHour12("!!not a locale!!")).toBe(false);
  });
});

describe("resolveHour12", () => {
  it("honours an explicit 12 or 24 setting over the language", () => {
    expect(resolveHour12({ language: "bg", locale: { time_format: "12" } }, "bg")).toBe(true);
    expect(resolveHour12({ language: "en-US", locale: { time_format: "24" } }, "en")).toBe(false);
  });

  it("derives from the Home Assistant language when set to language", () => {
    expect(resolveHour12({ language: "en-US", locale: { time_format: "language" } }, "en")).toBe(true);
    expect(resolveHour12({ language: "bg", locale: { time_format: "language" } }, "bg")).toBe(false);
  });

  it("derives from the language when nothing is set", () => {
    expect(resolveHour12({ language: "en-US" }, "en")).toBe(true);
    expect(resolveHour12({ language: "bg" }, "bg")).toBe(false);
  });

  it("falls back to the card language when hass is absent", () => {
    expect(resolveHour12(undefined, "bg")).toBe(false);
    expect(resolveHour12(undefined, "en")).toBe(false);
  });
});

describe("formatTime", () => {
  it("zero-pads in 24-hour mode without going through Intl", () => {
    expect(formatTime("9:05", { locale: { time_format: "24" } }, "bg")).toBe("09:05");
    expect(formatTime("15:20", { locale: { time_format: "24" } }, "bg")).toBe("15:20");
    expect(formatTime("00:00", { locale: { time_format: "24" } }, "bg")).toBe("00:00");
  });

  it("formats 12-hour times for an English user", () => {
    const hass = { language: "en-US", locale: { time_format: "12" as const } };
    expect(flat(formatTime("15:20", hass, "en"))).toBe("3:20 PM");
    expect(flat(formatTime("00:30", hass, "en"))).toBe("12:30 AM");
    expect(flat(formatTime("12:00", hass, "en"))).toBe("12:00 PM");
  });

  it("renders an unparseable value verbatim rather than Invalid Date", () => {
    const hass = { language: "en-US", locale: { time_format: "12" as const } };
    expect(formatTime("half four", hass, "en")).toBe("half four");
    expect(formatTime("25:00", hass, "en")).toBe("25:00");
    expect(formatTime("15:99", hass, "en")).toBe("15:99");
  });

  it("trims before parsing", () => {
    expect(formatTime(" 15:20 ", { locale: { time_format: "24" } }, "bg")).toBe("15:20");
  });
});

describe("addMinutes", () => {
  it("adds within the hour and across it", () => {
    expect(addMinutes("08:00", 45)).toBe("08:45");
    expect(addMinutes("08:45", 45)).toBe("09:30");
  });

  it("wraps around midnight in both directions", () => {
    expect(addMinutes("23:30", 45)).toBe("00:15");
    expect(addMinutes("00:15", -45)).toBe("23:30");
  });

  it("returns an unparseable value unchanged", () => {
    expect(addMinutes("half four", 45)).toBe("half four");
  });
});
