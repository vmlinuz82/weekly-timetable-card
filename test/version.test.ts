import { describe, expect, it } from "vitest";
import { CARD_VERSION } from "../src/version.js";

describe("CARD_VERSION", () => {
  it("is a semver string", () => {
    expect(CARD_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
