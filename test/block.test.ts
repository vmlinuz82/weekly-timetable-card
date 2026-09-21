import { describe, expect, it } from "vitest";
import { blockForm } from "../src/block.js";

describe("blockForm", () => {
  it("is a range when both times are present", () => {
    expect(blockForm({ activity: "english", start: "15:20", end: "16:20" })).toBe("range");
  });

  it("is until when only the end is present", () => {
    expect(blockForm({ activity: "daycare", end: "16:00" })).toBe("until");
  });

  it("is after when only the start is present", () => {
    expect(blockForm({ activity: "home", start: "18:30" })).toBe("after");
  });

  it("is bare when neither time is present", () => {
    expect(blockForm({ activity: "free" })).toBe("bare");
  });

  it("treats an empty string as absent", () => {
    expect(blockForm({ activity: "free", start: "", end: "" })).toBe("bare");
    expect(blockForm({ activity: "daycare", start: "", end: "16:00" })).toBe("until");
  });
});
