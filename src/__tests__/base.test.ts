import { describe, it, expect } from "vitest";
import { windctrl } from "../";

describe("windctrl", () => {
  describe("Base classes", () => {
    it("should apply base classes when provided", () => {
      const button = windctrl({
        base: "rounded px-4 py-2",
      });

      const result = button();
      expect(result.className).toContain("rounded");
      expect(result.className).toContain("px-4");
      expect(result.className).toContain("py-2");
      expect(result.style).toEqual(undefined);
    });

    it("should work without base classes", () => {
      const button = windctrl({});

      const result = button({});
      expect(result.className).toBe("");
      expect(result.style).toEqual(undefined);
    });
  });
});
