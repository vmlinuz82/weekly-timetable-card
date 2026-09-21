import { describe, expect, it } from "vitest";
import { bg } from "../src/i18n/bg.js";
import { en } from "../src/i18n/en.js";
import { resolveLang, stringsFor } from "../src/i18n/index.js";
import { DAY_KEYS } from "../src/types.js";

describe("string tables", () => {
  it("have identical top-level keys", () => {
    expect(Object.keys(bg).sort()).toEqual(Object.keys(en).sort());
  });

  it("have identical editor keys", () => {
    expect(Object.keys(bg.editor).sort()).toEqual(Object.keys(en.editor).sort());
  });

  it("cover all seven days with non-empty full and short forms", () => {
    for (const table of [en, bg]) {
      for (const day of DAY_KEYS) {
        expect(table.days[day].full.length).toBeGreaterThan(0);
        expect(table.days[day].short.length).toBeGreaterThan(0);
      }
    }
  });

  it("uses authored two-letter Bulgarian abbreviations, not truncations", () => {
    expect(bg.days.thu.short).toBe("чт");
    expect(bg.days.sun.short).toBe("нд");
  });

  it("phrases open-ended times per language", () => {
    expect(bg.until("16:00")).toBe("до 16:00");
    expect(bg.after("18:30")).toBe("след 18:30");
    expect(en.until("4:00 PM")).toBe("until 4:00 PM");
    expect(en.after("6:30 PM")).toBe("after 6:30 PM");
  });

  it("pluralises the in-use warning", () => {
    expect(en.editor.activityInUse("Chess", 1)).toContain("1 block.");
    expect(en.editor.activityInUse("Chess", 3)).toContain("3 blocks.");
    expect(bg.editor.activityInUse("Шах", 1)).toContain("1 блок.");
    expect(bg.editor.activityInUse("Шах", 3)).toContain("3 блока.");
  });
});

describe("resolveLang", () => {
  it("honours an explicit language over hass", () => {
    expect(resolveLang({ language: "bg" }, { language: "en" })).toBe("bg");
    expect(resolveLang({ language: "en" }, { language: "bg" })).toBe("en");
  });

  it("detects Bulgarian from hass on auto", () => {
    expect(resolveLang({ language: "auto" }, { language: "bg" })).toBe("bg");
    expect(resolveLang({ language: "auto" }, { language: "BG-bg" })).toBe("bg");
  });

  it("falls back to English for anything else or no hass", () => {
    expect(resolveLang({ language: "auto" }, { language: "de" })).toBe("en");
    expect(resolveLang({ language: "auto" }, {})).toBe("en");
    expect(resolveLang({ language: "auto" })).toBe("en");
  });
});

describe("stringsFor", () => {
  it("returns the matching table", () => {
    expect(stringsFor("bg")).toBe(bg);
    expect(stringsFor("en")).toBe(en);
  });
});
